import {
  convertLocationToRDF,
  convertLocationsToRDF,
} from "@/domain/converters";
import { HaikuMonumentApiClient } from "@/infrastructure/api/HaikuMonumentApiClient";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import { Hono } from "hono";

const locationsRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /locations - すべての場所をRDF形式で取得
 */
locationsRoutes.get("/", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const limit = c.req.query("limit")
      ? Number.parseInt(c.req.query("limit") || "50", 10)
      : 50;
    const offset = c.req.query("offset")
      ? Number.parseInt(c.req.query("offset") || "0", 10)
      : 0;

    const data = await client.getAllLocations({ limit, offset });
    const quads = convertLocationsToRDF(data.locations);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return c.json(
      {
        error: "Failed to fetch locations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * GET /locations/:id - 特定の場所をRDF形式で取得
 */
locationsRoutes.get("/:id", async (c) => {
  try {
    const apiUrl = c.env.HAIKU_MONUMENT_API_URL;
    const client = new HaikuMonumentApiClient(apiUrl);

    const id = Number.parseInt(c.req.param("id"), 10);
    const location = await client.getLocation(id);

    if (!location) {
      return c.text("Location not found", 404);
    }

    const quads = convertLocationToRDF(location);

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);

    return c.body(rdf);
  } catch (error) {
    console.error("Error fetching location:", error);
    return c.json(
      {
        error: "Failed to fetch location",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default locationsRoutes;
