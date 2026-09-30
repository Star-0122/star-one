# STAR ONE

SORA NO HOSHI GROUP（そらのほしグループ）の統合デジタルプラットフォーム。

> すべてを、ひとつに。

---

## 概要

STAR ONEは、そらのほしグループに属する各サービスをひとつにつなぐ統合デジタルプラットフォームです。
ユーザーは1つの **STAR ID** でログインし、自分に必要なサービス・お知らせ・予定だけが整理された状態で表示されます。

```
SORA NO HOSHI GROUP
        │
        ▼
     STAR ID   （共通アカウント）
        │
        ▼
     STAR ONE  （統合プラットフォーム）
        │
        ├── sky+（主要デジタルサービス）
        ├── そらのほしグループの各サービス
        ├── お知らせ / STAR CALENDAR / 各種申請
        └── 今後追加されるサービス
```

STAR ONEの対象は、**そらのほしグループに正式に属するサービスのみ**です。グループ外のサービスは扱いません。

## SORA NO HOSHI GROUPについて

そらのほしグループは、教育・保育を中心としたグループです。STAR ONEはそのデジタル窓口として、正式ブランドロゴ（`public/logo-sora-no-hoshi.png`）を使用しています。ロゴの文字・色・形・配置は変更しないでください。

## STAR IDについて

STAR IDは、そらのほしグループ共通のアカウントです。ユーザーごとに以下を保持します（必要以上の個人情報は保持しません）。

- STAR ID / 表示名 / メールアドレス / プロフィール画像 / 電話番号 / 所属
- 権限（ロール）: `admin`（管理者）/ `guardian`（保護者）/ `student`（生徒）/ `staff`（スタッフ）/ `user`（利用者）— 拡張可能
- 利用可能サービス一覧 / 通知設定

ログイン後、ロールをユーザーに選ばせることはせず、STAR IDに設定された権限から自動的に利用可能な機能だけを表示します。

## STAR ONEについて

STAR ONEはグループサービスをまとめる「統合プラットフォーム」であり、`sky+` などの個別サービスそのものではありません。STAR ONEから各サービスへシームレスに移動できるようにする、という役割分担を徹底しています。

主な画面:

| 画面 | 説明 |
| --- | --- |
| 起動画面 | ロゴのフェードイン・軽い星のアニメーション |
| STAR ID ログイン | 共通アカウントでのログイン |
| STAR ONE HOME | 今日の予定・重要なお知らせ・MY SERVICES・NEWS |
| サービス一覧 | 利用できるサービスをカテゴリ別に表示 |
| 通知センター | 重要 / sky+ / イベント / システム / 申請結果 など |
| STAR CALENDAR | グループ全体の予定を横断的に表示 |
| アカウント・設定 | プロフィール・通知設定・ログイン履歴・ログアウト |
| STAR HELP | STAR ONE / STAR IDの使い方・FAQ |
| 管理者画面 | ユーザー・サービス・お知らせの管理（`admin`ロールのみ） |

## 技術構成

- React 18 + React Router 6（SPA）
- Vite（ビルドツール、GitHub Pages向けのbaseパス設定に対応）
- プレーンCSS（デザイントークン方式、`src/styles/tokens.css`）
- PWA: `manifest.webmanifest` / Service Worker / アイコン一式
- バックエンド: Supabase（現在）→ 抽象化レイヤー経由で Firebase へ移行可能な設計

## ディレクトリ構成

```
star-one/
├─ public/                 # 静的ファイル（ロゴ・アイコン・manifest・404.html など）
├─ src/
│  ├─ components/
│  │  ├─ layout/           # Header / BottomNav / Sidebar / Shell
│  │  └─ common/           # アイコン、Loading/Error/Empty等の状態表示
│  ├─ context/              # AuthContext（STAR IDのログイン状態）
│  ├─ data/                  # モック用ダミーデータ
│  ├─ hooks/                 # useAsync, useOnlineStatus
│  ├─ pages/                 # 画面コンポーネント（admin/ 配下は管理者画面）
│  ├─ services/
│  │  ├─ types.js            # BackendAdapterの型契約（JSDoc）
│  │  ├─ index.js            # UIが利用する唯一のエントリーポイント
│  │  └─ adapters/
│  │     ├─ MockAdapter.js     # バックエンド無しで動作するダミー実装
│  │     └─ SupabaseAdapter.js # Supabase実装（このファイル以外でSupabase SDKを使わない）
│  ├─ App.jsx / main.jsx
│  └─ index.css
├─ .github/workflows/deploy.yml
├─ .env.example
└─ vite.config.js
```

