import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { listExperiments, getExperiment } from "../lib/api.js";

export const experimentsCommand = new Command("experiments")
  .alias("exp")
  .description("Manage experiments");

// List all experiments
experimentsCommand
  .command("list")
  .alias("ls")
  .description("List all experiments")
  .action(async () => {
    const spinner = ora("Fetching experiments...").start();

    try {
      const experiments = await listExperiments();
      spinner.succeed(`Found ${experiments.length} experiments\n`);

      if (experiments.length === 0) {
        console.log(chalk.gray("No experiments found."));
        return;
      }

      // Table header
      console.log(
        chalk.gray(`${"KEY".padEnd(30)} ${"NAME".padEnd(30)} STATUS`),
      );
      console.log(chalk.gray("─".repeat(75)));

      for (const exp of experiments) {
        const key = exp.key.slice(0, 28).padEnd(30);
        const name = (exp.name || "").slice(0, 28).padEnd(30);
        const status = exp.currentIteration?.status || "not started";

        let statusColor = chalk.gray;
        if (status === "running") statusColor = chalk.green;
        else if (status === "stopped") statusColor = chalk.yellow;

        console.log(`${key} ${name} ${statusColor(status)}`);
      }

      console.log();
    } catch (error) {
      spinner.fail("Failed to fetch experiments");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

// Show a single experiment
experimentsCommand
  .command("show <key>")
  .description("Show details for a specific experiment")
  .action(async (key: string) => {
    const spinner = ora(`Fetching experiment '${key}'...`).start();

    try {
      const exp = await getExperiment(key);
      spinner.succeed(`Experiment: ${chalk.bold(exp.key)}\n`);

      const status = exp.currentIteration?.status || "not started";
      let statusColor = chalk.gray;
      if (status === "running") statusColor = chalk.green;
      else if (status === "stopped") statusColor = chalk.yellow;

      console.log(chalk.gray("─".repeat(50)));
      console.log(`${chalk.gray("Name:")}        ${exp.name || "—"}`);
      console.log(`${chalk.gray("Key:")}         ${exp.key}`);
      console.log(`${chalk.gray("Description:")} ${exp.description || "—"}`);
      console.log(`${chalk.gray("Status:")}      ${statusColor(status)}`);

      if (exp.currentIteration?.startDate) {
        const start = new Date(
          exp.currentIteration.startDate,
        ).toLocaleDateString();
        console.log(`${chalk.gray("Started:")}     ${start}`);
      }

      if (exp.treatments && Array.isArray(exp.treatments)) {
        console.log(`${chalk.gray("Treatments:")}  ${exp.treatments.length}`);
      }

      console.log(chalk.gray("─".repeat(50)));
      console.log();
    } catch (error) {
      spinner.fail(`Failed to fetch experiment '${key}'`);
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });
