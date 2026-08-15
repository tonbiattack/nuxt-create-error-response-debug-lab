# 第01章: エラーJSONをreturnしてHTTP 200になる問題

## 目的

NuxtサーバーAPIで、エラーを表すJSONを通常の戻り値として返すと、本文にエラーコードがあってもHTTPステータスは`200`になります。不正入力に対する最終HTTP応答を確認し、`throw createError(...)`でエラーハンドリングを起動します。

## Red: 最初のテスト

空白だけの`title`に対して、`400`と機械可読なエラーコードを返すことを固定します。有効な`title`では`200`と更新結果を返すことも確認します。

```ts
const response = await callTasksApi("   ");

assert.equal(response.status, 400);
const payload = (await response.json()) as {
  statusCode: number;
  statusMessage: string;
  data: { code: string };
};

assert.equal(payload.statusCode, 400);
assert.equal(payload.statusMessage, "Invalid title");
assert.deepEqual(payload.data, { code: "INVALID_TITLE" });
```

```bash
git checkout bab79ef
npm install
npm run test:chapter-01
```

この状態では、ハンドラーが`{ code: "INVALID_TITLE" }`を通常の戻り値として返します。本文はエラーらしく見えますが、HTTPステータスは`200`なので、`200 !== 400`というアサーションで失敗します。

## Green: 最小修正

完成実装は[`server/api/tasks.patch.ts`](../server/api/tasks.patch.ts)にあります。不正入力時に`createError`を`throw`します。

```ts
if (typeof title !== "string" || title.trim().length === 0) {
  throw createError({
    statusCode: 400,
    statusMessage: "Invalid title",
    data: {
      code: "INVALID_TITLE"
    }
  });
}
```

```bash
git switch main
npm run typecheck
npm run test:chapter-01
npm test
npm run build
```

修正後は、`400`、短いステータス文、独自のエラーコードを持つエラーJSONが返ります。正常な更新結果も維持されます。

## 次に増やす振る舞い

次は、不正JSONの構文エラーを`400`へ変換するテストや、エラーコードを認証・認可・外部API失敗まで横断して統一する設計を追加できます。クライアントへ返す`statusMessage`にユーザー入力や機微情報を含めないことも、別の契約として明文化します。
