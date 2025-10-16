import { convertPoetToRDF, convertPoetsToRDF } from "@/domain/converters";
import { HaikuMonumentApiClient } from "@/infrastructure/api/HaikuMonumentApiClient";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import { Hono } from "hono";

const poetsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /poets - すべての俳人をRDF形式で取得
 */
poetsRoutes.get("/", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const limit = c.req.query("limit")
      ? Number.parseInt(c.req.query("limit") || "50", 10)
      : 50;
    const offset = c.req.query("offset")
      ? Number.parseInt(c.req.query("offset") || "0", 10)
      : 0;

    const data = await client.getAllPoets({ limit, offset });
    const quads = convertPoetsToRDF(data.poets);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching poets:", error);
    return c.json(
      {
        error: "Failed to fetch poets",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * GET /poets/:id - 特定の俳人をRDF形式で取得
 */
poetsRoutes.get("/:id", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const id = Number.parseInt(c.req.param("id"), 10);
    const poet = await client.getPoet(id);

    if (!poet) {
      return c.text("Poet not found", 404);
    }

    const quads = convertPoetToRDF(poet);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching poet:", error);
    return c.json(
      {
        error: "Failed to fetch poet",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default poetsRoutes;
