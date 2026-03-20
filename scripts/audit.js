#!/usr/bin/env node
/**
 * SlopBuster framework audit — mechanical quality metric
 * Score = ref_integrity(40) + completeness(35) + consistency(25)
 * Higher is better. Max = 100.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const issues = [];
const passes = [];

// ── Helpers ────────────────────────────────────────────────────────────────

function readSrc(rel) {
  return fs.readFileSync(path.join(srcDir, rel), 'utf8');
}

function srcExists(rel) {
  return fs.existsSync(path.join(srcDir, rel));
}

function files(subdir) {
  const d = path.join(srcDir, subdir);
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.md')) : [];
}

function issue(msg) { issues.push(msg); }
function pass(msg)  { passes.push(msg); }

// ── 1. Reference Integrity (40 pts) ────────────────────────────────────────

const allSrcFiles = [
  ...files('commands').map(f => `commands/${f}`),
  ...files('workflows').map(f => `workflows/${f}`),
  ...files('templates').map(f => `templates/${f}`),
  ...files('references').map(f => `references/${f}`),
];

let brokenRefs = 0;
let totalRefs = 0;

for (const rel of allSrcFiles) {
  const content = readSrc(rel);
  const refs = [...content.matchAll(/@src\/(workflows|templates|references)\/([^\s\)]+\.md)/g)];
  for (const m of refs) {
    totalRefs++;
    const target = `${m[1]}/${m[2]}`;
    if (!srcExists(target)) {
      issue(`BROKEN REF in ${rel}: @src/${target} not found`);
      brokenRefs++;
    }
  }
}

if (totalRefs === 0) {
  issue('No @src/ references found in any file');
} else {
  pass(`${totalRefs - brokenRefs}/${totalRefs} @src/ references resolve correctly`);
}

const refScore = totalRefs === 0 ? 0 : Math.round(((totalRefs - brokenRefs) / totalRefs) * 40);

// ── 2. Completeness (35 pts) ────────────────────────────────────────────────

// 2a. All 17 commands exist
const expectedCommands = [
  'help','init','plan','gate','apply','unify',
  'progress','resume','pause','discuss','research',
  'milestone','roadmap','verify','fix','audit','config'
];
let missingCommands = 0;
for (const cmd of expectedCommands) {
  if (!srcExists(`commands/${cmd}.md`)) {
    issue(`MISSING command: src/commands/${cmd}.md`);
    missingCommands++;
  }
}
if (missingCommands === 0) pass(`All ${expectedCommands.length} commands present`);

// 2b. All referenced workflows exist (commands → workflows)
const workflowsReferenced = new Set();
for (const f of files('commands')) {
  const content = readSrc(`commands/${f}`);
  const refs = [...content.matchAll(/@src\/workflows\/([^\s]+\.md)/g)];
  for (const m of refs) workflowsReferenced.add(m[1]);
}
let missingWorkflows = 0;
for (const wf of workflowsReferenced) {
  if (!srcExists(`workflows/${wf}`)) {
    issue(`MISSING workflow: src/workflows/${wf}`);
    missingWorkflows++;
  }
}
if (missingWorkflows === 0) pass(`All ${workflowsReferenced.size} referenced workflows exist`);

// 2c. All commands have a description in frontmatter
let missingDesc = 0;
for (const f of files('commands')) {
  const content = readSrc(`commands/${f}`);
  if (!content.includes('description:')) {
    issue(`MISSING description frontmatter in commands/${f}`);
    missingDesc++;
  }
}
if (missingDesc === 0) pass('All commands have description frontmatter');

// 2d. All commands have allowed-tools in frontmatter
let missingTools = 0;
for (const f of files('commands')) {
  const content = readSrc(`commands/${f}`);
  if (!content.includes('allowed-tools:')) {
    issue(`MISSING allowed-tools frontmatter in commands/${f}`);
    missingTools++;
  }
}
if (missingTools === 0) pass('All commands have allowed-tools frontmatter');

// 2e. All workflows have structure (## Steps, ### N., or ## Subcommand:)
let missingSteps = 0;
for (const f of files('workflows')) {
  const content = readSrc(`workflows/${f}`);
  const hasStructure = content.includes('### ') ||
                       content.includes('## Steps') ||
                       content.includes('## Subcommand:');
  if (!hasStructure) {
    issue(`WORKFLOW has no steps: workflows/${f}`);
    missingSteps++;
  }
}
if (missingSteps === 0) pass('All workflows have structured steps');

// 2f. All templates are non-empty
let emptyTemplates = 0;
for (const f of files('templates')) {
  const content = readSrc(`templates/${f}`);
  if (content.trim().length < 50) {
    issue(`TEMPLATE too short: templates/${f}`);
    emptyTemplates++;
  }
}
if (emptyTemplates === 0) pass('All templates have content');

const completenessScore = Math.round(35 * (
  (missingCommands === 0 ? 1 : 0) * 0.25 +
  (missingWorkflows === 0 ? 1 : 0) * 0.25 +
  (missingDesc === 0 ? 1 : 0) * 0.15 +
  (missingTools === 0 ? 1 : 0) * 0.15 +
  (missingSteps === 0 ? 1 : 0) * 0.1 +
  (emptyTemplates === 0 ? 1 : 0) * 0.1
));

// ── 3. Consistency (25 pts) ─────────────────────────────────────────────────

// 3a. STATE.md template contains loop position markers
const stateContent = srcExists('templates/STATE.md') ? readSrc('templates/STATE.md') : '';
const hasLoopDisplay = stateContent.includes('PLAN') && stateContent.includes('GATE') && stateContent.includes('APPLY') && stateContent.includes('UNIFY');
if (!hasLoopDisplay) issue('STATE.md template missing loop position display');
else pass('STATE.md template has loop position display');

// 3b. PLAN.md template has <constraints> as first section
const planContent = srcExists('templates/PLAN.md') ? readSrc('templates/PLAN.md') : '';
const constraintsFirst = planContent.indexOf('<constraints>') < planContent.indexOf('<objective>');
if (!constraintsFirst) issue('PLAN.md template: <constraints> must come before <objective>');
else pass('<constraints> is first section in PLAN.md template');

// 3c. gate-workflow references all 5 questions
const gateContent = srcExists('workflows/gate-workflow.md') ? readSrc('workflows/gate-workflow.md') : '';
const gateQuestions = ['Connectivity', 'Performance', 'Concurrency', 'Security', 'Rollback'];
let missingGateQ = 0;
for (const q of gateQuestions) {
  if (!gateContent.includes(q)) { issue(`gate-workflow.md missing question: ${q}`); missingGateQ++; }
}
if (missingGateQ === 0) pass('gate-workflow.md covers all 5 Gate questions');

// 3d. apply-phase mentions override bypass
const applyContent = srcExists('workflows/apply-phase.md') ? readSrc('workflows/apply-phase.md') : '';
if (!applyContent.includes('override')) issue('apply-phase.md does not handle override bypass');
else pass('apply-phase.md handles override bypass');

// 3e. apply-phase mentions checkpoint
if (!applyContent.includes('checkpoint')) issue('apply-phase.md does not handle checkpoints');
else pass('apply-phase.md handles checkpoints');

// 3f. unify-phase mentions SUMMARY.md
const unifyContent = srcExists('workflows/unify-phase.md') ? readSrc('workflows/unify-phase.md') : '';
if (!unifyContent.includes('SUMMARY')) issue('unify-phase.md does not mention SUMMARY.md output');
else pass('unify-phase.md references SUMMARY.md');

const consistencyScore = Math.round(25 * (
  (hasLoopDisplay ? 1 : 0) * 0.15 +
  (constraintsFirst ? 1 : 0) * 0.2 +
  (missingGateQ === 0 ? 1 : 0) * 0.2 +
  (applyContent.includes('override') ? 1 : 0) * 0.15 +
  (applyContent.includes('checkpoint') ? 1 : 0) * 0.15 +
  (unifyContent.includes('SUMMARY') ? 1 : 0) * 0.15
));

// ── 4. Content Depth (bonus, added to consistency) ─────────────────────────

// 4a. gate-workflow mentions verbatim injection warning
const gateVerbatim = gateContent.includes('DO NOT summarize') || gateContent.includes('verbatim');
if (!gateVerbatim) issue('gate-workflow.md missing verbatim injection enforcement');
else pass('gate-workflow.md enforces verbatim constraint injection');

// 4b. gate-workflow updates PLAN.md frontmatter (gate_cleared: true)
if (!gateContent.includes('gate_cleared: true')) issue('gate-workflow.md does not set gate_cleared: true in frontmatter');
else pass('gate-workflow.md sets gate_cleared: true');

// 4c. apply-phase loads <constraints> before executing
if (!applyContent.includes('<constraints>')) issue('apply-phase.md does not reference <constraints> section');
else pass('apply-phase.md loads <constraints> before execution');

// 4d. All 5 core loop workflows update STATE.md
const coreWorkflows = ['init-project','plan-phase','gate-workflow','apply-phase','unify-phase'];
let missingStateUpdate = 0;
for (const wf of coreWorkflows) {
  const fname = `workflows/${wf}.md`;
  if (!srcExists(fname)) continue;
  const c = readSrc(fname);
  if (!c.includes('STATE.md')) {
    issue(`${fname} does not mention STATE.md update`);
    missingStateUpdate++;
  }
}
if (missingStateUpdate === 0) pass('All core loop workflows reference STATE.md update');

// 4e. All core loop workflows have a "Next:" output
let missingNext = 0;
for (const wf of coreWorkflows) {
  const fname = `workflows/${wf}.md`;
  if (!srcExists(fname)) continue;
  const c = readSrc(fname);
  if (!c.includes('Next:')) {
    issue(`${fname} missing "Next:" confirmation output`);
    missingNext++;
  }
}
if (missingNext === 0) pass('All core loop workflows show a Next: command');

// 4f. resume-project cross-checks disk vs STATE
const resumeContent = srcExists('workflows/resume-project.md') ? readSrc('workflows/resume-project.md') : '';
if (!resumeContent.includes('disk') && !resumeContent.includes('Trust the disk')) {
  issue('resume-project.md missing disk-vs-STATE cross-check');
} else pass('resume-project.md cross-checks disk vs STATE.md');

// 4g. plan-phase checks config thresholds
const planContent2 = srcExists('workflows/plan-phase.md') ? readSrc('workflows/plan-phase.md') : '';
if (!planContent2.includes('config') || !planContent2.includes('threshold')) {
  issue('plan-phase.md does not read Gate thresholds from config');
} else pass('plan-phase.md reads Gate thresholds from config');

// 4h. init-project creates all required files
const initContent = srcExists('workflows/init-project.md') ? readSrc('workflows/init-project.md') : '';
const requiredInits = ['PROJECT.md', 'ROADMAP.md', 'STATE.md', 'config.md'];
let missingInit = 0;
for (const f of requiredInits) {
  if (!initContent.includes(f)) {
    issue(`init-project.md does not mention creating ${f}`);
    missingInit++;
  }
}
if (missingInit === 0) pass(`init-project.md creates all required files (${requiredInits.join(', ')})`);

// 4i. apply-phase checks for GATE.md existence
if (!applyContent.includes('GATE.md')) {
  issue('apply-phase.md does not verify GATE.md existence');
} else pass('apply-phase.md verifies GATE.md exists');

// 4j. unify-phase reconciles acceptance criteria
if (!unifyContent.includes('acceptance_criteria') && !unifyContent.includes('acceptance criteria')) {
  issue('unify-phase.md does not reconcile acceptance criteria');
} else pass('unify-phase.md reconciles acceptance criteria');

// Adjust scores for depth bonus
const depthIssues = [
  !gateVerbatim,
  !gateContent.includes('gate_cleared: true'),
  !applyContent.includes('<constraints>'),
  missingStateUpdate > 0,
  missingNext > 0,
  !resumeContent.includes('disk') && !resumeContent.includes('Trust the disk'),
  (!planContent2.includes('config') || !planContent2.includes('threshold')),
  missingInit > 0,
  !applyContent.includes('GATE.md'),
  (!unifyContent.includes('acceptance_criteria') && !unifyContent.includes('acceptance criteria')),
].filter(Boolean).length;

const depthScore = Math.round(10 * (1 - depthIssues / 10));

// ── 5. Tool Accuracy (10 pts) ────────────────────────────────────────────────
// Commands whose workflows update an existing STATE.md need Edit in allowed-tools.
// Commands whose workflows create new files need Write in allowed-tools.

function cmdTools(name) {
  if (!srcExists(`commands/${name}.md`)) return '';
  return readSrc(`commands/${name}.md`);
}

// verify: workflow updates STATE.md (existing file) → needs Edit
const verifyNeedsEdit = cmdTools('verify').includes('Edit');
if (!verifyNeedsEdit) issue('commands/verify.md missing Edit (verify-work.md updates STATE.md)');
else pass('commands/verify.md has Edit for STATE.md update');

// audit: workflow writes AUDIT.md (new) and updates STATE.md (existing) → needs Edit
const auditNeedsEdit = cmdTools('audit').includes('Edit');
if (!auditNeedsEdit) issue('commands/audit.md missing Edit (audit.md updates STATE.md)');
else pass('commands/audit.md has Edit for STATE.md update');

// pause: workflow updates STATE.md (existing) → needs Edit
const pauseNeedsEdit = cmdTools('pause').includes('Edit');
if (!pauseNeedsEdit) issue('commands/pause.md missing Edit (pause-work.md updates STATE.md)');
else pass('commands/pause.md has Edit for STATE.md update');

// research: workflow updates STATE.md (existing) → needs Edit
const researchNeedsEdit = cmdTools('research').includes('Edit');
if (!researchNeedsEdit) issue('commands/research.md missing Edit (research.md updates STATE.md)');
else pass('commands/research.md has Edit for STATE.md update');

// milestone: workflow creates phase dirs (Bash), checks SUMMARY.md files (Glob), updates ROADMAP.md/STATE.md (Edit)
const milestoneContent = cmdTools('milestone');
const milestoneNeedsEdit = milestoneContent.includes('Edit');
const milestoneNeedsBash = milestoneContent.includes('Bash');
const milestoneNeedsGlob = milestoneContent.includes('Glob');
if (!milestoneNeedsEdit) issue('commands/milestone.md missing Edit (milestone.md updates ROADMAP.md and STATE.md)');
else pass('commands/milestone.md has Edit for ROADMAP.md/STATE.md update');
if (!milestoneNeedsBash) issue('commands/milestone.md missing Bash (milestone create makes phase directories)');
else pass('commands/milestone.md has Bash for directory creation');
if (!milestoneNeedsGlob) issue('commands/milestone.md missing Glob (milestone complete checks SUMMARY.md files)');
else pass('commands/milestone.md has Glob for SUMMARY.md discovery');

// roadmap: workflow creates phase dirs (Bash), modifies ROADMAP.md/STATE.md (Edit)
const roadmapContent = cmdTools('roadmap');
const roadmapNeedsEdit = roadmapContent.includes('Edit');
const roadmapNeedsBash = roadmapContent.includes('Bash');
if (!roadmapNeedsEdit) issue('commands/roadmap.md missing Edit (roadmap.md updates ROADMAP.md and STATE.md)');
else pass('commands/roadmap.md has Edit for ROADMAP.md/STATE.md update');
if (!roadmapNeedsBash) issue('commands/roadmap.md missing Bash (roadmap add creates phase directories)');
else pass('commands/roadmap.md has Bash for directory creation');

// discuss: workflow writes DISCUSS-*.md (new) and updates STATE.md (existing) → needs Edit
const discussNeedsEdit = cmdTools('discuss').includes('Edit');
if (!discussNeedsEdit) issue('commands/discuss.md missing Edit (discuss-phase.md updates STATE.md)');
else pass('commands/discuss.md has Edit for STATE.md update');

// init: workflow modifies existing .gitignore → needs Edit
const initNeedsEdit = cmdTools('init').includes('Edit');
if (!initNeedsEdit) issue('commands/init.md missing Edit (init-project.md modifies .gitignore)');
else pass('commands/init.md has Edit for .gitignore modification');

const toolAccuracyIssues = [
  !verifyNeedsEdit,
  !auditNeedsEdit,
  !pauseNeedsEdit,
  !researchNeedsEdit,
  !milestoneNeedsEdit,
  !milestoneNeedsBash,
  !milestoneNeedsGlob,
  !roadmapNeedsEdit,
  !roadmapNeedsBash,
  !discussNeedsEdit,
  !initNeedsEdit,
].filter(Boolean).length;

const toolAccuracyScore = Math.round(10 * (1 - toolAccuracyIssues / 11));

// ── 6. Robustness (10 pts) ───────────────────────────────────────────────────

// 6a. resume-project.md does not ask "Ready to continue?" (anti-autonomous pattern)
const resumeHasAskPattern = resumeContent.includes('Ready to continue?') ||
  (resumeContent.includes('Ask to proceed') && !resumeContent.includes('Do not ask'));
if (resumeHasAskPattern) issue('resume-project.md has anti-autonomous "Ask to proceed" pattern — should auto-proceed when signals are set');
else pass('resume-project.md auto-proceeds without asking');

// 6b. bin/install.js covers @src/references/ path rewriting
const installerPath = path.join(__dirname, '..', 'bin', 'install.js');
const installerContent = fs.existsSync(installerPath) ? fs.readFileSync(installerPath, 'utf8') : '';
// The installer uses regex literals with escaped slashes (/@src\/references\//g),
// so the raw file text contains '@src\/references' with a backslash.
const installerCoversReferences = installerContent.includes('@src\\/references') || installerContent.includes('@src/references');
if (!installerCoversReferences) issue('bin/install.js missing @src/references/ path rewriting — installed commands will have broken reference paths');
else pass('bin/install.js rewrites @src/references/ paths at install time');

// 6c. All reference files are referenced by at least one workflow or command
const refFiles = files('references').map(f => `references/${f}`);
const allWorkflowAndCommandContent = [
  ...files('workflows').map(f => readSrc(`workflows/${f}`)),
  ...files('commands').map(f => readSrc(`commands/${f}`)),
].join('\n');
let orphanRefs = 0;
for (const rf of refFiles) {
  const refName = path.basename(rf);
  if (!allWorkflowAndCommandContent.includes(refName)) {
    issue(`Reference file is unreferenced: src/${rf} — wire into a workflow or delete`);
    orphanRefs++;
  }
}
if (orphanRefs === 0) pass(`All ${refFiles.length} reference files are referenced by a workflow or command`);

const robustnessIssues = [
  resumeHasAskPattern,
  !installerCoversReferences,
  orphanRefs > 0,
].filter(Boolean).length;

const robustnessScore = Math.round(10 * (1 - robustnessIssues / 3));

// ── 7. Enterprise Scaffolding (20 pts) ──────────────────────────────────────
// Verifies that stewardship, risk classification, and attribution stubs
// are present in the right places — ready for Goal 1-3 implementation.

const planTmpl  = srcExists('templates/PLAN.md')  ? readSrc('templates/PLAN.md')  : '';
const gateTmpl  = srcExists('templates/GATE.md')  ? readSrc('templates/GATE.md')  : '';
const configTmpl = srcExists('templates/config.md') ? readSrc('templates/config.md') : '';
const gateWf    = srcExists('workflows/gate-workflow.md') ? readSrc('workflows/gate-workflow.md') : '';
const planWf    = srcExists('workflows/plan-phase.md')    ? readSrc('workflows/plan-phase.md')    : '';
const initWf    = srcExists('workflows/init-project.md')  ? readSrc('workflows/init-project.md')  : '';

// 7a. PLAN.md template has risk_tier field
const planHasRiskTier = planTmpl.includes('risk_tier');
if (!planHasRiskTier) issue('PLAN.md template missing risk_tier frontmatter field');
else pass('PLAN.md template has risk_tier field');

// 7b. PLAN.md template has domain field
const planHasDomain = planTmpl.includes('domain:');
if (!planHasDomain) issue('PLAN.md template missing domain: frontmatter field');
else pass('PLAN.md template has domain: field');

// 7c. PLAN.md template has steward_files field
const planHasStewardFiles = planTmpl.includes('steward_files');
if (!planHasStewardFiles) issue('PLAN.md template missing steward_files frontmatter field');
else pass('PLAN.md template has steward_files: field');

// 7d. GATE.md template has Attribution section
const gateHasAttribution = gateTmpl.includes('## Attribution');
if (!gateHasAttribution) issue('GATE.md template missing ## Attribution section');
else pass('GATE.md template has Attribution section');

// 7e. GATE.md template has Risk Classification section
const gateHasRiskClass = gateTmpl.includes('## Risk Classification');
if (!gateHasRiskClass) issue('GATE.md template missing ## Risk Classification section');
else pass('GATE.md template has Risk Classification section');

// 7f. GATE.md template has Domain Context / stewardship slot
const gateHasDomainContext = gateTmpl.includes('Domain Context') || gateTmpl.includes('stewardship');
if (!gateHasDomainContext) issue('GATE.md template missing Domain Context / stewardship slot');
else pass('GATE.md template has Domain Context (stewardship slot)');

// 7g. config.md template has stewards: block
const configHasStewards = configTmpl.includes('stewards:');
if (!configHasStewards) issue('config.md template missing stewards: block');
else pass('config.md template has stewards: block');

// 7h. gate-workflow.md has stewardship import step
const gateWfHasStewardImport = gateWf.includes('Stewardship import') || gateWf.includes('stewards.enabled');
if (!gateWfHasStewardImport) issue('gate-workflow.md missing stewardship import step');
else pass('gate-workflow.md has stewardship import step');

// 7i. gate-workflow.md writes risk_tier to PLAN.md frontmatter
const gateWfWritesRiskTier = gateWf.includes('risk_tier');
if (!gateWfWritesRiskTier) issue('gate-workflow.md does not write risk_tier to PLAN.md frontmatter');
else pass('gate-workflow.md writes risk_tier to PLAN.md');

// 7j. plan-phase.md has domain detection logic
const planWfHasDomainDetect = planWf.includes('domain') && planWf.includes('Domain detection');
if (!planWfHasDomainDetect) issue('plan-phase.md missing domain detection logic');
else pass('plan-phase.md has domain detection logic');

// 7k. init-project.md creates .slopbuster/stewards/ directory
const initCreatesStewards = initWf.includes('stewards');
if (!initCreatesStewards) issue('init-project.md does not create .slopbuster/stewards/ directory');
else pass('init-project.md creates .slopbuster/stewards/ directory');

const enterpriseChecks = [
  planHasRiskTier, planHasDomain, planHasStewardFiles,
  gateHasAttribution, gateHasRiskClass, gateHasDomainContext,
  configHasStewards, gateWfHasStewardImport, gateWfWritesRiskTier,
  planWfHasDomainDetect, initCreatesStewards,
];
const enterprisePassing = enterpriseChecks.filter(Boolean).length;
const enterpriseScore = Math.round(20 * (enterprisePassing / enterpriseChecks.length));

// ── Report ──────────────────────────────────────────────────────────────────

const total = refScore + completenessScore + consistencyScore + depthScore + toolAccuracyScore + robustnessScore + enterpriseScore;

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`SlopBuster Audit — Score: ${total}/150`);
console.log(`  Reference integrity:  ${refScore}/40`);
console.log(`  Completeness:         ${completenessScore}/35`);
console.log(`  Consistency:          ${consistencyScore}/25`);
console.log(`  Content depth:        ${depthScore}/10`);
console.log(`  Tool accuracy:        ${toolAccuracyScore}/10`);
console.log(`  Robustness:           ${robustnessScore}/10`);
console.log(`  Enterprise scaffold:  ${enterpriseScore}/20`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

if (issues.length) {
  console.log(`\nIssues (${issues.length}):`);
  issues.forEach(i => console.log(`  ✗ ${i}`));
}

if (passes.length) {
  console.log(`\nPasses (${passes.length}):`);
  passes.forEach(p => console.log(`  ✓ ${p}`));
}

console.log('');
process.exit(issues.length > 0 ? 1 : 0);
