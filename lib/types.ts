// lib/types.ts

export type Transaction = {
  id: number;
  dateTime: string;
  total: number;
};

export type SmaregiSingleTransactionApiResponse = {
  transactionDateTime: string;
  total: number;
};
