import {
  convertMonumentToRDF,
  convertMonumentsToRDF,
} from "@/domain/converters";
import { HaikuMonumentApiClient } from "@/infrastructure/api/HaikuMonumentApiClient";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import { Hono } from "hono";

const monumentsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /monuments - すべての句碑をRDF形式で取得
 */
monumentsRoutes.get("/", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const limit = c.req.query("limit")
      ? Number.parseInt(c.req.query("limit") || "50", 10)
      : 50;
    const offset = c.req.query("offset")
      ? Number.parseInt(c.req.query("offset") || "0", 10)
      : 0;

    const data = await client.getAllMonuments({ limit, offset, expand: "all" });
    const quads = convertMonumentsToRDF(data.monuments);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching monuments:", error);
    return c.json(
      {
        error: "Failed to fetch monuments",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * GET /monuments/:id - 特定の句碑をRDF形式で取得
 */
monumentsRoutes.get("/:id", async (c) => {
  try {
    const id = Number.parseInt(c.req.param("id"), 10);

    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid monument ID" }, 400);
    }

    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const monument = await client.getMonument(id, "all");
    const quads = convertMonumentToRDF(monument);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching monument:", error);

    if (
      error instanceof Error &&
      error.message.includes("Failed to fetch monument")
    ) {
      return c.json({ error: "Monument not found" }, 404);
    }

    return c.json(
      {
        error: "Failed to fetch monument",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default monumentsRoutes;
