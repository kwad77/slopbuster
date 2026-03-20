#!/usr/bin/env node

/**
 * SlopBuster MCP Server
 *
 * Provides Gate enforcement via MCP elicitation for VS Code and Cursor.
 * Both editors (VS Code 1.103+, Cursor 1.5+) render elicitation/create
 * as native form dialogs — developer answers are collected in a structured
 * form, not free-form chat, then written verbatim into <constraints>.
 *
 * Tools:
 *   slopbuster_gate    — run the Gate circuit breaker with elicitation
 *   slopbuster_status  — read current loop state from STATE.md
 */

'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ─── Protocol helpers ───────────────────────────────────────────────────────

let _nextId = 0;
const _pending = new Map(); // id -> {resolve, reject}

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

/** Send a server-initiated request (e.g. elicitation/create) and await response. */
function sendRequest(method, params) {
  return new Promise((resolve, reject) => {
    const id = `sb-${++_nextId}`;
    _pending.set(id, { resolve, reject });
    send({ jsonrpc: '2.0', id, method, params });
  });
}

// ─── Tool definitions ────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'slopbuster_gate',
    description:
      'Run the SlopBuster Gate circuit breaker. ' +
      'Reads the target PLAN.md, checks thresholds, opens a native form for the ' +
      '5 architectural questions, and writes developer answers verbatim into ' +
      '<constraints>. APPLY is unblocked once this tool returns successfully.',
    inputSchema: {
      type: 'object',
      properties: {
        plan_path: {
          type: 'string',
          description:
            'Path to the PLAN.md file, relative to the workspace root. ' +
            'If omitted, the server reads gate_pending from .slopbuster/STATE.md.',
        },
      },
    },
  },
  {
    name: 'slopbuster_status',
    description:
      'Return the current SlopBuster loop position and next recommended action ' +
      'by reading .slopbuster/STATE.md.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ─── Threshold detection ─────────────────────────────────────────────────────

const THRESHOLD_CHECKS = [
  {
    id: 'file-count',
    test(plan) {
      const filePaths = new Set();
      for (const m of plan.matchAll(/<files>([\s\S]*?)<\/files>/g)) {
        for (const line of m[1].split('\n')) {
          const t = line.trim().replace(/^[-*]\s*/, '');
          if (t) filePaths.add(t);
        }
      }
      return filePaths.size > 5;
    },
  },
  {
    id: 'new-dependencies',
    test: (p) =>
      /\b(npm install|yarn add|pip install|cargo add|go get|require\s*\(|new external|new package|new service)\b/i.test(p),
  },
  {
    id: 'database-schema',
    test: (p) =>
      /\b(migration|ALTER TABLE|CREATE TABLE|DROP TABLE|schema change|ORM model|model class)\b/i.test(p),
  },
  {
    id: 'api-contract',
    test: (p) =>
      /\b(endpoint change|API version|route change|shared utility|contract change|breaking change)\b/i.test(p),
  },
  {
    id: 'auth-session',
    test: (p) =>
      /\b(auth|login|logout|JWT|bearer token|session|permissions|roles|access control|RBAC)\b/i.test(p),
  },
];

function checkThresholds(planContent) {
  return THRESHOLD_CHECKS.filter((c) => c.test(planContent)).map((c) => c.id);
}

// ─── STATE.md helpers ─────────────────────────────────────────────────────────

function readState(cwd) {
  const p = path.join(cwd, '.slopbuster', 'STATE.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function updateStateGateCleared(cwd, planPath, ts) {
  const p = path.join(cwd, '.slopbuster', 'STATE.md');
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/^# gate_pending:.*\n?/m, '');
  s = s.replace(/GATE\s+[○⚠◉⊘]/g, 'GATE ✓');
  s = s.replace(/\bLast:.*$/m, `Last: ${ts} — Gate cleared`);
  fs.writeFileSync(p, s, 'utf8');
}

// ─── Tool: slopbuster_gate ───────────────────────────────────────────────────

async function handleGate(args) {
  const cwd = process.cwd();

  // 1. Resolve plan path
  let planPath = args && args.plan_path;
  if (!planPath) {
    const state = readState(cwd);
    if (!state) {
      return err('No STATE.md found. Run /sb-init first to initialize SlopBuster.');
    }
    const m = state.match(/^#\s*gate_pending:\s*(.+)$/m);
    if (!m) {
      return err(
        'No gate_pending entry in STATE.md. Either the plan was already cleared ' +
          'or no plan has been created yet. Provide a plan_path argument.',
      );
    }
    planPath = m[1].trim();
  }

  const absPath = path.resolve(cwd, planPath);
  if (!fs.existsSync(absPath)) {
    return err(`Plan not found: ${planPath}\nVerify the path and try again.`);
  }

  let plan = fs.readFileSync(absPath, 'utf8');

  // 2. Already cleared?
  if (/^gate_cleared:\s*true/m.test(plan)) {
    return ok(`Gate already cleared for this plan.\n\nNext: /sb-apply`);
  }

  // 3. Read thresholds from config if present
  const triggers = checkThresholds(plan);
  const ts = new Date().toISOString();

  // 4. Auto-clear if no thresholds fired
  if (triggers.length === 0) {
    plan = injectConstraints(
      plan,
      `<!-- Gate auto-cleared on ${ts}: no thresholds met -->`,
    );
    plan = setFrontmatter(plan, { gate_cleared: 'true', gate_date: ts });
    fs.writeFileSync(absPath, plan, 'utf8');
    updateStateGateCleared(cwd, planPath, ts);
    return ok(
      `[GATE ✓ auto] No thresholds met — cleared automatically.\n\n` +
        `PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ○ ──▶ UNIFY ○\n\nNext: /sb-apply`,
    );
  }

  // 5. Elicit the 5 Gate questions via native editor form
  let elicit;
  try {
    elicit = await sendRequest('elicitation/create', {
      message:
        `SlopBuster Gate — ${triggers.join(', ')} triggered.\n\n` +
        `Answer all 5 questions. Your exact words become the execution contract — ` +
        `they are never summarized or rephrased.`,
      requestedSchema: {
        type: 'object',
        properties: {
          connectivity: {
            type: 'string',
            description:
              'Q1 — Connectivity: What systems does this plan connect to or affect? ' +
              'List all downstream dependencies, webhooks, and clients. ' +
              'What is the blast radius if this rolls back?',
          },
          performance: {
            type: 'string',
            description:
              'Q2 — Performance: What are the latency targets? ' +
              'Where are the DB queries and do they use indexes? ' +
              'What is the memory profile under load?',
          },
          concurrency: {
            type: 'string',
            description:
              'Q3 — Concurrency: Are write operations idempotent? ' +
              'What are the race conditions? What is the locking and tie-break strategy?',
          },
          security: {
            type: 'string',
            description:
              'Q4 — Security: Which endpoints are protected vs. public? ' +
              'What inputs are validated? What must never be logged? ' +
              'How are secrets managed?',
          },
          rollback: {
            type: 'string',
            description:
              'Q5 — Rollback: If this plan fails mid-execution, how do you recover? ' +
              'Is the migration reversible? Can services restart safely? ' +
              'What is the manual recovery path?',
          },
        },
        required: ['connectivity', 'performance', 'concurrency', 'security', 'rollback'],
      },
    });
  } catch (e) {
    return err(
      `Elicitation failed: ${e.message || e}\n\n` +
        `Fallback: run /sb-gate in Claude Code, or answer the 5 Gate questions ` +
        `conversationally and paste them into the <constraints> section of ${planPath}.`,
    );
  }

  // User cancelled the form
  if (!elicit || elicit.action === 'cancel') {
    return ok('Gate cancelled. APPLY remains blocked until the Gate is cleared.');
  }

  const a = elicit.content;

  // 6. Inject answers verbatim
  const constraintBody =
    `## Q1 — Connectivity\n${a.connectivity}\n\n` +
    `## Q2 — Performance\n${a.performance}\n\n` +
    `## Q3 — Concurrency\n${a.concurrency}\n\n` +
    `## Q4 — Security\n${a.security}\n\n` +
    `## Q5 — Rollback\n${a.rollback}`;

  plan = injectConstraints(plan, constraintBody);
  plan = setFrontmatter(plan, {
    gate_cleared: 'true',
    gate_date: ts,
    gate_triggered_by: `"${triggers.join(', ')}"`,
  });
  fs.writeFileSync(absPath, plan, 'utf8');
  updateStateGateCleared(cwd, planPath, ts);

  return ok(
    `[GATE ✓] Circuit breaker cleared.\n\n` +
      `Triggers:   ${triggers.join(', ')}\n` +
      `Constraints: 5 answers injected verbatim\n\n` +
      `PLAN ✓ ──▶ GATE ✓ ──▶ APPLY ○ ──▶ UNIFY ○\n\nNext: /sb-apply`,
  );
}

// ─── Tool: slopbuster_status ─────────────────────────────────────────────────

function handleStatus() {
  const state = readState(process.cwd());
  if (!state) {
    return ok('SlopBuster not initialized in this project.\n\nRun /sb-init to get started.');
  }
  return ok(state);
}

// ─── PLAN.md mutation helpers ─────────────────────────────────────────────────

function injectConstraints(plan, body) {
  if (/<constraints>[\s\S]*?<\/constraints>/.test(plan)) {
    return plan.replace(
      /<constraints>[\s\S]*?<\/constraints>/,
      `<constraints>\n${body}\n</constraints>`,
    );
  }
  return plan;
}

function setFrontmatter(plan, fields) {
  let result = plan;
  for (const [key, value] of Object.entries(fields)) {
    if (new RegExp(`^${key}:`, 'm').test(result)) {
      result = result.replace(new RegExp(`^${key}:.*$`, 'm'), `${key}: ${value}`);
    } else {
      // Insert after opening ---
      result = result.replace(/^---\n/, `---\n${key}: ${value}\n`);
    }
  }
  return result;
}

// ─── Response helpers ─────────────────────────────────────────────────────────

function ok(text) {
  return { content: [{ type: 'text', text }] };
}

function err(text) {
  return { isError: true, content: [{ type: 'text', text }] };
}

// ─── Tool dispatcher ──────────────────────────────────────────────────────────

async function callTool(name, args) {
  if (name === 'slopbuster_gate') return handleGate(args);
  if (name === 'slopbuster_status') return handleStatus();
  return err(`Unknown tool: ${name}`);
}

// ─── Main message loop ────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }

  // Response to a pending server-initiated request (e.g. elicitation response)
  if (msg.id !== undefined && _pending.has(String(msg.id))) {
    const { resolve, reject } = _pending.get(String(msg.id));
    _pending.delete(String(msg.id));
    if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
    else resolve(msg.result);
    return;
  }

  // Notifications (no id) — acknowledge silently
  if (msg.id === undefined) return;

  // Client requests
  if (msg.method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {}, elicitation: {} },
        serverInfo: { name: 'slopbuster', version: '0.2.0' },
      },
    });
  } else if (msg.method === 'tools/list') {
    send({ jsonrpc: '2.0', id: msg.id, result: { tools: TOOLS } });
  } else if (msg.method === 'tools/call') {
    const result = await callTool(
      msg.params && msg.params.name,
      msg.params && msg.params.arguments,
    );
    send({ jsonrpc: '2.0', id: msg.id, result });
  } else {
    send({
      jsonrpc: '2.0',
      id: msg.id,
      error: { code: -32601, message: 'Method not found' },
    });
  }
});

rl.on('close', () => process.exit(0));
