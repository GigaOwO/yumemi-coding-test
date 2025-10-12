/**
 * 環境変数のバリデーションモジュール
 * 必須の環境変数が設定されているかをチェックする
 */

/**
 * サーバーサイドで必要な環境変数
 */
const requiredServerEnvVars = ["API_URL", "API_KEY"] as const;

/**
 * 環境変数が設定されているかを検証する
 *
 * @throws {Error} 必須の環境変数が設定されていない場合
 */
export function validateEnv() {
  const missingVars: string[] = [];

  for (const envVar of requiredServerEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        `Please check your .env.local file and ensure all required variables are set.`
    );
  }
}

/**
 * 検証済みの環境変数を取得する型安全な関数
 */
export function getEnv() {
  validateEnv();

  return {
    apiUrl: process.env.API_URL!,
    apiKey: process.env.API_KEY!,
  };
}
