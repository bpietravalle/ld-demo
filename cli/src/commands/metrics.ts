import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { listMetrics, getMetric } from "../lib/api.js";

export const metricsCommand = new Command("metrics").description(
  "Manage metrics",
);

// List all metrics
metricsCommand
  .command("list")
  .alias("ls")
  .description("List all metrics")
  .action(async () => {
    const spinner = ora("Fetching metrics...").start();

    try {
      const metrics = await listMetrics();
      spinner.succeed(`Found ${metrics.length} metrics\n`);

      if (metrics.length === 0) {
        console.log(chalk.gray("No metrics found."));
        return;
      }

      // Table header
      console.log(
        chalk.gray(
          `${"KEY".padEnd(30)} ${"NAME".padEnd(25)} ${"KIND".padEnd(12)} EVENT KEY`,
        ),
      );
      console.log(chalk.gray("─".repeat(80)));

      for (const metric of metrics) {
        const key = metric.key.slice(0, 28).padEnd(30);
        const name = (metric.name || "").slice(0, 23).padEnd(25);
        const kind = metric.kind.padEnd(12);
        const eventKey = metric.eventKey || "";

        console.log(`${key} ${name} ${kind} ${chalk.cyan(eventKey)}`);
      }

      console.log();
    } catch (error) {
      spinner.fail("Failed to fetch metrics");
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });

// Show a single metric
metricsCommand
  .command("show <key>")
  .description("Show details for a specific metric")
  .action(async (key: string) => {
    const spinner = ora(`Fetching metric '${key}'...`).start();

    try {
      const metric = await getMetric(key);
      spinner.succeed(`Metric: ${chalk.bold(metric.key)}\n`);

      console.log(chalk.gray("─".repeat(50)));
      console.log(`${chalk.gray("Name:")}        ${metric.name || "—"}`);
      console.log(`${chalk.gray("Key:")}         ${metric.key}`);
      console.log(`${chalk.gray("Kind:")}        ${metric.kind}`);
      console.log(`${chalk.gray("Description:")} ${metric.description || "—"}`);
      console.log(`${chalk.gray("Event Key:")}   ${metric.eventKey || "—"}`);
      console.log(
        `${chalk.gray("Is Numeric:")}  ${metric.isNumeric ? "Yes" : "No"}`,
      );
      console.log(chalk.gray("─".repeat(50)));
      console.log();
    } catch (error) {
      spinner.fail(`Failed to fetch metric '${key}'`);
      console.error(chalk.red(String(error)));
      process.exit(1);
    }
  });
