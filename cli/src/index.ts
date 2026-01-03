#!/usr/bin/env node
import { config } from "dotenv";
import { resolve } from "path";
import { Command } from "commander";
import { preflightCommand } from "./commands/preflight.js";
import { flagsCommand } from "./commands/flags.js";
import { aiCommand } from "./commands/ai.js";
import { experimentsCommand } from "./commands/experiments.js";
import { metricsCommand } from "./commands/metrics.js";

// Load .env from repo root
config({ path: resolve(import.meta.dirname, "../../.env"), quiet: true });

const program = new Command();

program.name("ld-demo").description("LaunchDarkly Demo CLI").version("0.1.0");

program.addCommand(preflightCommand);
program.addCommand(flagsCommand);
program.addCommand(aiCommand);
program.addCommand(experimentsCommand);
program.addCommand(metricsCommand);

program.parse();
