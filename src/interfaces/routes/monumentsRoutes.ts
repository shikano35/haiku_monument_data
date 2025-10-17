import {
  convertMonumentToRDF,
  convertMonumentsToRDF,
  convertEventToRDF,
  convertMediaToRDF,
} from "@/domain/converters";
import { HaikuMonumentApiClient } from "@/infrastructure/api/HaikuMonumentApiClient";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import { Hono } from "hono";
import { Store } from "n3";

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
    
    // Eventsデータも追加でRDF化
    const store = new Store(quads);
    if (monument.events && monument.events.length > 0) {
      for (const event of monument.events) {
        convertEventToRDF(
          {
            id: event.id,
            eventType: event.event_type,
            huTimeNormalized: event.hu_time_normalized ?? undefined,
            intervalStart: event.interval_start ?? undefined,
            intervalEnd: event.interval_end ?? undefined,
            uncertaintyNote: event.uncertainty_note ?? undefined,
            actor: event.actor ?? undefined,
            source: event.source
              ? {
                  id: event.source.id,
                  citation: event.source.citation,
                  author: event.source.author ?? undefined,
                  title: event.source.title ?? undefined,
                  publisher: event.source.publisher ?? undefined,
                  sourceYear: event.source.source_year ?? undefined,
                  url: event.source.url ?? undefined,
                  createdAt: new Date(event.source.created_at),
                  updatedAt: new Date(event.source.updated_at),
                  uri: `https://rdf.kuhi.jp/sources/${event.source.id}`,
                }
              : undefined,
            uri: `https://rdf.kuhi.jp/events/${event.id}`,
          },
          store
        );
      }
    }
    
    // Mediaデータも追加でRDF化
    if (monument.media && monument.media.length > 0) {
      for (const media of monument.media) {
        convertMediaToRDF(
          {
            id: media.id,
            mediaType: media.media_type,
            url: media.url,
            iiifManifestUrl: media.iiif_manifest_url ?? undefined,
            capturedAt: media.captured_at ?? undefined,
            photographer: media.photographer ?? undefined,
            license: media.license ?? undefined,
            exif: media.exif ?? undefined,
            primary: media.primary ?? undefined,
            order: media.order ?? undefined,
            uri: `https://rdf.kuhi.jp/media/${media.id}`,
          },
          store
        );
      }
    }

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(store.getQuads(null, null, null, null), format);

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
