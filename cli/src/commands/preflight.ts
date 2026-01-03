import { Command } from "commander";
import chalk from "chalk";
import LaunchDarkly from "@launchdarkly/node-server-sdk";
import { FLAGS } from "../lib/flags.js";

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

async function checkEnvVars(): Promise<CheckResult> {
  const required = ["LD_SDK_KEY", "VITE_LD_CLIENT_ID"];
  const missing = required.filter((v) => !process.env[v]);

  return {
    name: "Environment Variables",
    passed: missing.length === 0,
    message: missing.length
      ? `Missing: ${missing.join(", ")}`
      : "All required vars set",
  };
}

async function checkSdkConnection(): Promise<CheckResult> {
  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return { name: "SDK Connection", passed: false, message: "No SDK key" };
  }

  try {
    const client = LaunchDarkly.init(sdkKey);
    await client.waitForInitialization({ timeout: 5 });
    await client.close();
    return {
      name: "SDK Connection",
      passed: true,
      message: "Connected successfully",
    };
  } catch {
    return {
      name: "SDK Connection",
      passed: false,
      message: "Connection failed",
    };
  }
}

async function checkFlagsExist(): Promise<CheckResult> {
  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return { name: "Flags Exist", passed: false, message: "No SDK key" };
  }

  try {
    const client = LaunchDarkly.init(sdkKey);
    await client.waitForInitialization({ timeout: 5 });

    const context = { kind: "user" as const, key: "preflight-check" };
    const missing: string[] = [];

    for (const flag of Object.values(FLAGS)) {
      const value = await client.variation(flag, context, "__NOT_FOUND__");
      if (value === "__NOT_FOUND__") {
        missing.push(flag);
      }
    }

    await client.close();

    return {
      name: "Flags Exist",
      passed: missing.length === 0,
      message: missing.length
        ? `Missing: ${missing.join(", ")}`
        : "All flags found",
    };
  } catch {
    return { name: "Flags Exist", passed: false, message: "Check failed" };
  }
}

export const preflightCommand = new Command("preflight")
  .description("Validate environment before running")
  .action(async () => {
    console.log(chalk.bold("\nPreflight Checks\n"));

    const checks = [checkEnvVars(), checkSdkConnection(), checkFlagsExist()];

    const results = await Promise.all(checks);

    let allPassed = true;
    for (const result of results) {
      const icon = result.passed ? chalk.green("✔") : chalk.red("✖");
      const status = result.passed ? chalk.green("PASS") : chalk.red("FAIL");
      console.log(`${icon} ${result.name}: ${status}`);
      console.log(`  ${chalk.gray(result.message)}`);
      if (!result.passed) allPassed = false;
    }

    console.log();
    if (allPassed) {
      console.log(chalk.green.bold("All checks passed!"));
    } else {
      console.log(
        chalk.red.bold("Some checks failed. Fix issues before proceeding."),
      );
      process.exit(1);
    }
  });
