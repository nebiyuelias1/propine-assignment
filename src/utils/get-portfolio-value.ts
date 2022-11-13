import { Portfolio } from "../portfolio.model";
import { TokenTransaction, TransactionType } from "../transaction.model";
import { getUSDExchangeRate } from "./get-exchange-rate";

export const getPortfolioValue = async (
  data: TokenTransaction,
  tokenParam?: string,
  dateParam?: Date
) => {
  const tokens = tokenParam ? [tokenParam] : Object.keys(data);
  const portfolio: Portfolio = {};

  const usdExchangeRate = await getUSDExchangeRate(tokens);

  let dayStart = 0;
  let dayEnd = 0;
  const SECONDS_TO_MILLISECONDS = 1000;

  if (dateParam) {
    // The timestamp of the start of the day
    dayStart = dateParam.getTime();
    dateParam.setHours(23);
    dateParam.setMinutes(59);
    dateParam.setSeconds(59);
    dateParam.setMilliseconds(999);
    // The timestamp of the end of the day
    dayEnd = dateParam.getTime();
  }

  tokens.forEach((token) => {
    let transactions = data[token];

    if (dateParam) {
      // Filter transactions between dayStart and dayEnd.
      // We multiply timestamp by 1000 because the value is
      // in seconds.
      transactions = data[token].filter(
        (t) =>
          dayStart <= t.timestamp * SECONDS_TO_MILLISECONDS &&
          t.timestamp * SECONDS_TO_MILLISECONDS <= dayEnd
      );
    }

    const value = transactions.reduce((previousValue, currentValue) => {
      // Get the sign to add or subtract.
      const sign =
        currentValue.transactionType === TransactionType.withdrawal ? -1 : 1;

      return previousValue + currentValue.amount * sign;
    }, 0);

    const usdExchangeRateForToken = usdExchangeRate[token]["USD"];
    portfolio[token] = value * usdExchangeRateForToken;
  });

  return portfolio;
};
