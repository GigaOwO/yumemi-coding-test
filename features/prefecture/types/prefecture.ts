/**
 * 都道府県の情報を表す型
 */
export type Prefecture = {
  /** 都道府県コード */
  prefCode: number;
  /** 都道府県名 */
  prefName: string;
};

/**
 * 都道府県APIのレスポンス型
 */
export type PrefectureResponse = {
  /** エラーメッセージ (エラーがない場合はnull) */
  message: string | null;
  /** 都道府県のリスト */
  result: Prefecture[];
};
