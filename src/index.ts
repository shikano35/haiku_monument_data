import type { Env } from "@/types";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

/**
 * ルートエンドポイント
 */
app.get("/", (c) => {
  return c.json({
    message: "Haiku Monument RDF Data",
    version: "1.0.0",
    description: "句碑データをRDF形式で公開するLinked Open Dataプロジェクト",
    availableResources: {
      monuments: "/monuments",
      poems: "/poems",
      poets: "/poets",
      locations: "/locations",
      void: "/void",
    },
    formats: [
      "text/turtle",
      "application/n-triples",
      "application/ld+json",
      "application/rdf+xml",
    ],
    documentation: "https://github.com/shikano35/haiku_monument_data",
  });
});

/**
 * TODO: RDFリソースの公開エンドポイントを実装
 * - GET /monuments - すべての句碑のRDF
 * - GET /monuments/:id - 特定の句碑のRDF
 * - GET /poems - すべての俳句のRDF
 * - GET /poems/:id - 特定の俳句のRDF
 * - GET /poets - すべての俳人のRDF
 * - GET /poets/:id - 特定の俳人のRDF
 * - GET /locations/:id - 特定の場所のRDF
 * - GET /void - VoIDディスクリプタ
 */

export default app;
