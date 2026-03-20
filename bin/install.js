#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);

const FLAG = {
  GLOBAL:     'global',
  LOCAL:      'local',
  CONFIG_DIR: 'config-dir',
  CLAUDE:     'claude',
  VSCODE:     'vscode',
  CURSOR:     'cursor',
  ALL:        'all',
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
    'SlopBuster — constraint-first AI development',
    '',
    'Usage:',
    '  npx slopbuster [options]',
    '',
    'Installs slash commands for your AI editor AND scaffolds .slopbuster/ in',
    'the current directory so you can start planning immediately.',
    '',
    'Editor targets (auto-detected if none specified):',
    '  --claude        Install to ~/.claude/  (Claude Code)',
    '  --vscode        Install to .github/prompts/ + .vscode/mcp.json',
    '  --cursor        Install to .cursor/rules/ + .cursor/mcp.json',
    '  --all           Install for all three editors',
    '',
    'Claude Code options:',
    '  --local         Install to ./.claude/ instead of ~/.claude/',
    '  --config-dir    Install Claude Code files to a custom path',
    '',
    'General:',
    '  --uninstall     Remove SlopBuster from the installed location',
    '  --dry-run       Show what would be installed without writing anything',
    '  --verbose       Show each file as it installs',
    '  --help          Show this help',
    '',
    'No Node.js? Use the shell installer:',
    '  curl -fsSL https://raw.githubusercontent.com/kwad77/slopbuster/master/bin/install.sh | sh',
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
  claude:    has(FLAG.CLAUDE),
  vscode:    has(FLAG.VSCODE),
  cursor:    has(FLAG.CURSOR),
  all:       has(FLAG.ALL),
};

// Determine which editors to target
// If no editor flag given, auto-detect based on what's present in cwd
function detectEditors() {
  const cwd = process.cwd();
  const detected = [];
  if (fs.existsSync(path.join(cwd, '.cursor'))) detected.push('cursor');
  if (fs.existsSync(path.join(cwd, '.vscode'))) detected.push('vscode');
  // Claude Code is always included as default
  detected.push('claude');
  return detected;
}

let targetEditors;
if (flags.all) {
  targetEditors = ['claude', 'vscode', 'cursor'];
} else if (flags.claude || flags.vscode || flags.cursor) {
  targetEditors = [];
  if (flags.claude) targetEditors.push('claude');
  if (flags.vscode) targetEditors.push('vscode');
  if (flags.cursor) targetEditors.push('cursor');
} else {
  targetEditors = detectEditors();
}

// ─── Claude Code paths ────────────────────────────────────────────────────────

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
const mcpServerPath = path.join(__dirname, 'mcp-server.js').replace(/\\/g, '/');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) { console.log(msg); }
function verbose(msg) { if (flags.verbose) console.log('  ' + msg); }

function copyFile(srcFile, destFile) {
  if (!flags.dryRun) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFile, destFile);
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

