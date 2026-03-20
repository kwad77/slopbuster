#!/usr/bin/env bash
# SlopBuster installer — works with or without Node.js
# Usage: curl -fsSL https://raw.githubusercontent.com/kwad77/slopbuster/master/bin/install.sh | sh
# Or:    curl -fsSL https://raw.githubusercontent.com/kwad77/slopbuster/master/bin/install.sh | sh -s -- --cursor

set -e

REPO="kwad77/slopbuster"
BRANCH="master"
TARBALL="https://github.com/$REPO/archive/refs/heads/$BRANCH.tar.gz"
VERSION="latest"

# ── Terminal colors ────────────────────────────────────────────────────────────

if [ -t 1 ] && command -v tput >/dev/null 2>&1; then
  BOLD="$(tput bold)"
  GREEN="$(tput setaf 2)"
  YELLOW="$(tput setaf 3)"
  RED="$(tput setaf 1)"
  DIM="$(tput dim)"
  RESET="$(tput sgr0)"
else
  BOLD="" GREEN="" YELLOW="" RED="" DIM="" RESET=""
fi

ok()     { printf "%s✓%s  %s\n" "$GREEN" "$RESET" "$1"; }
warn()   { printf "%s⚠%s  %s\n" "$YELLOW" "$RESET" "$1"; }
fail()   { printf "%s✗%s  %s\n" "$RED" "$RESET" "$1" >&2; }
info()   { printf "%s   %s\n" "$DIM" "$RESET$1"; }
header() { printf "\n%s%s%s\n" "$BOLD" "$1" "$RESET"; }
hr()     { printf "\n─────────────────────────────────────────\n\n"; }

# ── Cleanup on exit ────────────────────────────────────────────────────────────

