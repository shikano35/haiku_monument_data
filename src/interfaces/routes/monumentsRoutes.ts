import {
  convertEventToRDF,
  convertInscriptionToRDF,
  convertMediaToRDF,
  convertMonumentToRDF,
  convertMonumentsToRDF,
  inscriptionApiToRDF,
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

    // Store を作成
    const store = new Store(quads);

    // Inscriptionsデータを埋め込み形式でRDF化
    if (monument.inscriptions && monument.inscriptions.length > 0) {
      for (const inscription of monument.inscriptions) {
        convertInscriptionToRDF(
          inscriptionApiToRDF(inscription, monument.id),
          store,
        );
      }
    }

    // Eventsデータも追加でRDF化
    if (monument.events && monument.events.length > 0) {
      for (const event of monument.events) {
        const eventQuads = convertEventToRDF({
          id: event.id,
          event_type: event.event_type,
          hu_time_normalized: event.hu_time_normalized,
          interval_start: event.interval_start,
          interval_end: event.interval_end,
          uncertainty_note: event.uncertainty_note,
          actor: event.actor,
          source: event.source
            ? {
                id: event.source.id,
                citation: event.source.citation,
                author: event.source.author,
                title: event.source.title,
                publisher: event.source.publisher,
                source_year: event.source.source_year,
                url: event.source.url,
                created_at: event.source.created_at,
                updated_at: event.source.updated_at,
              }
            : null,
        });
        for (const q of eventQuads) {
          store.addQuad(q);
        }
      }
    }

    // Mediaデータも追加でRDF化
    if (monument.media && monument.media.length > 0) {
      for (const media of monument.media) {
        const mediaQuads = convertMediaToRDF({
          id: media.id,
          media_type: media.media_type,
          url: media.url,
          iiif_manifest_url: media.iiif_manifest_url,
          captured_at: media.captured_at,
          photographer: media.photographer,
          license: media.license,
          exif: media.exif,
          primary: media.primary,
          order: media.order,
        });
        for (const q of mediaQuads) {
          store.addQuad(q);
        }
      }
    }

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(
      store.getQuads(null, null, null, null),
      format,
    );

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