## Backend Adapter設計（重要）

UIコンポーネントは **`src/services/index.js` の関数だけ** を利用します（`getServices()`, `getCurrentUser()` など）。Supabase固有のAPI呼び出しは `src/services/adapters/SupabaseAdapter.js` の中だけに閉じ込めています。

```
STAR ONE Frontend (UI / Pages)
        │  ← Supabase/Firestore固有の型・SDKに依存しない
        ▼
  src/services/index.js  （Backend Adapterのエントリーポイント）
        │
   ┌────┴─────┐
   ▼          ▼
MockAdapter  SupabaseAdapter  （→ 将来 FirebaseAdapter を追加するだけ）
```

`VITE_BACKEND_PROVIDER` 環境変数で切り替えます（`mock` | `supabase`）。将来Firebaseへ移行する際は、`FirebaseAdapter.js` を追加して `src/services/index.js` の分岐に1行足すだけで、UI・ページは変更不要です。

## ローカル開発方法

```bash
npm install
npm run dev
```

初期状態では `VITE_BACKEND_PROVIDER=mock`（未設定時のデフォルト）で動作するため、Supabaseなしでもすべての画面を確認できます。デモ用ログインは画面下部に表示されます。

```bash
npm run build     # 本番ビルド（dist/ に出力）
npm run preview   # ビルド結果をローカルで確認
```

## 環境変数

`.env.example` をコピーして `.env.local` を作成してください（`.env.local` はコミットされません）。

```bash
cp .env.example .env.local
```

| 変数名 | 説明 |
| --- | --- |
| `VITE_BACKEND_PROVIDER` | `mock`（既定）または `supabase` |
| `VITE_SUPABASE_URL` | SupabaseのProject URL（公開情報） |
| `VITE_SUPABASE_ANON_KEY` | Supabaseのanon/publicキー（**Service Role Keyは絶対に入れない**） |

秘密鍵・Service Role Key・管理者パスワードなどはいかなる環境変数にもソースコードにも含めないでください。

## Supabase設定

1. Supabaseプロジェクトを作成し、Project URLとanonキーを取得
2. 以下のテーブルを目安に作成（詳細スキーマはプロジェクトの要件に応じて調整してください）
   - `users`, `star_ids`, `roles`, `services`, `user_services`, `notifications`, `events` / `calendar_events`, `documents`, `faq`, `admin_settings`
3. `id` はUUID、日時は ISO8601 形式、JSONは標準的な構造にしてください（Firebase移行時のデータ互換性のため）
4. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を `.env.local`（ローカル）またはGitHub Actions Secrets（本番）に設定
5. Service Role Keyはフロントエンドに一切含めず、必要な場合はサーバーサイド（Supabase Edge Functionsなど）でのみ扱ってください

## Firebase移行について

`src/services/adapters/` に `FirebaseAdapter.js` を追加し、`src/services/types.js` に定義された `AuthService` / `DatabaseService` / `StorageService` / `NotificationService` の各インターフェースを実装してください。`src/services/index.js` の

```js
const adapter = provider === 'supabase' ? SupabaseAdapter : MockAdapter;
```

の分岐に `provider === 'firebase' ? FirebaseAdapter : ...` を追加し、`VITE_BACKEND_PROVIDER=firebase` を設定すれば、UI・ページ・ルーティングを変更せずに移行できます。

想定される置き換え先:

| 現在（Supabase） | 将来（Firebase） |
| --- | --- |
| Supabase Auth | Firebase Authentication |
| Supabase Postgres | Cloud Firestore |
| Supabase Storage | Cloud Storage |
| （未実装） | Firebase Cloud Messaging |

