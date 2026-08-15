import { defineEventHandler, getQuery } from "h3";

type TaskUpdateResponse = {
  id: string;
  title: string;
};

type ApiErrorResponse = {
  code: "INVALID_TITLE";
  message: string;
};

export default defineEventHandler((event): TaskUpdateResponse | ApiErrorResponse => {
  const { title } = getQuery(event);

  if (typeof title !== "string" || title.trim().length === 0) {
    return {
      code: "INVALID_TITLE",
      message: "titleは空でない文字列で指定してください"
    };
  }

  return {
    id: "task-001",
    title: title.trim()
  };
});
