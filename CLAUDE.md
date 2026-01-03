# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LaunchDarkly SDK demonstration project showcasing feature flags, targeting, experimentation, and AI configurations. Built as a TypeScript pnpm/turbo monorepo with API and frontend packages.

## Build Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Run all packages in dev mode
pnpm dev --filter api # Run specific package

# Build
pnpm build            # Build all packages
pnpm build --filter web # Build specific package

# Linting/Type checking
pnpm typecheck
```

## Architecture

**Monorepo Structure:**

- `apps/api/` - Express backend (Node SDK, AI SDK, webhooks)
- `apps/web/` - React + Vite frontend (React SDK, Tailwind CSS)
- `cli/` - CLI tool for flag management

**LaunchDarkly Integration Points:**

- SDK initialization with environment-specific keys
- Feature flag evaluation with real-time listeners (no page reload)
- Context creation with custom attributes for targeting
- Trigger integration for automated flag control
- Metrics and experimentation setup
- AI Config for LLM prompt/model management

## Key LaunchDarkly Concepts

| Concept       | Purpose                                             |
| ------------- | --------------------------------------------------- |
| Feature Flags | Toggle features on/off, instant releases/rollbacks  |
| Listeners     | Real-time flag changes without page reload          |
| Triggers      | Automated flag control (e.g., kill switch via curl) |
| Contexts      | User/entity attributes for targeting rules          |
| Targeting     | Individual and rule-based feature rollouts          |
| Experiments   | A/B testing with metrics for data-driven decisions  |
| AI Configs    | Manage LLM prompts and models dynamically           |

## SDK Reference

**SDK Documentation:** https://docs.launchdarkly.com/

## Environment Variables

```bash
# LaunchDarkly SDKs
LD_SDK_KEY=sdk-xxx-xxx           # Server-side SDK key
VITE_LD_CLIENT_ID=xxx            # Client-side ID (VITE_ prefix for browser)

# LaunchDarkly REST API (for CLI)
LD_API_TOKEN=api-xxx-xxx         # API token with writer access
LD_PROJECT_KEY=default
LD_ENVIRONMENT_KEY=test

# OpenAI (for AI chatbot)
OPENAI_API_KEY=sk-xxx

# Webhooks (optional)
NGROK_DOMAIN=your-domain.ngrok-free.app
DEBUG_WEBHOOKS=false
```

## Demo Scenarios

1. **Release & Remediate** - Feature flag with instant toggle, listener for real-time updates, trigger for kill switch
2. **Target** - Context attributes, individual targeting, rule-based targeting
3. **Experimentation** - Metrics creation, experiment setup, data collection
4. **AI Configs** - Dynamic prompt/model management for chatbot
