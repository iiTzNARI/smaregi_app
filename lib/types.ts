// アプリケーション全体で使う「取引」のデータ型
export type Transaction = {
  id: number | string;
  dateTime: string;
  total: number;
};

// 「取引一覧取得」APIのレスポンスの型
export type SmaregiTransactionListItem = {
  transactionHeadId: string;
  transactionDateTime: string;
  total: number;
};
