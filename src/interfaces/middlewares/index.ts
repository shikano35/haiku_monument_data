import type { Env } from "@/types";
import type { Context, Next } from "hono";

/**
 * エラーハンドリングミドルウェア
 */
export async function errorHandler(c: Context<{ Bindings: Env }>, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof Error) {
      return c.json(
        {
          error: "Internal Server Error",
          message: error.message,
        },
        500,
      );
    }

    return c.json(
      {
        error: "Unknown Error",
        message: "An unknown error occurred",
      },
      500,
    );
  }
}

/**
 * ロギングミドルウェア
 */
export async function logger(c: Context<{ Bindings: Env }>, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const end = Date.now();
  const duration = end - start;
  const status = c.res.status;

  console.log(`${method} ${path} ${status} ${duration}ms`);
}

/**
 * CORS ミドルウェア
 */
export async function cors(c: Context<{ Bindings: Env }>, next: Next) {
  await next();

  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS",
  );
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept",
  );
}
