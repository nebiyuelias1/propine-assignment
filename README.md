# Propine Assignment
[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/preferred-node-version)
[![TypeScript](https://img.shields.io/badge/-TypeScript-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)

A command line utility to parse a CSV file of transactions and output
portfolio value in USD on the command line.

## Requirements
* Node.js Runtime v12.22.9
* A CSV file that contains transaction information. The transaction should look like the following:
```
timestamp,transaction_type,token,amount
1571967208,DEPOSIT,BTC,0.298660
```

## Usage
- Clone this repository and navigate to the root directory and run the following command to install dependencies:
```
npm i
```
- Make sure to add the transactions CSV file in the **src** directory. A sample can be found [here](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip). It's not included in this repo because the file is very large.
- Build the project using:
```
npm run build
```
- After that install the command line binary as a global package using:
```
npm i -g .
```
- Now you should have the **propine** command line tool in your system.
- To get latest portfolio value per token in USD, use:
```
propine portfolio
```
- To get the latest portfolio value for BTC token in USD, use:
```
propine portfolio --token BTC
```
- To get the portfolio value per token in USD on 10/19/2019, use:
```
propine portfolio --date 10/19/2019
```
- To get the portfolio value for the BTC token in USD on 10/19/2019, use:
```
propine portfolio --token BTC --date 10/19/2019
```

## Design Decisions
- I used TypeScript for the project to get type safety. The **tsc** compiler transpiles the TS code to JS.
- Since the CSV file that needs to be parsed is really huge (almost 1GB), I have to use a read steam. Then parse each line of the file one by one excluding the header. The implementation of this is found inside this [file](https://github.com/nebiyuelias1/propine-assignment/blob/main/src/utils/read-csv.ts). The implementation of this file has been tested using the [Jest](https://jestjs.io/) testing framework. The testing can be found inside this [file](https://github.com/nebiyuelias1/propine-assignment/blob/main/src/tests/utils/read-csv.test.ts). I have a smaller CSV file for test fixture. The __readCSV__ function returns a promise (```Promise<TokenTransaction>```).
- I used the [nanospinner](https://www.npmjs.com/package/nanospinner) package to show a spinner while asynchronous operations are under progress. This avoids the illusion the program has frozen while doing operations. Specially while parsing the CSV file it can take some time to finish.
- I used to [yargs](https://github.com/yargs/yargs) package to parse command line arguments. It displays a nice usage message automatically without additional work.
- I added a [getPortfolioValue](https://github.com/nebiyuelias1/propine-assignment/blob/main/src/utils/get-portfolio-value.ts) function that takes in the parsed transaction data and command line arguments. I also created a [getUSDExchangeRate](https://github.com/nebiyuelias1/propine-assignment/blob/main/src/utils/get-exchange-rate.ts) function that gets exchange rate information for cryptocurrencies. I used the [axios](https://www.npmjs.com/package/axios) package to make the HTTP request to the (cryptocompare)[https://min-api.cryptocompare.com/] API.
> NB: I added the .env that contains API KEY from cryptocompare because this is a demo project. Normally, I wouldn't commit this .env file to a public repository.
- The getPortfolio value will use the [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) function to get a single portfolio value from an array of transactions. We add for deposits and subtract for withdrawals. We then multiply the final reduced value with the exchange rate received from cryptocompare and return the result.
- Finally, output the result on the console, formatted nicely with Intl. A sample output looks like the following:
```
✔ Parsing CSV file...
✔ Getting exchange rate information...

Portfolio
=================
BTC: $19,806,522,836.46 USD
ETH: $1,103,613,906.20 USD
XRP: $310,385.21 USD
```