function writeMcpConfig(mcpFile, configContent) {
  if (flags.dryRun) return;
  fs.mkdirSync(path.dirname(mcpFile), { recursive: true });

  // Merge with existing config if present
  if (fs.existsSync(mcpFile)) {
    let existing;
    try { existing = JSON.parse(fs.readFileSync(mcpFile, 'utf8')); } catch { existing = {}; }
    const merged = deepMerge(existing, configContent);
    fs.writeFileSync(mcpFile, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  } else {
    fs.writeFileSync(mcpFile, JSON.stringify(configContent, null, 2) + '\n', 'utf8');
  }
}

function deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// ─── Uninstall ────────────────────────────────────────────────────────────────

function uninstall() {
  let removed = 0;

  if (targetEditors.includes('claude')) {
    for (const dir of [commandsTarget, frameworkTarget]) {
      if (fs.existsSync(dir)) {
        if (!flags.dryRun) fs.rmSync(dir, { recursive: true, force: true });
        verbose(`Removed ${dir}`);
        removed++;
      }
    }
  }

  const cwd = process.cwd();

  if (targetEditors.includes('vscode')) {
    const promptsDir = path.join(cwd, '.github', 'prompts');
    const mcpFile = path.join(cwd, '.vscode', 'mcp.json');
    if (fs.existsSync(promptsDir)) {
      // Remove only sb-*.prompt.md files
      for (const f of fs.readdirSync(promptsDir)) {
        if (f.startsWith('sb-') && f.endsWith('.prompt.md')) {
          if (!flags.dryRun) fs.unlinkSync(path.join(promptsDir, f));
          verbose(`Removed .github/prompts/${f}`);
          removed++;
        }
      }
    }
    if (fs.existsSync(mcpFile)) {
      try {
        const config = JSON.parse(fs.readFileSync(mcpFile, 'utf8'));
        if (config.servers && config.servers.slopbuster) {
          delete config.servers.slopbuster;
          if (!flags.dryRun) fs.writeFileSync(mcpFile, JSON.stringify(config, null, 2) + '\n', 'utf8');
          verbose(`Removed slopbuster from .vscode/mcp.json`);
          removed++;
        }
      } catch { /* ignore */ }
    }
  }

  if (targetEditors.includes('cursor')) {
    const rulesDir = path.join(cwd, '.cursor', 'rules');
    const mcpFile = path.join(cwd, '.cursor', 'mcp.json');
    if (fs.existsSync(rulesDir)) {
      for (const f of fs.readdirSync(rulesDir)) {
        if (f.startsWith('slopbuster-') && f.endsWith('.mdc')) {
          if (!flags.dryRun) fs.unlinkSync(path.join(rulesDir, f));
          verbose(`Removed .cursor/rules/${f}`);
          removed++;
        }
      }
    }
    if (fs.existsSync(mcpFile)) {
      try {
        const config = JSON.parse(fs.readFileSync(mcpFile, 'utf8'));
        if (config.mcpServers && config.mcpServers.slopbuster) {
          delete config.mcpServers.slopbuster;
          if (!flags.dryRun) fs.writeFileSync(mcpFile, JSON.stringify(config, null, 2) + '\n', 'utf8');
          verbose(`Removed slopbuster from .cursor/mcp.json`);
          removed++;
        }
      } catch { /* ignore */ }
    }
  }

  const prefix = flags.dryRun ? '[dry-run] ' : '';
  if (removed > 0) {
    log(`${prefix}✓ SlopBuster uninstalled`);
  } else {
    log('Nothing to uninstall — SlopBuster files were not found');
  }
}

// ─── Install: Claude Code ─────────────────────────────────────────────────────

function installClaude() {
  if (!fs.existsSync(srcDir)) {
    console.error('Error: src/ directory not found. Is this a valid SlopBuster installation?');
    process.exit(1);
  }

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
  log(`${prefix}✓ Claude Code — commands/sb (${counts.commands}), workflows (${counts.workflows}), templates (${counts.templates}), references (${counts.references})  →  ${targetPrefix}`);
  return total;
}

// ─── Install: VS Code ─────────────────────────────────────────────────────────

function installVSCode() {
  const cwd = process.cwd();
  const promptsSrc = path.join(srcDir, 'vscode', 'prompts');
  const promptsDest = path.join(cwd, '.github', 'prompts');
  const mcpFile = path.join(cwd, '.vscode', 'mcp.json');

  if (!fs.existsSync(promptsSrc)) {
    log('⚠  VS Code prompts not found in src/vscode/prompts/ — skipping');
    return 0;
  }

  let count = 0;
  if (!flags.dryRun) fs.mkdirSync(promptsDest, { recursive: true });
  for (const file of fs.readdirSync(promptsSrc)) {
    copyFile(path.join(promptsSrc, file), path.join(promptsDest, file));
    verbose(`.github/prompts/${file}`);
    count++;
  }

  // Register MCP server in .vscode/mcp.json
  const mcpConfig = {
    servers: {
      slopbuster: {
        type: 'stdio',
        command: 'node',
        args: [mcpServerPath],
        description: 'SlopBuster Gate enforcement — provides elicitation-based circuit breaker',
      },
    },
  };

  if (!flags.dryRun) {
    writeMcpConfig(mcpFile, mcpConfig);
  }
  verbose(`.vscode/mcp.json — slopbuster server registered`);

  const prefix = flags.dryRun ? '[dry-run] ' : '';
  log(`${prefix}✓ VS Code — .github/prompts/ (${count} prompt files) + .vscode/mcp.json`);
  return count;
}

// ─── Install: Cursor ──────────────────────────────────────────────────────────

function installCursor() {
  const cwd = process.cwd();
  const rulesSrc = path.join(srcDir, 'cursor', 'rules');
  const rulesDest = path.join(cwd, '.cursor', 'rules');
  const mcpFile = path.join(cwd, '.cursor', 'mcp.json');

  if (!fs.existsSync(rulesSrc)) {
    log('⚠  Cursor rules not found in src/cursor/rules/ — skipping');
    return 0;
  }

  let count = 0;
  if (!flags.dryRun) fs.mkdirSync(rulesDest, { recursive: true });
  for (const file of fs.readdirSync(rulesSrc)) {
    copyFile(path.join(rulesSrc, file), path.join(rulesDest, file));
    verbose(`.cursor/rules/${file}`);
    count++;
  }

  // Register MCP server in .cursor/mcp.json
  const mcpConfig = {
    mcpServers: {
      slopbuster: {
        command: 'node',
        args: [mcpServerPath],
      },
    },
  };

  if (!flags.dryRun) {
    writeMcpConfig(mcpFile, mcpConfig);
  }
  verbose(`.cursor/mcp.json — slopbuster server registered`);

  const prefix = flags.dryRun ? '[dry-run] ' : '';
  log(`${prefix}✓ Cursor  — .cursor/rules/ (${count} rule files) + .cursor/mcp.json`);
  return count;
}

// ─── Scaffold .slopbuster/ ────────────────────────────────────────────────────

function scaffoldProject() {
  const cwd = process.cwd();
  const sbDir = path.join(cwd, '.slopbuster');

  if (fs.existsSync(sbDir)) {
    log('  .slopbuster/ already exists — keeping your existing project (run /sb:init to reinitialize)');
    return;
  }

  // Detect project name and stack from package.json if available
  let projectName = path.basename(cwd);
  let projectStack = '(fill in: languages, frameworks, databases, services)';
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    if (pkg.name) projectName = pkg.name;
    const deps = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) });
    if (deps.length > 0) projectStack = deps.slice(0, 8).join(', ');
  } catch { /* no package.json — use defaults */ }

  const today = new Date().toISOString().slice(0, 10);

  const dirs = [
    sbDir,
    path.join(sbDir, 'phases'),
    path.join(sbDir, 'stewards'),
    path.join(sbDir, 'records'),
  ];

  if (!flags.dryRun) {
    for (const dir of dirs) fs.mkdirSync(dir, { recursive: true });
  }

  const projectMd = [
    `# ${projectName}`,
    '',
    '**Core value:** (edit this — what must this project do above all else? If everything else fails but this works, you shipped.)',
    '',
    '**Description:** (one sentence — what is this project and who does it serve?)',
    '',
    `**Initialized:** ${today}`,
    '',
    '---',
    '',
    '## Context',
    '',
    '(Why this project exists, who it is for, and what problem it solves.)',
    '',
    '## Stack',
    '',
    projectStack,
    '',
    '## Constraints',
    '',
    '(Known constraints — technology choices already made, compliance requirements, architectural decisions not up for debate.)',
    '',
    '## Out of Scope',
    '',
    '(What this project explicitly does not do. Being clear here prevents scope creep.)',
    '',
  ].join('\n');

  // STATE.md — clean template with today's date filled in
  let stateMd = fs.readFileSync(path.join(srcDir, 'templates', 'STATE.md'), 'utf8');
  stateMd = stateMd
    .replace('[YYYY-MM-DD HH:MM] — [what happened]', `${today} — Initialized`)
    .replace('# gate_pending: [plan-path]', '')
    .replace('# checkpoint_at: [task-name]', '')
    .replace('[exact command with path]', '/sb:plan');

  // ROADMAP.md — project name and date filled in
  let roadmapMd = fs.readFileSync(path.join(srcDir, 'templates', 'ROADMAP.md'), 'utf8');
  roadmapMd = roadmapMd
    .replace('[Project Name]', projectName)
    .replace('[YYYY-MM-DD]', today);

  const configMd = fs.readFileSync(path.join(srcDir, 'templates', 'config.md'), 'utf8');

  const stewardsReadme = [
    '# Domain Stewardship',
    '',
    'Domain teams drop files here. Each file injects Gate questions automatically when a plan touches that domain.',
    '',
    '## Quick start',
    '',
    '1. Create a steward file for your domain (e.g. `database.md`, `auth.md`, `payments.md`)',
    '2. Set `stewards.enabled: true` in `.slopbuster/config.md`',
    '3. The Gate auto-imports matching steward files on every plan',
    '',
    '## File format',
    '',
    '```yaml',
    '---',
    'owner: "DBA Team <dba@company.com>"',
    'triggers: [database]',
    'file_paths: ["**/migrations/**", "**/models/**"]',
    '---',
    '',
    '## Additional Gate Questions',
    '',
    '### Q-Database-1: Index strategy',
    'What indexes does this change require? Have they been reviewed for production data volume?',
    '',
    '## Required Checklist Items',
    '',
    '- [ ] Migration tested in staging with production data volume',
    '- [ ] Rollback migration written and tested',
    '',
    '## Approved Patterns',
    '',
    '- Using the standard migration framework (no raw SQL DDL)',
    '',
    '## Anti-Patterns',
    '',
    '- Dropping columns without a deprecation period',
    '```',
    '',
    'Domains to cover: database · auth · payments · network · infrastructure · data-privacy',
    '',
  ].join('\n');

  if (!flags.dryRun) {
    fs.writeFileSync(path.join(sbDir, 'PROJECT.md'), projectMd);
    fs.writeFileSync(path.join(sbDir, 'STATE.md'), stateMd);
    fs.writeFileSync(path.join(sbDir, 'ROADMAP.md'), roadmapMd);
    fs.writeFileSync(path.join(sbDir, 'config.md'), configMd);
    fs.writeFileSync(path.join(sbDir, 'stewards', 'README.md'), stewardsReadme);
  }

  const prefix = flags.dryRun ? '[dry-run] ' : '';
  log(`${prefix}✓ .slopbuster/ scaffolded — PROJECT.md · STATE.md · ROADMAP.md · config.md`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (flags.uninstall) {
  uninstall();
} else {
  if (!fs.existsSync(srcDir)) {
    console.error('');
    console.error('  Error: src/ directory not found.');
    console.error('  This usually means the package was not installed correctly.');
    console.error('  Try: npx slopbuster@latest');
    console.error('');
    process.exit(1);
  }

  if (flags.dryRun) log(`[dry-run] No files will be written.\n`);

  let total = 0;
  if (targetEditors.includes('claude')) total += installClaude();
  if (targetEditors.includes('vscode')) total += installVSCode();
  if (targetEditors.includes('cursor')) total += installCursor();

  // Auto-scaffold .slopbuster/ in current project directory
  if (!flags.dryRun || flags.verbose) {
    log('');
    scaffoldProject();
  }

  if (!flags.dryRun) {
    log('');
    log('─────────────────────────────────────────');
    log('');

    if (fs.existsSync(path.join(process.cwd(), '.slopbuster'))) {
      log('Next: edit .slopbuster/PROJECT.md → set your project name and core value');
      log('');
    }

    if (targetEditors.includes('claude')) {
      log('  Claude Code   →  /sb:plan   (start your first plan)');
    }
    if (targetEditors.includes('vscode')) {
      log('  VS Code       →  /sb-plan   (Copilot Chat — agent mode)');
    }
    if (targetEditors.includes('cursor')) {
      log('  Cursor        →  /sb-plan   (Cursor Chat)');
    }

    log('');
    log('  /sb:help for the full command reference');
    log('');

    if (targetEditors.includes('vscode') || targetEditors.includes('cursor')) {
      log('  MCP Gate: connect the slopbuster server in your editor');
      log('  VS Code 1.103+ / Cursor 1.5+ → Gate opens a native form dialog');
      log('');
    }
  } else {
    log(`\n[dry-run] ${total} files would be installed. Remove --dry-run to install.`);
  }
}
