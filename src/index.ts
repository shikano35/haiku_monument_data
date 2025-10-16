import { cors, errorHandler, logger } from "@/interfaces/middlewares";
import locationsRoutes from "@/interfaces/routes/locationsRoutes";
import monumentsRoutes from "@/interfaces/routes/monumentsRoutes";
import poemsRoutes from "@/interfaces/routes/poemsRoutes";
import poetsRoutes from "@/interfaces/routes/poetsRoutes";
import voidRoutes from "@/interfaces/routes/voidRoutes";
import type { Env } from "@/types";
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger);
app.use("*", cors);
app.use("*", errorHandler);

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
    formats: {
      available: ["text/turtle", "application/n-triples"],
      planned: ["application/ld+json", "application/rdf+xml"],
    },
    documentation: "https://github.com/shikano35/haiku_monument_data",
  });
});

app.route("/monuments", monumentsRoutes);
app.route("/poems", poemsRoutes);
app.route("/poets", poetsRoutes);
app.route("/locations", locationsRoutes);
app.route("/void", voidRoutes);

export default app;
