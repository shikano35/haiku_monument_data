# Haiku Monument Data

句碑データを RDF (Resource Description Framework) 形式で公開する Linked Open Data プロジェクトです。

## 概要

このプロジェクトは、既存の`haiku_monument_api`から取得した句碑データを RDF 形式（Turtle, N-Triples, JSON-LD 等）に変換し、Linked Open Data として公開します。

## 技術スタック

- **ランタイム**: Cloudflare Workers
- **フレームワーク**: Hono
- **RDF ライブラリ**: N3.js
- **言語**: TypeScript
- **パッケージマネージャー**: pnpm
- **テスト**: Vitest
- **コード品質**: Biome

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

### ビルドとデプロイ

```bash
pnpm deploy
```

### テストの実行

```bash
# テスト実行
pnpm test

# カバレッジ付きテスト
pnpm test:coverage
```

### コードフォーマット

```bash
# フォーマット
pnpm format

# Lint
pnpm lint

# チェック（フォーマット+Lint）
pnpm check
```

## 開発

### 環境変数

`.dev.vars`ファイルを作成し、以下の環境変数を設定してください：

```env
HAIKU_MONUMENT_API_URL=https://your-api-url.com
```

### TypeScript 型生成

Wrangler 設定に基づいて型を生成・同期します：

```bash
pnpm cf-typegen
```

生成された`CloudflareBindings`型を Hono のジェネリクスとして使用：

```typescript
import { Hono } from "hono";
import type { Env } from "@/types";

const app = new Hono<{ Bindings: Env }>();
```

## RDF リソース

- `GET /` - データカタログ情報
- `GET /monuments` - すべての句碑の RDF
- `GET /monuments/:id` - 特定の句碑の RDF
- `GET /poems` - すべての俳句の RDF
- `GET /poems/:id` - 特定の俳句の RDF
- `GET /poets` - すべての俳人の RDF
- `GET /poets/:id` - 特定の俳人の RDF
- `GET /locations/:id` - 特定の場所の RDF
- `GET /void` - VoID ディスクリプタ（データセットメタデータ）

### Content Negotiation

`Accept`ヘッダーで出力フォーマットを指定できます：

- `text/turtle` - Turtle 形式（デフォルト）
- `application/n-triples` - N-Triples 形式
- `application/ld+json` - JSON-LD 形式
- `application/rdf+xml` - RDF/XML 形式

## プロジェクト構造

```
haiku_monument_data/
├── src/
│   ├── index.ts                    # エントリーポイント
│   ├── domain/                     # ドメイン層
│   │   ├── entities/              # エンティティ定義
│   │   ├── converters/            # RDF変換ロジック
│   │   └── vocabularies/          # RDF語彙定義
│   ├── infrastructure/            # インフラ層
│   │   └── rdf/                  # RDF生成・シリアライゼーション
│   ├── interfaces/               # インターフェース層
│   │   ├── routes/              # ルート定義
│   │   └── middlewares/         # ミドルウェア
│   ├── types/                   # 型定義
│   └── utils/                   # ユーティリティ
├── tests/                        # テスト
│   ├── unit/                    # ユニットテスト
│   └── integration/             # 統合テスト
├── package.json
├── tsconfig.json
├── wrangler.jsonc
├── vitest.config.ts
└── biome.json
```
