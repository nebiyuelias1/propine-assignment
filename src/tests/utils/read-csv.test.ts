import { describe, expect, test } from "@jest/globals";
import { readCSV } from "../../utils/read-csv";
import appRoot from "app-root-path";
import path from "path";

describe("read csv tests", () => {
  const fixtureFilePath = path.join(
    appRoot.toString(),
    "src",
    "tests",
    "fixtures",
    "transactions-small.csv"
  );

  test("should contain the correct token keys", async () => {
    const result = await readCSV(fixtureFilePath);
    const expectedKeys = ["BTC", "ETH", "XRP"];
    const actualKeys = Object.keys(result);

    expect(actualKeys).toEqual(expectedKeys);
  });

  test("should contain the right transactions", async () => {
    const result = await readCSV(fixtureFilePath);
    const expected = {
      BTC: [
        {
          timestamp: 1571967208,
          amount: 0.29866,
          transactionType: "DEPOSIT",
        },
      ],
      ETH: [
        {
          timestamp: 1571967200,
          amount: 0.68364,
          transactionType: "DEPOSIT",
        },
        {
          timestamp: 1571967189,
          amount: 0.493839,
          transactionType: "WITHDRAWAL",
        },
        {
          timestamp: 1571967110,
          amount: 0.347595,
          transactionType: "DEPOSIT",
        },
        {
          timestamp: 1571966982,
          amount: 0.266166,
          transactionType: "WITHDRAWAL",
        },
      ],
      XRP: [
        {
          timestamp: 1571967150,
          amount: 0.693272,
          transactionType: "DEPOSIT",
        },
        {
          timestamp: 1571967067,
          amount: 0.393786,
          transactionType: "WITHDRAWAL",
        },
        {
          timestamp: 1571966896,
          amount: 0.81984,
          transactionType: "WITHDRAWAL",
        },
        {
          timestamp: 1571966868,
          amount: 0.969999,
          transactionType: "WITHDRAWAL",
        },
        {
          timestamp: 1571966849,
          amount: 0.650535,
          transactionType: "WITHDRAWAL",
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
