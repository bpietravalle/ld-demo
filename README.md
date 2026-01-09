# LaunchDarkly Demo

Sample application demonstrating LaunchDarkly feature flags, targeting, experimentation, and AI configs.

## Prerequisites

**Required:**

- Node.js 20+
- pnpm 9+
- [LaunchDarkly account](https://launchdarkly.com/start-trial/)

**Optional:**

- [OpenAI API key](https://platform.openai.com/api-keys) - for AI chatbot demo
- [ngrok account](https://dashboard.ngrok.com) - for webhook demo

## Quick Start

### 1. Clone and Install

```bash
git clone git@github.com:bpietravalle/ld-demo.git
cd ld-demo
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# LaunchDarkly SDKs (from Settings → Environments)
VITE_LD_CLIENT_ID=your-client-side-id
LD_SDK_KEY=sdk-xxx-xxx

# LaunchDarkly REST API (from Account Settings → Authorization)
LD_API_TOKEN=api-xxx-xxx
LD_PROJECT_KEY=default
LD_ENVIRONMENT_KEY=test

# OpenAI (optional - for AI chatbot)
OPENAI_API_KEY=sk-xxx

# Webhooks (optional - get domain from https://dashboard.ngrok.com/domains)
NGROK_DOMAIN=https://your-domain.ngrok-free.app
```

### 3. Configure LaunchDarkly

Create the required resources in your LaunchDarkly project. See [LaunchDarkly Configuration](#launchdarkly-configuration) below.

### 4. Verify Setup

```bash
pnpm cli preflight
```

Expected output:

```
✔ Environment variables configured
  LD_SDK_KEY: ✓
  VITE_LD_CLIENT_ID: ✓
  LD_API_TOKEN: ✓
  ...
```

### 5. Ready!

Setup complete. See **[Demo Runbook](./docs/demo-runbook.md)** for step-by-step walkthrough.

---

## LaunchDarkly Configuration

Create these resources in your LaunchDarkly project before running the demo.

### Feature Flags

| Flag Key                    | Type    | Variations                                 |
| --------------------------- | ------- | ------------------------------------------ |
| `enhanced-hero`             | Boolean | true / false                               |
| `show-enterprise-tier`      | Boolean | true / false (prerequisite: enhanced-hero) |
| `hero-cta-text`             | String  | "Get Started", "Try Free", "Start Now"     |
| `landing-chatbot`           | Boolean | true / false                               |
| `discount-percentage`       | Number  | 0, 10, 15, 25                              |
| `theme-config`              | JSON    | See variations below                       |
| `mobile-optimized-checkout` | Boolean | true / false                               |

**theme-config variations:**

```json
{"mode": "light", "accent": "blue", "borderRadius": "md"}
{"mode": "dark", "accent": "purple", "borderRadius": "lg"}
{"mode": "light", "accent": "green", "borderRadius": "sm"}
```

### Context Kinds

The demo uses multi-context targeting with three context kinds:

| Context        | Key Attributes                                 |
| -------------- | ---------------------------------------------- |
| `user`         | key, name, plan, betaTester, visits, purchases |
| `device`       | key, deviceType (mobile/desktop/tablet), os    |
| `organization` | key, orgName, industry, employees, plan        |

### Segments

Create these segments for advanced targeting demos:

| Segment           | Context | Rule                           |
| ----------------- | ------- | ------------------------------ |
| `power-users`     | user    | visits > 100 OR purchases > 10 |
| `enterprise-orgs` | org     | plan = "enterprise"            |

### Targeting Rules

For `show-enterprise-tier`:

- Add **prerequisite**: `enhanced-hero` must be `true`
- Add targeting rule: **If** `user.betaTester` **is** `true` → serve `true`
- **Default** → serve `false`

For segment-based targeting (optional):

- `theme-config`: **If** user in segment `power-users` → serve dark purple theme
- `show-enterprise-tier`: **If** org in segment `enterprise-orgs` → serve `true`

### Experiments (Optional)

1. Create a metric `hero-cta-clicked` (Custom, Conversion, event key: `hero-cta-clicked`)
2. Create experiment `hero-cta-test` using `hero-cta-text` flag
3. Attach the `hero-cta-clicked` metric to the experiment

### AI Config (Optional)

Create an AI Config named `landing-chatbot-config` with:

- Model: `gpt-4o-mini` (or your preferred model)
- System prompt: Your chatbot personality/instructions

---

## Project Structure

```
ld-demo/
├── apps/
│   ├── api/          # Express server (Node SDK, AI SDK)
│   └── web/          # React + Vite (React SDK)
├── cli/              # CLI tools for flag management
├── scripts/          # Utility scripts
└── docs/             # Demo runbook
```

## Scripts

```bash
pnpm dev           # Start all dev servers
pnpm build         # Build all packages
pnpm typecheck     # Type checking
pnpm cli <cmd>     # Run CLI commands (see runbook for details)
pnpm ngrok         # Start ngrok tunnel (for webhooks)
pnpm kill:dev      # Kill dev servers (port cleanup)
```

## Environment Assumptions

- **OS**: macOS, Linux, or WSL (Windows Subsystem for Linux)
- **Node.js**: v20+ (`node --version` to check)
- **pnpm**: v9+ (`pnpm --version` to check; install with `npm install -g pnpm`)
- **Terminal**: Any bash-compatible shell
- **Ports**: 3000 (web) and 3001 (api) available
