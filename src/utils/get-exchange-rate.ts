import axios from "axios";
import { createSpinner } from "nanospinner";

import * as dotenv from "dotenv";
dotenv.config();

const CRYPTO_COMPARE_API_KEY = process.env.CRYPTO_COMPARE_API_KEY;

export const getUSDExchangeRate = async (tokens: string[]) => {
  const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti`;

  const spinner = createSpinner("Getting exchange rate information...").start();
  try {
    const response = await axios.get(apiUrl, {
      params: {
        // Comma separated cryptocurrency symbols list
        fsyms: tokens.join(","),
        // Comma separated cryptocurrency symbols list to convert into
        tsyms: "USD",
        api_key: CRYPTO_COMPARE_API_KEY,
      },
    });
    spinner.success();

    return response.data;
  } catch {
    spinner.error({
      text: "Something went wrong while getting exchange rates.",
    });
    process.exit(1);
  }
};
