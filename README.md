# 都道府県別人口構成グラフ

株式会社ゆめみ フロントエンドエンジニア コーディング試験の課題プロジェクトです。

## 概要

このアプリケーションは、日本の都道府県別の人口構成データを可視化するWebアプリケーションです。ユーザーは複数の都道府県を選択し、選択した都道府県の人口推移を折れ線グラフで比較することができます。

### 主な機能

- **都道府県一覧の表示**: [ゆめみフロントエンドコーディング試験 API](https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc) から都道府県一覧を取得し、チェックボックス形式で動的に表示
- **人口構成データの取得**: 選択された都道府県の人口構成データをAPIから取得
- **人口推移グラフの表示**: X軸に年、Y軸に人口数を設定した折れ線グラフで人口推移を可視化
- **人口カテゴリの切り替え**: 以下のカテゴリを切り替えて表示可能
  - 総人口
  - 年少人口
  - 生産年齢人口
  - 老年人口

## デモ

[デプロイされたアプリケーションのURL](https://yumemi-coding-test-dusky.vercel.app/)

## 技術スタック

### フロントエンド

- **Next.js 15.5.4** - React フレームワーク（App Router使用）
- **React 19.1.0** - UIライブラリ
- **TypeScript** - 型安全性の確保
- **Tailwind CSS v4** - スタイリング
- **Chart.js 4.5.0** & **react-chartjs-2** - グラフ描画
- **SWR 2.3.6** - データフェッチング、キャッシング

### 開発・テスト

- **Vitest** - テストフレームワーク
- **Testing Library** - コンポーネントテスト
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマッター

## プロジェクト構成

```
yumemi-coding-test/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # メインページ
│   ├── layout.tsx               # ルートレイアウト
│   └── globals.css              # グローバルスタイル
├── features/                    # 機能別モジュール
│   ├── population/              # 人口データ関連
│   │   ├── components/         # 人口グラフコンポーネント
│   │   ├── hooks/              # カスタムフック
│   │   ├── services/           # API通信ロジック
│   │   ├── types/              # 型定義
│   │   └── constants/          # 定数（カラー、カテゴリ等）
│   └── prefecture/              # 都道府県関連
│       ├── components/         # 都道府県選択コンポーネント
│       ├── services/           # API通信ロジック
│       └── types/              # 型定義
├── __tests__/                   # テストファイル
├── public/                      # 静的ファイル
└── types/                       # 共通型定義
```

## 環境構築

### 前提条件

- Node.js 20.x 以上
- npm または yarn

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/GigaOwO/yumemi-coding-test.git
cd yumemi-coding-test
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を記述：

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_KEY=
```

> **注意**: API_URL、APIキーは[RESAS API](https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc)から取得してください。

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## スクリプト

| コマンド                | 説明                                |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | 開発サーバーを起動（Turbopack使用） |
| `npm run build`         | 本番用ビルドを作成                  |
| `npm run start`         | 本番サーバーを起動                  |
| `npm run lint`          | ESLintでコードを検証                |
| `npm run format`        | Prettierでコードを整形              |
| `npm run format:check`  | コードのフォーマットをチェック      |
| `npm run test`          | Vitestでテストを実行                |
| `npm run test:ui`       | VitestのUIモードでテストを実行      |
| `npm run test:coverage` | カバレッジレポートを生成            |

## テスト

### テストの実行

```bash
# 全テストを実行
npm run test

# UIモードでテストを実行
npm run test:ui

# カバレッジレポートを生成
npm run test:coverage
```

### テスト対象

- コンポーネントのレンダリングテスト
- ユーザーインタラクションテスト
- データフェッチングのテスト
- カスタムフックのテスト

## 設計・実装のポイント

### アーキテクチャ

- **Feature-based構成**: 機能ごとにディレクトリを分割し、関連するコンポーネント、フック、サービスをまとめて管理
- **関心の分離**: プレゼンテーション層とビジネスロジック層を明確に分離
- **型安全性**: TypeScriptを活用し、APIレスポンスからUIまで一貫した型定義を実装

### パフォーマンス最適化

- **SWRによるデータキャッシング**: 同じ都道府県のデータを再取得せずキャッシュから利用
- **React 19の最新機能**: パフォーマンス改善のための最新のReact機能を活用
- **Turbopack**: Next.js 15のTurbopackによる高速なビルドと開発体験

### ユーザビリティ

- **レスポンシブデザイン**: Tailwind CSSを使用したモバイルフレンドリーなUI
- **ローディング状態の表示**: データ取得中のスケルトンUI
- **エラーハンドリング**: APIエラーの適切な処理と表示

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数 `NEXT_PUBLIC_API_URL` `NEXT_PUBLIC_API_KEY`を設定
3. デプロイを実行

```bash
# または、Vercel CLIを使用
npm install -g vercel
vercel
```

## ライセンス

このプロジェクトは株式会社ゆめみのコーディング試験用に作成されたものです。

## 作者

[GigaOwO](https://github.com/GigaOwO)

---

**課題要件との対応**

- ✅ 都道府県一覧APIからデータ取得
- ✅ APIレスポンスから都道府県チェックボックスを動的生成
- ✅ 選択された都道府県の人口構成データを取得
- ✅ X軸:年、Y軸:人口数の折れ線グラフを動的生成
- ✅ 総人口、年少人口、生産年齢人口、老年人口の切り替えUI実装
