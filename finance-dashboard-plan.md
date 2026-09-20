# Implementation Plan - React Finance Analytics Dashboard Lab

## 1. Top-Level Overview
本リポジトリを出発点とし、IBMおよび競合4社（例: MSFT, ORCL, GOOGL, AAPL等）の株価・市場トレンドを可視化するReactベースの金融ダッシュボードアプリケーションを構築します。
3つの時間軸（当日・過去7日間・前四半期）のインタラクティブな切り替え、Yahoo Financeデータの抽象化サービス層、堅牢なエラーハンドリング/フォールバック、自動テスト、およびGitHub SDLC（Issue/PR自動化）に対応した設計を採用します。

---

## 2. Recommended Architecture

### 2.1 ソースフォルダ構成 (`src/`)
モジュール性と関心の分離を高め、将来の拡張（新ティッカー追加、新分析ビュー追加）を容易にする構成：

```
src/
├── assets/             # アイコン、スタイル、静的リソース
├── components/         # 再利用可能なUIコンポーネント
│   ├── common/         # Header, Navbar, LoadingSpinner, ErrorBoundary, ErrorAlert
│   ├── dashboard/      # TimeframeSelector, CompanySelector, MetricCard, SummaryGrid
│   └── charts/         # StockLineChart, VolumeBarChart, ComparisonChart
├── services/           # データ取得・API抽象化レイヤー
│   ├── yahooFinance.ts # Yahoo Finance API / クライアント実装
│   ├── mockData.ts     # オフライン・フォールバック・テスト用モックデータ
│   └── types.ts        # 金融データ型定義 (Quote, HistoricalData, TimeRange)
├── hooks/              # カスタムフック (データフェッチ・状態カプセル化)
│   ├── useStockData.ts # 選択企業・時間軸に応じたデータ取得フック
│   └── useComparison.ts# 複数銘柄の比較データ集計フック
├── utils/              # フォーマッター・計算ロジック
│   ├── formatters.ts   # 通貨($), パーセンテージ(%), 日付フォーマット
│   └── calculations.ts # 変動率(%), 高値/安値, 平均出来高の計算
├── App.tsx             # メインアプリケーションシェル
├── App.css / index.css # スタイリング
├── index.tsx           # Reactエントリポイント
└── setupTests.ts       # Jest / React Testing Library セットアップ
```

### 2.2 React コンポーネントの境界
- **App (Container / Shell)**: グローバルレイアウト、選択状態（銘柄、時間軸）の保持。
- **Header / Navigation**: タイトル、リフレッシュボタン、接続状態インジケータ。
- **TimeframeSelector**: 「当日 (1D)」「過去7日間 (7D)」「前四半期 (1Q / 3M)」のタブ切り替え。
- **CompanySelector / Filter**: IBM（固定主軸）+ 最大4社の競合銘柄（チェックボックス/チップ形式）。
- **SummaryMetricsSection**: 主要指標（現在値、前日比/前期間比、高値/安値、出来高）のカード一覧。
- **ChartSection**: Rechartsを用いたインタラクティブチャート（時系列推移、銘柄間パフォーマンス比較）。
- **ErrorBoundary / ErrorAlert**: 通信障害やレート制限時のフォールバック表示および再試行UI。

### 2.3 データサービスの抽象化
- **インターフェース定義 (`types.ts`)**:
  - `StockQuote`: 現在価格、変動額、変動率、取引量など。
  - `HistoricalPoint`: 日時 (timestamp)、始値/終値/高値/安値/出来高。
  - `TimeFrame`: `'1D' | '7D' | '1Q'`
- **抽象データクライアント (`yahooFinance.ts`)**:
  - API呼び出し部分をカプセル化し、実API（Yahoo Finance API / サーバープロキシ）とローカルモック（`mockData.ts`）をシームレスに切り替え可能にする。
  - レスポンスの正規化（Normalized Data）を行い、UIコンポーネントがAPIレスポンスの構造変化に影響されないよう保護。

### 2.4 チャートライブラリのアプローチ
- **選定: Recharts (または Chart.js / react-chartjs-2)**:
  - React親和性が高く、宣言的なコンポーネント設計（`<ResponsiveContainer>`, `<LineChart>`, `<Tooltip>`, `<Legend>`）。
  - レスポンシブ対応、ツールチップ、カスタムフォーマッターの統合が容易。
  - 複数銘柄の相対パフォーマンス（基準日を100%としたパーセンテージ推移）のオーバーレイ表示をサポート。

### 2.5 状態管理戦略
- **軽量・クリーンなアプローチ**:
  - アプリ規模と学習ラボとしての保守性を考慮し、React標準の **Context API + カスタムフック (`useStockData`)** または **React Query (TanStack Query) パターン** を採用。
  - UI状態（選択された時間軸、表示対象銘柄）とサーバキャッシュ状態（各銘柄の時系列データ、ローディング状態、エラー状態）を分離。

### 2.6 エラーハンドリング
- **APIエラー耐性**: レート制限、ネットワーク切断、無効なティッカーシンボルに対して適切なエラーメッセージを表示。
- **グレースフル・デグラデーション**: API障害時に自動的にモックデータへフォールバックするモードを搭載。
- **React Error Boundary**: コンポーネント描画エラーをキャッチし、アプリ全体のクラッシュを防止。

