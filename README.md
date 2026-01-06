# LaunchDarkly Demo

Sample application demonstrating LaunchDarkly feature flags, targeting, experimentation, and AI configs. Includes a CLI for toggling flags and inspecting LD resources directly from the terminal during demos.

## Prerequisites

**Required:**

- Node.js 20+
- pnpm 9+
- [LaunchDarkly account](https://launchdarkly.com/start-trial/)

**Optional:**

- [OpenAI API key](https://platform.openai.com/api-keys) - for AI chatbot demo (Part 4)
- [ngrok account](https://dashboard.ngrok.com) - for webhook demo (Part 5)

## Getting Started

```bash
# Clone and install
git clone git@github.com:bpietravalle/ld-demo.git
cd ld-demo
pnpm install

# Configure environment
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

# OpenAI (for AI chatbot)
OPENAI_API_KEY=sk-xxx

# Webhooks (get free static domain from https://dashboard.ngrok.com/domains)
NGROK_DOMAIN=https://your-domain.ngrok-free.app
# DEBUG_WEBHOOKS=false  # Set to true for verbose payload logging

# Ports (optional, defaults: API=3001, Web=3000)
# API_PORT=3001
# WEB_PORT=3000
```

## LaunchDarkly Setup

Before running the demo, create these resources in your LaunchDarkly project:

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

## Environment Assumptions

- **OS**: macOS, Linux, or WSL (Windows Subsystem for Linux)
- **Node.js**: v20+ (`node --version` to check)
- **pnpm**: v9+ (`pnpm --version` to check; install with `npm install -g pnpm`)
- **Terminal**: Any bash-compatible shell
- **Ports**: 3000 (web) and 3001 (api) available

## Running the Demo

```bash
# Verify environment is configured
pnpm cli preflight

# Start development servers
pnpm dev

# Open http://localhost:3000
```

### DevPanel

Click the gear icon (bottom-left) to open the DevPanel. Simulates different contexts without real authentication:

| Section      | Options                                                   |
| ------------ | --------------------------------------------------------- |
| User         | Anonymous, Free, Pro, Power User, Enterprise, Beta Tester |
| Device       | Desktop, iPhone, Android, iPad                            |
| Organization | TechStartup, GrowthCorp, MegaCorp                         |

**Flag Evaluations** shows current values with reasons: `DEFAULT`, `TARGET`, `RULE`, `PREREQ`, `OFF`

Switching contexts calls `identify()` and updates flags in real-time.

See **[Demo Runbook](./docs/demo-runbook.md)** for step-by-step walkthrough.

## CLI

Manage flags via [REST API](https://apidocs.launchdarkly.com/) without leaving the terminal.

```bash
pnpm cli preflight                        # Validate env setup

pnpm cli flags list                       # All flags with state
pnpm cli flags show <key>                 # Flag details + variations
pnpm cli flags toggle <key> [--on|--off]  # Toggle flag

pnpm cli experiments list|show <key>      # Experiments
pnpm cli metrics list|show <key>          # Metrics
pnpm cli ai list|show <key>               # AI Configs
```

## Webhook Integration

```bash
# Start ngrok tunnel (requires NGROK_DOMAIN in .env)
pnpm ngrok

# Configure webhook in LD: Integrations → Webhooks
# URL: https://your-domain.ngrok-free.app/ld-webhook
```

## Project Structure

```
ld-demo/
├── apps/
│   ├── api/          # Express server (Node SDK, AI SDK)
│   └── web/          # React + Vite (React SDK)
├── cli/              # CLI tools
├── scripts/          # Utility scripts
└── docs/             # Documentation
```

## Scripts

```bash
pnpm dev           # Start all dev servers
pnpm build         # Build all packages
pnpm typecheck     # Type checking
pnpm cli <cmd>     # Run CLI commands
pnpm ngrok         # Start ngrok tunnel
pnpm kill:dev      # Kill dev servers (port cleanup)
```
