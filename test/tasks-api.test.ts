import assert from "node:assert/strict";
import test from "node:test";

import { createApp, toWebHandler } from "h3";
import updateTaskHandler from "../server/api/tasks.patch.js";

async function callTasksApi(title: string): Promise<Response> {
  const app = createApp();
  app.use("/api/tasks", updateTaskHandler);

  const handler = toWebHandler(app);
  return handler(
    new Request(`http://localhost/api/tasks?title=${encodeURIComponent(title)}`, {
      method: "PATCH"
    })
  );
}

test("第01章: titleが空ならNuxtサーバーAPIは400とエラーJSONを返す", async () => {
  const response = await callTasksApi("   ");

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    code: "INVALID_TITLE",
    message: "titleは空でない文字列で指定してください"
  });
});

test("第01章: titleが有効ならNuxtサーバーAPIは更新結果を返す", async () => {
  const response = await callTasksApi("  設計レビュー  ");

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: "task-001",
    title: "設計レビュー"
  });
});