### 2.7 テスト戦略
- **単体テスト (Unit Tests)**:
  - `calculations.ts` / `formatters.ts`: 変動率計算、日付・通貨フォーマットの正確性検証。
  - `services/yahooFinance.ts`: APIレスポンスの正規化ロジックの検証（モックAPI使用）。
- **コンポーネントテスト (Integration / Component Tests)**:
  - React Testing Library + Jest を使用。
  - 時間軸切り替え時に正しいデータが渡されるかの検証。
  - エラー発生時にエラーメッセージが表示されるかの検証。
- **CI自動テスト**:
  - `.github/workflows/finance-app-ci.yml` に統合され、PRやプッシュ時に自動実行 (`npm test -- --runInBand`, `npm run lint`, `npm run build`)。

### 2.8 ローカル検証手順
1. `npm install` : 依存パッケージのインストール
2. `npm test` : 単体・統合テストの実行
3. `npm run lint` : コードスタイル・静的解析の実行
4. `npm start` : ローカル開発サーバ起動 (http://localhost:3000) での動作確認
5. `npm run build` : プロダクションビルドの検証

---

## 3. GitHub SDLC & 継続的機能進化 (Issue / PR Automation)

### 3.1 ワークフロー連携
- **Issue 起点の機能拡張**:
  - 例: 「カスタムティッカー追加機能」「テクニカル指標 (SMA/EMA) の追加」をIssueとして起票。
- **ブランチ戦略**:
  - `feature/<issue-number>-<feature-name>` または `bob/<issue-number>-<feature-name>` ブランチを作成。
- **Bob によるローカル実装 & 検証**:
  - Bob がIssueの内容を分析し、コード修正・新規コンポーネント作成・テスト追加を実施。
  - ローカルで `npm test` と `npm run build` を通過させる。
- **PR テンプレート連携 & CI 検証**:
  - `.github/PULL_REQUEST_TEMPLATE.md` に基づき、変更内容・テスト結果を記載したPRを作成。
  - `.github/workflows/finance-app-ci.yml` の CI パイプライン（Lint, Test, Build）が自動実行され、品質を担保して `main` にマージ。

---

## 4. Sub-Tasks for Implementation

### Sub-Task 1: Project Scaffolding & Setup
- **Intent**: Reactプロジェクトのベースファイル（`package.json`, `tsconfig.json`/`jsconfig.json`, CI設定調整）を構築する。
- **Expected Outcomes**: `npm install`, `npm test`, `npm run build` が動作するクリーンなスケルトン。
- **Todo List**:
  1. `package.json` の作成（React, Recharts, Lucide-react, Testing Library, TypeScript/Babel等）。
  2. プロジェクト設定ファイル（`tsconfig.json` 等）の作成。
  3. `public/index.html` および `src/index.tsx` の初期化。
- **Status**: `[ ] pending`

### Sub-Task 2: Data Service Layer & Types
- **Intent**: 金融データの型定義とYahoo Financeデータ取得/モックデータ層を実装する。
- **Expected Outcomes**: 銘柄情報・履歴データを安全に取得・正規化できるサービスクラス/関数。
- **Todo List**:
  1. `src/services/types.ts` にデータモデルを定義。
  2. `src/services/mockData.ts` にIBMおよび競合4社（MSFT, ORCL, GOOGL, AAPL）の1D/7D/1Qモックデータを作成。
  3. `src/services/yahooFinance.ts` にデータ取得・正規化サービスを実装。
  4. `src/utils/formatters.ts` と `src/utils/calculations.ts` を実装。
- **Status**: `[ ] pending`

### Sub-Task 3: Dashboard UI Components & Charts
- **Intent**: 時間軸切り替え、主要指標カード、株価チャートUIコンポーネントを構築する。
- **Expected Outcomes**: 当日・過去7日・前四半期を切り替えて視覚的に分析できる洗練されたUI。
- **Todo List**:
  1. `src/components/common/` にヘッダーやエラー表示コンポーネントを作成。
  2. `src/components/dashboard/` に `TimeframeSelector`, `CompanySelector`, `MetricCard` を作成。
  3. `src/components/charts/` に Recharts を用いた `StockLineChart`, `ComparisonChart` を作成。
  4. `src/App.tsx` で全コンポーネントを統合し、スタイリングを適用。
- **Status**: `[ ] pending`

### Sub-Task 4: Testing & Local/CI Validation
- **Intent**: 単体テスト・統合テストを追加し、CIワークフローとローカル検証をパスさせる。
- **Expected Outcomes**: カバレッジの高いテストスイートと、CIパイプラインの成功。
- **Todo List**:
  1. `src/utils/__tests__/calculations.test.ts` で計算ロジックをテスト。
  2. `src/services/__tests__/yahooFinance.test.ts` でデータ正規化をテスト。
  3. `src/components/__tests__/Dashboard.test.tsx` でUIインタラクションと時間軸切り替えをテスト。
  4. `npm run lint`, `npm test`, `npm run build` のローカル検証を実施。
- **Status**: `[ ] pending`
