import fs from "fs";
import readline from "readline";
import { TokenTransaction, Transaction, TransactionType } from "../transaction.model";

export const readCSV = function (filePath: string) {
  const tokenTransaction: TokenTransaction = {};

  return new Promise<TokenTransaction>((resolve, reject) => {
    const readStream = fs.createReadStream(
      filePath,
      "utf-8"
    );
  
    let lineCount = 0;
    const rl = readline.createInterface({ input: readStream });
    rl.on("line", (line: string) => {
      if (lineCount > 0) {
        const [timestamp, transactionType, token, amount] = line.split(',');
        const transaction: Transaction = {
          timestamp: parseInt(timestamp),
          amount: parseFloat(amount),
          transactionType: transactionType === "DEPOSIT" ? TransactionType.deposit : TransactionType.withdrawal,
        };
        
        if (token in tokenTransaction) {
          tokenTransaction[token].push(transaction);
        } else {
          tokenTransaction[token] = [transaction];
        }
      }
      

      lineCount++;
    });
    // TODO: What to do if error is thrown.
    rl.on("error", (error) => reject(error));
    rl.on("close", () => {
      resolve(tokenTransaction);
    });
  });
};
