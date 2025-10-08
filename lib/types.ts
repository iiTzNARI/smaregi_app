// アプリケーション全体で使う「取引」のデータ型
export type Transaction = {
  id: string;
  transactionDateTime: string; // ← ここを追加
  total: number;
  // ...他の必要なフィールド
};

// 「取引一覧取得」APIのレスポンスの型
export type SmaregiTransactionListItem = {
  transactionHeadId: string;
  transactionDateTime: string;
  total: number;
};
