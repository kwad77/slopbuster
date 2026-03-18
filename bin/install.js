#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);

const FLAG = {
  GLOBAL:     'global',
  LOCAL:      'local',
  CONFIG_DIR: 'config-dir',
  UNINSTALL:  'uninstall',
  VERBOSE:    'verbose',
  DRY_RUN:    'dry-run',
  HELP:       'help',
};

function has(flag) { return args.includes('--' + flag); }
function val(flag) {
  const i = args.indexOf('--' + flag);
  return i !== -1 ? args[i + 1] : null;
}

if (has(FLAG.HELP) || args.includes('-h')) {
  console.log([
    '',
    'SlopBuster installer',
    '',
    'Usage:',
    '  npx slopbuster [options]',
    '',
    'Options:',
    '  --global        Install to ~/.claude/ (default)',
    '  --local         Install to ./.claude/',
    '  --config-dir    Install to a custom path',
    '  --uninstall     Remove SlopBuster from the target location',
    '  --dry-run       Show what would be installed without writing anything',
    '  --verbose       Show each file as it is installed',
    '  --help          Show this help',
    '',
  ].join('\n'));
  process.exit(0);
}

const configDir = val(FLAG.CONFIG_DIR);

const flags = {
  local:     has(FLAG.LOCAL),
  uninstall: has(FLAG.UNINSTALL),
  verbose:   has(FLAG.VERBOSE),
  dryRun:    has(FLAG.DRY_RUN),
  global:    has(FLAG.GLOBAL) || (!has(FLAG.LOCAL) && !configDir),
};

// Resolve target prefix
let targetPrefix;
if (configDir) {
  targetPrefix = path.resolve(configDir);
} else if (flags.local) {
  targetPrefix = path.resolve('.claude');
} else {
  targetPrefix = path.join(os.homedir(), '.claude');
}

const commandsTarget = path.join(targetPrefix, 'commands', 'sb');
const frameworkTarget = path.join(targetPrefix, 'slopbuster-framework');
const srcDir = path.join(__dirname, '..', 'src');

function log(msg) {
  console.log(msg);
}

function verbose(msg) {
  if (flags.verbose) console.log('  ' + msg);
}

function uninstall() {
  let removed = 0;
  for (const dir of [commandsTarget, frameworkTarget]) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      verbose(`Removed ${dir}`);
      removed++;
    }
  }
  if (removed > 0) {
    log('✓ SlopBuster uninstalled');
  } else {
    log('Nothing to uninstall — SlopBuster was not found at ' + targetPrefix);
  }
}

function copyWithPathReplacement(srcFile, destFile) {
  let content = fs.readFileSync(srcFile, 'utf8');

  // Rewrite @src/ references to installed absolute paths
  // Use forward slashes for cross-platform Claude Code compatibility
  const fwTarget = frameworkTarget.replace(/\\/g, '/');
  content = content.replace(/@src\/workflows\//g, `@${fwTarget}/workflows/`);
  content = content.replace(/@src\/templates\//g, `@${fwTarget}/templates/`);
  content = content.replace(/@src\/references\//g, `@${fwTarget}/references/`);

  if (!flags.dryRun) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.writeFileSync(destFile, content, 'utf8');
  }
}

function install() {
  if (!fs.existsSync(srcDir)) {
    console.error('Error: src/ directory not found. Is this a valid SlopBuster installation?');
    process.exit(1);
  }

  if (flags.dryRun) log(`[dry-run] Would install to ${targetPrefix}`);

  const counts = { commands: 0, workflows: 0, templates: 0, references: 0 };

  // Commands → targetPrefix/commands/sb/
  const commandsSrc = path.join(srcDir, 'commands');
  if (fs.existsSync(commandsSrc)) {
    if (!flags.dryRun) fs.mkdirSync(commandsTarget, { recursive: true });
    for (const file of fs.readdirSync(commandsSrc)) {
      const src = path.join(commandsSrc, file);
      const dest = path.join(commandsTarget, file);
      copyWithPathReplacement(src, dest);
      verbose(`commands/sb/${file}`);
      counts.commands++;
    }
  }

  // workflows, templates, references → targetPrefix/slopbuster-framework/{subdir}/
  for (const subdir of ['workflows', 'templates', 'references']) {
    const subdirSrc = path.join(srcDir, subdir);
    const subdirDest = path.join(frameworkTarget, subdir);
    if (fs.existsSync(subdirSrc)) {
      if (!flags.dryRun) fs.mkdirSync(subdirDest, { recursive: true });
      for (const file of fs.readdirSync(subdirSrc)) {
        const src = path.join(subdirSrc, file);
        const dest = path.join(subdirDest, file);
        copyWithPathReplacement(src, dest);
        verbose(`slopbuster-framework/${subdir}/${file}`);
        counts[subdir]++;
      }
    }
  }

  const total = counts.commands + counts.workflows + counts.templates + counts.references;

  const prefix = flags.dryRun ? '[dry-run] ' : '';
  log(`${prefix}✓ commands/sb            (${counts.commands} files)`);
  log(`${prefix}✓ workflows              (${counts.workflows} files)`);
  log(`${prefix}✓ templates              (${counts.templates} files)`);
  log(`${prefix}✓ references             (${counts.references} files)`);
  if (flags.dryRun) {
    log(`\n[dry-run] No files written. Remove --dry-run to install.`);
  } else {
    log(`\nSlopBuster installed — ${total} files → ${targetPrefix}`);
    log(`\nOpen Claude Code and run /sb:help to get started.`);
  }
}

if (flags.uninstall) {
  uninstall();
} else {
  install();
}
