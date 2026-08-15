# Nuxt APIがエラーJSONを200で返す不具合のデバッグ記録

## 対象の不具合

`PATCH /api/tasks`は、空白だけの`title`を受け取った場合に`400`と`INVALID_TITLE`のエラーコードを返す契約です。バグ状態では、エラーを表すJSONを通常の戻り値として返していたため、本文にはエラーコードがある一方でHTTPステータスは`200`でした。

| 項目 | 期待値 | バグ状態での実際値 |
| --- | --- | --- |
| 不正`title`へのステータス | `400` | `200` |
| 不正`title`への本文 | エラーコードを持つエラーJSON | `INVALID_TITLE`を持つ通常JSON |
| 有効`title`へのステータス | `200` | `200` |
| エラー処理 | `throw createError(...)` | 通常オブジェクトを`return` |

## 再現条件

バグを含むコミットは`bab79ef`です。

```bash
git checkout bab79ef
npm install
npm run test:chapter-01
```

実行時の観測結果は次のとおりです。

```text
not ok 1 - 第01章: titleが空ならNuxtサーバーAPIは400とエラーJSONを返す
  error: |-
    Expected values to be strictly equal:
    200 !== 400
  expected: 400
  actual: 200
```

同じ実行では、有効な`title`に対する正常系テストは成功しました。

## 調査

| 確認対象 | 観測結果 | 判断 |
| --- | --- | --- |
| 入力 | `title=   ` | ハンドラーへ到達している |
| 入力検証 | 空白だけの`title`を不正と判定 | バリデーション条件は動作している |
| バグ状態の戻り値 | `INVALID_TITLE`を持つ通常オブジェクト | エラー本文は作られている |
| 最終HTTP応答 | ステータスが`200` | エラー処理は起動していない |
| 正常系 | `200`とトリミング済みのタスクJSON | 不具合は不正入力の分岐に限定される |
| Nuxt本番ビルド | 成功 | ルート登録・型設定の失敗ではない |

## 原因

NuxtのサーバーAPIでエラー処理を起動するには、`createError`を作るだけでなく`throw`する必要があります。公式の根拠は[公式仕様メモ](reference-notes.md)に記録しています。通常のオブジェクトを`return`したため、H3は成功したハンドラーの戻り値として`200`でJSON化しました。

## 修正

修正コミットは`b102eef`です。不正入力時に`throw createError(...)`を使うよう変更しました。

```ts
throw createError({
  statusCode: 400,
  statusMessage: "Invalid title",
  data: {
    code: "INVALID_TITLE"
  }
});
```

これにより、Nuxt/H3のエラーハンドリングが起動し、`400`と機械可読なエラーコードを持つJSONを返せます。

## 回帰確認

```bash
git switch main
npm run typecheck
npm run test:chapter-01
npm test
npm run build
```

修正後は型検査、対象テスト、全テスト、Nuxt本番ビルドが成功しました。回帰テストは、変更対象である不正入力時のステータス・エラーコードと、保持対象である正常入力の更新結果を両方確認します。

## 設計上の制約

このサンプルは短い固定`statusMessage`と`data.code`を返します。実APIでは、動的なユーザー入力や機微情報をエラー本文へ含めず、アプリケーション全体でエラーコードと公開メッセージの方針を統一する必要があります。
