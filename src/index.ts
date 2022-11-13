#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { readCSV } from "./utils/read-csv";
import appRoot from "app-root-path";
import path from "path";
import { getPortfolioValue } from "./utils/get-portfolio-value";
import { createSpinner } from "nanospinner";
import { Portfolio } from "./portfolio.model";
import { parseDate } from "./utils/parse-date";

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command("portfolio", "Get portfolio value")
    .demandCommand(1)
    .option("token", {
      alias: "t",
      type: "string",
      description: "Return the latest portfolio value for the token in USD",
    })
    .option("date", {
      alias: "d",
      type: "string",
      describe: "mm-dd-yyyy",
    }).argv;

  const filePath = path.join(
    appRoot.toString(),
    "src",
    "transactions.csv"
  );

  const spinner = createSpinner("Parsing CSV file...").start();
  const csvData = await readCSV(filePath);
  spinner.success();

  let portfolio: Portfolio;
  const { token, date } = argv;
  if (token && date) {
    const dateObj = parseDate(date);
    portfolio = await getPortfolioValue(csvData, token, dateObj);
  } else if (token) {
    portfolio = await getPortfolioValue(csvData, token);
  } else if (date) {
    const dateObj = parseDate(date);
    portfolio = await getPortfolioValue(csvData, undefined, dateObj);
  } else {
    // No params.
    portfolio = await getPortfolioValue(csvData);
  }

  const tokens = Object.keys(portfolio);
  console.log();
  console.log('Portfolio');
  console.log('=================');
  tokens.forEach(token => {
    const formattedUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio[token]);
    console.log(`${token}: ${formattedUSD} USD`);
  });
  console.log();
}

main();
