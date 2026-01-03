import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { listAiConfigs, getAiConfig } from "../lib/api.js";

export const aiCommand = new Command("ai").description(
  "Manage AI configs (Beta)",
);

// List all AI configs
aiCommand
  .command("list")
  .alias("ls")
  .description("List all AI configs")
  .action(async () => {
    const spinner = ora("Fetching AI configs...").start();

    try {
      const configs = await listAiConfigs();
      spinner.succeed(`Found ${configs.length} AI configs\n`);

      if (configs.length === 0) {
        console.log(chalk.gray("No AI configs found."));
        return;
      }

      // Table header
      console.log(chalk.gray(`${"KEY".padEnd(30)} ${"NAME".padEnd(30)} TAGS`));
      console.log(chalk.gray("─".repeat(75)));

      for (const config of configs) {
        const key = config.key.slice(0, 28).padEnd(30);
        const name = (config.name || "").slice(0, 28).padEnd(30);
        const tags = config.tags?.join(", ") || "";

        console.log(`${key} ${name} ${chalk.cyan(tags)}`);
      }

      console.log();
    } catch (error) {
      spinner.fail("Failed to fetch AI configs");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

// Show a single AI config
aiCommand
  .command("show <key>")
  .description("Show details for a specific AI config")
  .action(async (key: string) => {
    const spinner = ora(`Fetching AI config '${key}'...`).start();

    try {
      const config = await getAiConfig(key);
      spinner.succeed(`AI Config: ${chalk.bold(config.key)}\n`);

      console.log(chalk.gray("─".repeat(50)));
      console.log(`${chalk.gray("Name:")}        ${config.name || "—"}`);
      console.log(`${chalk.gray("Key:")}         ${config.key}`);
      console.log(`${chalk.gray("Description:")} ${config.description || "—"}`);
      console.log(
        `${chalk.gray("Tags:")}        ${config.tags?.join(", ") || "—"}`,
      );

      if (config.versions && Array.isArray(config.versions)) {
        console.log(`${chalk.gray("Versions:")}    ${config.versions.length}`);
      }

      console.log(chalk.gray("─".repeat(50)));
      console.log();
    } catch (error) {
      spinner.fail(`Failed to fetch AI config '${key}'`);
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });
