# LaunchDarkly Demo

Sample application demonstrating LaunchDarkly feature flags, targeting, experimentation, and AI configs.

## Prerequisites

- Node.js 20+
- pnpm 9+
- [LaunchDarkly account](https://launchdarkly.com/start-trial/)
- [OpenAI API key](https://platform.openai.com/api-keys) (for AI chatbot)
- [ngrok account](https://dashboard.ngrok.com) (for webhook integration)

## Getting Started

```bash
# Clone and install
git clone <repo-url>
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
NGROK_DOMAIN=your-domain.ngrok-free.app
# DEBUG_WEBHOOKS=false  # Set to true for verbose payload logging

# Ports (optional, defaults: API=3001, Web=3000)
# API_PORT=3001
# WEB_PORT=3000
```

## Running the Demo

```bash
# Start development servers
pnpm dev

# Open http://localhost:3000
```

See **[Demo Runbook](./docs/demo-runbook.md)** for step-by-step walkthrough.

## CLI

```bash
pnpm cli preflight              # Validate environment setup

# Flags
pnpm cli flags list             # List all flags with state
pnpm cli flags show <flag>      # Show flag details with variations
pnpm cli flags toggle <flag>    # Toggle a flag on/off

# Experiments
pnpm cli experiments list       # List all experiments
pnpm cli experiments show <key> # Show experiment details

# Metrics
pnpm cli metrics list           # List all metrics
pnpm cli metrics show <key>     # Show metric details

# AI Configs (Beta)
pnpm cli ai list                # List AI configs
pnpm cli ai show <key>          # Show AI config details
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
