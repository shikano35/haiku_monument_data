import { convertPoemToRDF, convertPoemsToRDF } from "@/domain/converters";
import { HaikuMonumentApiClient } from "@/infrastructure/api/HaikuMonumentApiClient";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import { Hono } from "hono";

const poemsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /poems - すべての俳句をRDF形式で取得
 */
poemsRoutes.get("/", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const limit = c.req.query("limit")
      ? Number.parseInt(c.req.query("limit") || "50", 10)
      : 50;
    const offset = c.req.query("offset")
      ? Number.parseInt(c.req.query("offset") || "0", 10)
      : 0;

    const data = await client.getAllPoems({ limit, offset });
    const quads = convertPoemsToRDF(data.poems);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching poems:", error);
    return c.json(
      {
        error: "Failed to fetch poems",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * GET /poems/:id - 特定の俳句をRDF形式で取得
 */
poemsRoutes.get("/:id", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const id = Number.parseInt(c.req.param("id"), 10);
    const poem = await client.getPoem(id);

    if (!poem) {
      return c.text("Poem not found", 404);
    }

    const quads = convertPoemToRDF(poem);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching poem:", error);
    return c.json(
      {
        error: "Failed to fetch poem",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default poemsRoutes;