TMP_DIR=""
cleanup() {
  if [ -n "$TMP_DIR" ] && [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT INT TERM

# ── Header ────────────────────────────────────────────────────────────────────

printf "\n%sSlopBuster%s — Constraint-first AI development\n\n" "$BOLD" "$RESET"

# ── Check requirements ────────────────────────────────────────────────────────

# curl or wget required
if command -v curl >/dev/null 2>&1; then
  FETCH="curl -fsSL"
elif command -v wget >/dev/null 2>&1; then
  FETCH="wget -qO-"
else
  fail "curl or wget is required. Install one and try again."
  exit 1
fi

# tar required
if ! command -v tar >/dev/null 2>&1; then
  fail "tar is required. Install it and try again."
  exit 1
fi

# ── Download ──────────────────────────────────────────────────────────────────

info "Downloading SlopBuster $VERSION..."
TMP_DIR=$(mktemp -d)
EXTRACT_DIR="$TMP_DIR/slopbuster-$BRANCH"

if ! $FETCH "$TARBALL" | tar xz -C "$TMP_DIR" 2>/dev/null; then
  fail "Download failed. Check your internet connection and try again."
  info "URL: $TARBALL"
  exit 1
fi

ok "Downloaded"

# ── If Node.js available — delegate to the full Node installer ─────────────────

if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node --version 2>/dev/null || echo "unknown")
  info "Node.js $NODE_VER detected — using full installer"
  # Pass through any arguments (--claude, --cursor, --vscode, --all, etc.)
  node "$EXTRACT_DIR/bin/install.js" "$@"
  exit 0
fi

# ── Bash-only install (Claude Code only) ──────────────────────────────────────

warn "Node.js not found — installing for Claude Code only (bash mode)"
info "For VS Code / Cursor support, install Node.js and re-run"
printf "\n"

CLAUDE_DIR="$HOME/.claude"
COMMANDS_DIR="$CLAUDE_DIR/commands/sb"
FRAMEWORK_DIR="$CLAUDE_DIR/slopbuster-framework"
SRC_DIR="$EXTRACT_DIR/src"

# Verify src/ exists
if [ ! -d "$SRC_DIR" ]; then
  fail "Downloaded archive is missing src/. This is a bug — please report it."
  info "https://github.com/$REPO/issues"
  exit 1
fi

# Create target directories
mkdir -p "$COMMANDS_DIR"
mkdir -p "$FRAMEWORK_DIR/workflows"
mkdir -p "$FRAMEWORK_DIR/templates"
mkdir -p "$FRAMEWORK_DIR/references"

# Copy a file with @src/ path replacement
copy_with_rewrite() {
  local src="$1"
  local dst="$2"
  sed \
    -e "s|@src/workflows/|@${FRAMEWORK_DIR}/workflows/|g" \
    -e "s|@src/templates/|@${FRAMEWORK_DIR}/templates/|g" \
    -e "s|@src/references/|@${FRAMEWORK_DIR}/references/|g" \
    "$src" > "$dst"
}

# Install commands
CMD_COUNT=0
for f in "$SRC_DIR/commands"/*.md; do
  [ -f "$f" ] || continue
  copy_with_rewrite "$f" "$COMMANDS_DIR/$(basename "$f")"
  CMD_COUNT=$((CMD_COUNT + 1))
done
ok "Commands ($CMD_COUNT) → $COMMANDS_DIR"

# Install framework files
for subdir in workflows templates references; do
  COUNT=0
  for f in "$SRC_DIR/$subdir"/*.md; do
    [ -f "$f" ] || continue
    copy_with_rewrite "$f" "$FRAMEWORK_DIR/$subdir/$(basename "$f")"
    COUNT=$((COUNT + 1))
  done
  ok "$subdir ($COUNT) → $FRAMEWORK_DIR/$subdir"
done

# ── Scaffold .slopbuster/ in current directory ────────────────────────────────

CWD="$(pwd)"
SB_DIR="$CWD/.slopbuster"

if [ -d "$SB_DIR" ]; then
  warn ".slopbuster/ already exists — keeping your project (run /sb:init to reinitialize)"
else
  mkdir -p "$SB_DIR/phases" "$SB_DIR/stewards" "$SB_DIR/records"

  TODAY=$(date +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)
  PROJECT_NAME=$(basename "$CWD")

  # Detect project name from package.json if available
  if [ -f "$CWD/package.json" ] && command -v grep >/dev/null 2>&1; then
    PKG_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' "$CWD/package.json" 2>/dev/null | head -1 | sed 's/.*:.*"\(.*\)"/\1/' || true)
    [ -n "$PKG_NAME" ] && PROJECT_NAME="$PKG_NAME"
  fi

  # Write PROJECT.md
  cat > "$SB_DIR/PROJECT.md" << PROJECTEOF
# $PROJECT_NAME

**Core value:** (edit this — what must this project do above all else?)

**Description:** (one sentence — what is this project and who does it serve?)

**Initialized:** $TODAY

---

## Context

(Why this project exists, who it is for, and what problem it solves.)

## Stack

(fill in: languages, frameworks, databases, services)

## Constraints

(Known constraints — technology choices, compliance requirements, architectural decisions not up for debate.)

## Out of Scope

(What this project explicitly does not do.)
PROJECTEOF

  # Copy STATE.md, ROADMAP.md, config.md from templates
  copy_with_rewrite "$SRC_DIR/templates/STATE.md" "$SB_DIR/STATE.md"
  copy_with_rewrite "$SRC_DIR/templates/ROADMAP.md" "$SB_DIR/ROADMAP.md"
  copy_with_rewrite "$SRC_DIR/templates/config.md" "$SB_DIR/config.md"

  # Write stewards README
  cat > "$SB_DIR/stewards/README.md" << STEWARDEOF
# Domain Stewardship

Domain teams drop files here. Each file injects Gate questions when a plan touches that domain.

Enable with: stewards.enabled: true in .slopbuster/config.md

See the SlopBuster docs for the steward file format.
STEWARDEOF

  ok ".slopbuster/ scaffolded — PROJECT.md · STATE.md · ROADMAP.md · config.md"
fi

# ── Done ──────────────────────────────────────────────────────────────────────

hr
printf "Next steps:\n\n"
printf "  1. Edit ${BOLD}.slopbuster/PROJECT.md${RESET} — set your project name and core value\n"
printf "  2. Open Claude Code and run ${BOLD}/sb:plan${RESET}\n"
printf "  3. Run ${BOLD}/sb:help${RESET} for the full command reference\n"
printf "\n"
printf "  Want VS Code or Cursor support?\n"
printf "  Install Node.js and re-run: ${DIM}curl -fsSL https://raw.githubusercontent.com/$REPO/$BRANCH/bin/install.sh | sh${RESET}\n"
printf "\n"
