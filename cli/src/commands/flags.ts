import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getApiConfig, listFlags, toggleFlag, getFlag } from "../lib/api.js";

export const flagsCommand = new Command("flags").description(
  "Manage feature flags",
);

// List all flags
flagsCommand
  .command("list")
  .alias("ls")
  .description("List all feature flags with their current state")
  .action(async () => {
    const spinner = ora("Fetching flags...").start();

    try {
      const { environmentKey } = getApiConfig();
      const flags = await listFlags();
      spinner.succeed(`Found ${flags.length} flags`);

      console.log(chalk.bold(`\nEnvironment: ${chalk.cyan(environmentKey)}\n`));

      // Table header
      console.log(
        chalk.gray(
          `${"FLAG".padEnd(35)} ${"TYPE".padEnd(10)} ${"STATE".padEnd(8)} DESCRIPTION`,
        ),
      );
      console.log(chalk.gray("─".repeat(80)));

      for (const flag of flags) {
        const env = flag.environments?.[environmentKey];
        const isOn = env?.on ?? false;
        const state = isOn ? chalk.green("ON") : chalk.red("OFF");
        const stateIcon = isOn ? chalk.green("●") : chalk.red("○");

        const key = flag.key.slice(0, 33).padEnd(35);
        const kind = flag.kind.padEnd(10);
        const desc = (flag.description || "").slice(0, 30);

        console.log(
          `${stateIcon} ${key} ${kind} ${state.padEnd(8)} ${chalk.gray(desc)}`,
        );
      }

      console.log();
    } catch (error) {
      spinner.fail("Failed to fetch flags");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

// Toggle a flag on/off
flagsCommand
  .command("toggle <flagKey>")
  .description("Toggle a flag on or off")
  .option("--on", "Turn the flag on")
  .option("--off", "Turn the flag off")
  .action(async (flagKey: string, options: { on?: boolean; off?: boolean }) => {
    // Determine target state
    let turnOn: boolean;

    if (options.on && options.off) {
      console.error(chalk.red("Cannot specify both --on and --off"));
      process.exit(1);
    }

    if (options.on) {
      turnOn = true;
    } else if (options.off) {
      turnOn = false;
    } else {
      // Auto-toggle: get current state and flip it
      const spinner = ora("Checking current state...").start();
      try {
        const { environmentKey } = getApiConfig();
        const flags = await listFlags();
        const flag = flags.find((f) => f.key === flagKey);

        if (!flag) {
          spinner.fail(`Flag '${flagKey}' not found`);
          process.exit(1);
        }

        const currentState = flag.environments?.[environmentKey]?.on ?? false;
        turnOn = !currentState;
        spinner.info(
          `Current: ${currentState ? "ON" : "OFF"} → Toggling to: ${turnOn ? "ON" : "OFF"}`,
        );
      } catch (error) {
        spinner.fail("Failed to check flag state");
        console.error(chalk.red(String(error)));
        process.exit(1);
      }
    }

    const spinner = ora(
      `Turning ${flagKey} ${turnOn ? "ON" : "OFF"}...`,
    ).start();

    try {
      await toggleFlag(flagKey, turnOn);
      const state = turnOn ? chalk.green("ON") : chalk.red("OFF");
      spinner.succeed(`${chalk.bold(flagKey)} is now ${state}`);
    } catch (error) {
      spinner.fail("Failed to toggle flag");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

// Show a single flag
flagsCommand
  .command("show <flagKey>")
  .description("Show details for a specific flag")
  .action(async (flagKey: string) => {
    const spinner = ora(`Fetching flag '${flagKey}'...`).start();

    try {
      const { environmentKey } = getApiConfig();
      const flag = await getFlag(flagKey);
      spinner.succeed(`Flag: ${chalk.bold(flag.key)}\n`);

      const env = flag.environments?.[environmentKey];
      const isOn = env?.on ?? false;
      const state = isOn ? chalk.green("ON") : chalk.red("OFF");

      console.log(chalk.gray("─".repeat(50)));
      console.log(`${chalk.gray("Name:")}        ${flag.name || "—"}`);
      console.log(`${chalk.gray("Key:")}         ${flag.key}`);
      console.log(`${chalk.gray("Kind:")}        ${flag.kind}`);
      console.log(`${chalk.gray("State:")}       ${state}`);
      console.log(`${chalk.gray("Description:")} ${flag.description || "—"}`);

      if (flag.variations && flag.variations.length > 0) {
        console.log(`${chalk.gray("Variations:")}`);
        for (let i = 0; i < flag.variations.length; i++) {
          const v = flag.variations[i];
          const value =
            typeof v.value === "string" ? v.value : JSON.stringify(v.value);
          const name = v.name ? ` (${v.name})` : "";
          console.log(`  ${chalk.cyan(`[${i}]`)} ${value}${chalk.gray(name)}`);
        }
      }

      console.log(chalk.gray("─".repeat(50)));
      console.log();
    } catch (error) {
      spinner.fail(`Failed to fetch flag '${flagKey}'`);
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });
