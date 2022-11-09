export enum TransactionType {
    deposit = 'DEPOSIT',
    withdrawal = 'WITHDRAWAL'
}

export interface Transaction {
    // Integer number of seconds since the Epoch
    timestamp: number;
    transactionType: TransactionType;
    // The amount transacted
    amount: number;
}

export interface TokenTransaction {
   [key: string]: Transaction[];
}