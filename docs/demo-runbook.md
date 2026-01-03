# Demo Runbook

Step-by-step guide to demonstrate LaunchDarkly features. Follow in order.

---

## Prerequisites

```bash
# Terminal 1: Start the app
pnpm dev

# Terminal 2: CLI commands (keep open)
# Terminal 3: ngrok for webhooks (optional)
```

Open http://localhost:3000 in browser.

---

## 0. Reset: CLI Setup

Verify environment and reset all flags to OFF:

```bash
# Verify environment is configured
pnpm cli preflight

# List all flags with current state
pnpm cli flags list

# Reset all flags to OFF
pnpm cli flags toggle enhanced-hero --off
pnpm cli flags toggle show-enterprise-tier --off
pnpm cli flags toggle hero-cta-text --off
pnpm cli flags toggle landing-chatbot --off

# Verify all OFF
pnpm cli flags list
```

Expected output:

```
Environment: test

○ enhanced-hero          boolean    OFF
○ show-enterprise-tier   boolean    OFF
○ hero-cta-text          multivariate OFF
○ landing-chatbot        boolean    OFF
```

---

## Part 1: Release & Remediate

**Goal:** Demonstrate instant feature toggle without deploy or page reload.

### Demo Steps

1. **Show current state**

   - Browser: Standard hero visible (simple styling)
   - Point out: "This is what users currently see"

2. **Release the feature**

   ```bash
   pnpm cli flags toggle enhanced-hero --on
   ```

   - Browser: Hero changes **instantly** (gradient background, enhanced styling)
   - No page reload needed!

3. **Simulate rollback**
   - "A user reports an issue with the new hero..."
   ```bash
   pnpm cli flags toggle enhanced-hero --off
   ```
   - Browser: Reverts **instantly**

---

## Part 2: Targeting

**Goal:** Show context-based feature targeting with user attributes.

### Demo Steps

1. **Show Dev Panel**

   - Click ⚙ gear icon (bottom-left) to open Dev Panel
   - Shows current user context and active flags
   - Three user options: Anonymous, Regular User, Beta Tester

2. **Enable targeting flag**

   ```bash
   pnpm cli flags toggle show-enterprise-tier --on
   ```

3. **Demonstrate targeting**

   - Click **"Anonymous"** → Pricing shows 2 tiers (Free, Pro)
   - Click **"Beta Tester"** → Enterprise tier appears!
   - Click **"Regular User"** → Enterprise tier disappears

4. **See the rule** (LD Console)
   - Open `show-enterprise-tier` flag in LD dashboard
   - Show targeting rule: `betaTester is true` → serve `true`
   - Default serves `false`

---

## Part 3: Experimentation

**Goal:** Show A/B testing with event tracking.

### Demo Steps

1. **Enable experiment flag**

   ```bash
   pnpm cli flags toggle hero-cta-text --on
   ```

2. **Show variations**

   - Switch between users in Dev Panel (⚙ bottom-left)
   - CTA button text changes: "Get Started", "Try Free", or "Start Now"

3. **Demonstrate tracking**

   - Click the CTA button
   - Open browser DevTools → Network tab
   - Show event being sent to LaunchDarkly

4. **Show metrics** (LD Console)
   - Open Experiments in LD dashboard
   - Show `hero-cta-test` experiment
   - Point out: conversion tracking, statistical analysis

---

## Part 4: AI Configs

**Goal:** Demonstrate dynamic AI behavior without code deploy.

### Demo Steps

1. **Enable chatbot**

   ```bash
   pnpm cli flags toggle landing-chatbot --on
   ```

   - Chat bubble appears in bottom-right corner

2. **Test the chatbot**

   - Click chat bubble
   - Send: "What is this demo about?"
   - Receive AI response

3. **Show AI config** (LD Console)

   - Open `landing-chatbot-config` in LD dashboard
   - Show: model selection, system prompt

4. **Live prompt change** (optional)
   - In LD dashboard, modify the system prompt
   - Add: "Always mention LaunchDarkly in your responses."
   - Send new message → response reflects new behavior

---

## Part 5: Integrations (Webhooks)

**Goal:** Show event-driven architecture with flag change notifications.

### Setup (if not already running)

```bash
# Terminal 3: Start ngrok tunnel
pnpm ngrok
```

### Demo Steps

1. **Show webhook endpoint**

   - Point to Terminal 1 (API server logs)

2. **Toggle a flag**

   ```bash
   pnpm cli flags toggle enhanced-hero
   ```

3. **Show webhook event**

   - API console shows:

   ```
   ============================================================
   [timestamp] 🚩 LaunchDarkly Webhook Event
   ============================================================
   Action: updateOn
   Resource: proj/default:env/test:flag/enhanced-hero
   Changed by: your@email.com
   ============================================================
   ```

4. **Use cases**
   - Audit logging
   - Trigger downstream systems
   - Sync with external tools
   - Alert on critical flag changes

---

## Quick Reference

| Part | Flag                   | Type         | What It Shows               |
| ---- | ---------------------- | ------------ | --------------------------- |
| 1    | `enhanced-hero`        | Boolean      | Instant toggle, SSE updates |
| 2    | `show-enterprise-tier` | Boolean      | Context targeting, rules    |
| 3    | `hero-cta-text`        | Multivariate | A/B testing, event tracking |
| 4    | `landing-chatbot`      | Boolean      | AI config, dynamic prompts  |
| 5    | —                      | —            | Webhooks, event-driven      |

### CLI Commands

```bash
# Flags
pnpm cli flags list              # See all flags
pnpm cli flags show <flag>       # Show flag details
pnpm cli flags toggle <flag>     # Auto-toggle
pnpm cli flags toggle <flag> --on/--off

# Resources
pnpm cli experiments list        # See experiments
pnpm cli experiments show <key>  # Experiment details
pnpm cli metrics list            # See metrics
pnpm cli metrics show <key>      # Metric details
pnpm cli ai list                 # See AI configs
pnpm cli ai show <key>           # AI config details
```

---

## Reset

```bash
pnpm cli flags toggle enhanced-hero --off
pnpm cli flags toggle show-enterprise-tier --off
pnpm cli flags toggle hero-cta-text --off
pnpm cli flags toggle landing-chatbot --off
```
