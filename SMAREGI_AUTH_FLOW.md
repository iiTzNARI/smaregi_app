# スマレジ認証フロー解説

このアプリはスマレジAPIのOAuth2認証を利用し、ユーザーの売上データ取得を安全に行います。以下、フローの詳細を解説します。

## 1. ログインページ
- `/app/login/page.tsx` に「スマレジでログイン」ボタンを設置。
- ボタン押下でスマレジの認証エンドポイント（`https://id.smaregi.dev/authorize`）へリダイレクト。
- リダイレクトURLには `client_id`, `redirect_uri`, `scope`, `response_type=code` などを含めます。

## 2. スマレジ認証
- ユーザーがスマレジで認証・許可を行うと、`redirect_uri`（例: `http://localhost:3000/smaregi/callback`）に `code` パラメータ付きで戻ります。

## 3. コールバックページ
- `/app/smaregi/callback/page.tsx` で `code` を取得。
- `fetch('/api/smaregi/auth?code=...')` でサーバーAPIに認証コードを送信。

## 4. アクセストークン取得API
- `/app/api/smaregi/auth/route.ts` で `code` を受け取り、スマレジの `token` エンドポイントへPOST。
- 必要なパラメータ：
  - `grant_type=authorization_code`
  - `code`（認証コード）
  - `client_id`（.envから取得）
  - `client_secret`（.envから取得）
  - `redirect_uri`（.envから取得）
- スマレジから `access_token` を取得。

## 5. トークン保存と遷移
- コールバックページで `access_token` を localStorage に保存（`lib/session.ts`）。
- トップページ `/` へ遷移。

## 6. セッション管理
- `lib/session.ts` でトークンの取得・保存・削除を管理。
- 認証済みかどうかは `getSessionToken()` で判定可能。

---

## 参考：主要ファイル
- `app/login/page.tsx`：ログイン画面
- `app/smaregi/callback/page.tsx`：認証後のコールバック処理
- `app/api/smaregi/auth/route.ts`：アクセストークン取得API
- `lib/session.ts`：セッショントークン管理

## 公式ドキュメント
- [スマレジAPI認証ガイド](https://developers.smaregi.dev/platform-api-reference/start-guide/get-access-token)
- [スマレジAPI共通仕様](https://developers.smaregi.dev/platform-api-reference/common)

---

このフローにより、スマレジ認証・売上データ取得が安全かつシンプルに実現できます。
