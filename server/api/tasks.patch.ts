import { createError, defineEventHandler, getQuery } from "h3";

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
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid title",
      data: {
        code: "INVALID_TITLE"
      }
    });
  }

  return {
    id: "task-001",
    title: title.trim()
  };
});