## GitHub Pagesへのデプロイ

このリポジトリ名は `star-one` を想定しており、公開URLは次の形式になります。

```
https://<ユーザー名>.github.io/star-one/
```

### 方法A: `docs`フォルダをそのまま公開する（おすすめ・最も簡単）

このリポジトリには、あらかじめビルド済みの **`docs/` フォルダ**が同梱されています。Node.jsのインストールもビルドコマンドの実行も、GitHub Actionsも一切不要です。隠しフォルダ（`.github`）のアップロード漏れで詰まることもありません。

1. このプロジェクト一式（`docs/` フォルダを含む）をGitHubリポジトリへアップロードする
   （ドラッグ＆ドロップでアップロードする場合、`docs` は普通のフォルダなので問題なく認識されます）
2. リポジトリの **Settings → Pages** を開く
3. 「Build and deployment」の **Source** を「**Deploy from a branch**」にする
4. **Branch** を `main`、フォルダを `/docs` に設定して **Save**
5. 数十秒〜数分待ち、`https://<ユーザー名>.github.io/star-one/` を開く

コード（`src/`）を編集した場合は、`docs/` フォルダの中身も更新する必要があります。ローカルで

```bash
npm install
VITE_BASE_PATH=/star-one/ npm run build
```

を実行し、生成された `dist/` の中身を `docs/` フォルダへ上書きしてコミット・プッシュしてください。

### 方法B: GitHub Actionsで自動ビルド（開発を続ける場合におすすめ）

コードをこまめに更新する予定がある場合は、`.github/workflows/deploy.yml` を使った自動ビルドも用意しています。

1. GitHubリポジトリの **Settings → Pages** で、Source を「GitHub Actions」に設定
2. 必要に応じて **Settings → Secrets and variables → Actions** に以下を登録
   - `VITE_SUPABASE_URL`（Secret）
   - `VITE_SUPABASE_ANON_KEY`（Secret）
   - `VITE_BACKEND_PROVIDER`（Variable。未設定なら `mock` として動作）
3. `.github` フォルダ（中の `workflows/deploy.yml`）が確実にリポジトリへアップロードされていることを確認する
   （ドット付きフォルダは隠しファイル扱いで、アップロード時に見落とされがちなので要注意）
4. `main` ブランチへpush すると、GitHub Actionsが自動でビルド・デプロイします
5. リポジトリ名を `star-one` 以外にする場合は、`.github/workflows/deploy.yml` 内の `VITE_BASE_PATH` を `/<リポジトリ名>/` に変更してください

迷ったら、まずは**方法A**で公開してみてください。

### GitHub Pagesでのルーティング

GitHub Pagesは静的ホスティングのため、`/star-one/calendar` のような直接URLアクセスに対してデフォルトでは404を返します。本プロジェクトでは `public/404.html` が元のパスを保存してindex.htmlへリダイレクトし、`index.html` 側のスクリプトが History API でパスを復元することで、直接アクセス・リロードの両方に対応しています。

## GitHub Actions

`.github/workflows/deploy.yml` が以下を自動実行します。

```
push (main)
  → npm ci
  → npm run build
  → ビルド成功時のみ GitHub Pages へデプロイ
```

ビルドが失敗した場合、`deploy` ジョブは実行されないためデプロイされません。

## セキュリティ上の注意

- パスワードは平文で保存しない設計です（`MockAdapter` はローカルデモ専用の簡易実装であり、本番運用では利用しないでください）
- 権限チェックは将来的にサーバー側（Supabase Row Level Security / Firebaseセキュリティルール）でも必ず実施してください
- Service Role Keyやそのほかの秘密情報をフロントエンドのコード・環境変数・READMEに含めないでください
- `.env.local` / `.env.production` は `.gitignore` により追跡されません

## ライセンス

このリポジトリのソースコードはプロジェクトの方針に従って利用してください。「そらのほしグループ」の正式ロゴおよびブランド名は、そらのほしグループに帰属します。
