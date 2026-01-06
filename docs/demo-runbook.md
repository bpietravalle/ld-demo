# Demo Runbook

Step-by-step guide for demonstrating LaunchDarkly features.

**First-time setup:** See [README.md](../README.md) for installation and LaunchDarkly configuration.

---

## Before Each Demo

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

# Reset core flags to OFF
pnpm cli flags toggle enhanced-hero --off
pnpm cli flags toggle show-enterprise-tier --off
pnpm cli flags toggle hero-cta-text --off
pnpm cli flags toggle landing-chatbot --off

# Reset additional flags (if created)
pnpm cli flags toggle discount-percentage --off
pnpm cli flags toggle theme-config --off
pnpm cli flags toggle mobile-optimized-checkout --off

# Verify all OFF
pnpm cli flags list
```

Expected output:

```
Environment: test

○ enhanced-hero               boolean    OFF
○ show-enterprise-tier        boolean    OFF
○ hero-cta-text               string     OFF
○ landing-chatbot             boolean    OFF
○ discount-percentage         number     OFF    (if created)
○ theme-config                json       OFF    (if created)
○ mobile-optimized-checkout   boolean    OFF    (if created)
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

**Goal:** Show context-based feature targeting with user, device, and organization attributes.

### Demo Steps

1. **Show DevPanel**

   - Click gear icon (bottom-left) to open DevPanel
   - Explain the three context sections:
     - **User**: 6 mock users (Anonymous, Free, Pro, Power User, Enterprise, Beta Tester)
     - **Device**: 4 devices (Desktop, iPhone, Android, iPad)
     - **Organization**: 3 orgs (TechStartup, GrowthCorp, MegaCorp)
   - Point out **Flag Evaluations** section showing values + reasons

2. **Enable targeting flag**

   ```bash
   pnpm cli flags toggle show-enterprise-tier --on
   ```

3. **Demonstrate user targeting**

   - Click **"Anonymous"** or **"Free User"** → Pricing shows 2 tiers (Free, Pro)
   - Click **"Beta Tester"** → Enterprise tier appears!
   - Check DevPanel: `showEnterpriseTier` shows `TARGET` or `RULE` reason
   - Click **"Free User"** → Enterprise tier disappears

4. **Demonstrate prerequisite** (if configured)

   ```bash
   pnpm cli flags toggle enhanced-hero --off
   ```

   - Even with `show-enterprise-tier` ON, enterprise tier disappears
   - Check DevPanel: `showEnterpriseTier` shows `PREREQ` reason
   - Turn `enhanced-hero` back ON → enterprise tier returns

5. **Demonstrate multi-context targeting** (optional)

   - Switch to **"MegaCorp"** organization → if segment rule configured, enterprise tier shows
   - Switch to **"iPhone"** device → if `mobile-optimized-checkout` has device rule, banner appears

6. **See the rules** (LD Console)
   - Open `show-enterprise-tier` flag in LD dashboard
   - Show prerequisite: `enhanced-hero` must be ON
   - Show targeting rule: `user.betaTester is true` → serve `true`
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

   - Switch between users in DevPanel
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
   [timestamp] LaunchDarkly Webhook Event
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

## Part 6: Additional Flag Types (Optional)

**Goal:** Demonstrate number and JSON flag types.

### Number Flag: Discount Percentage

```bash
pnpm cli flags toggle discount-percentage --on
```

- Pricing table shows discount banner
- Change variation in LD console (0, 10, 15, 25) to show different discounts
- Prices update in real-time

### JSON Flag: Theme Config

```bash
pnpm cli flags toggle theme-config --on
```

- Hero section styling changes based on JSON variation
- Variations: light/blue, dark/purple, light/green
- Change variation in LD console to demonstrate dynamic theming

### Device Targeting: Mobile Checkout

```bash
pnpm cli flags toggle mobile-optimized-checkout --on
```

- In DevPanel, switch to iPhone or Android device
- Mobile checkout banner appears at bottom
- Switch to Desktop - banner disappears

---

## Quick Reference

| Part | Flag                        | Type    | What It Shows                    |
| ---- | --------------------------- | ------- | -------------------------------- |
| 1    | `enhanced-hero`             | Boolean | Instant toggle, SSE updates      |
| 2    | `show-enterprise-tier`      | Boolean | Context targeting, prerequisites |
| 3    | `hero-cta-text`             | String  | A/B testing, event tracking      |
| 4    | `landing-chatbot`           | Boolean | AI config, dynamic prompts       |
| 5    | —                           | —       | Webhooks, event-driven           |
| 6    | `discount-percentage`       | Number  | Dynamic pricing variations       |
| 6    | `theme-config`              | JSON    | Multi-value flags, theming       |
| 6    | `mobile-optimized-checkout` | Boolean | Device-based targeting           |

### Evaluation Reasons

The DevPanel shows WHY each flag evaluated to its value:

| Reason    | Meaning                                     |
| --------- | ------------------------------------------- |
| `DEFAULT` | Fell through to default rule                |
| `TARGET`  | Matched individual user targeting           |
| `RULE`    | Matched a targeting rule (shows rule index) |
| `PREREQ`  | Prerequisite flag not satisfied             |
| `OFF`     | Flag is turned off                          |

### CLI Commands

```bash
pnpm cli flags list|show|toggle <key> [--on|--off]
pnpm cli experiments list|show <key>
pnpm cli metrics list|show <key>
pnpm cli ai list|show <key>
```

---

## Reset

```bash
# Core demo flags
pnpm cli flags toggle enhanced-hero --off
pnpm cli flags toggle show-enterprise-tier --off
pnpm cli flags toggle hero-cta-text --off
pnpm cli flags toggle landing-chatbot --off

# Additional flags (if created)
pnpm cli flags toggle discount-percentage --off
pnpm cli flags toggle theme-config --off
pnpm cli flags toggle mobile-optimized-checkout --off
```
