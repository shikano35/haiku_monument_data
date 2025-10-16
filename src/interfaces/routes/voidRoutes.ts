import { RESOURCE_BASE, VOCABULARIES } from "@/domain/vocabularies";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Env } from "@/types";
import { getContentType, negotiateFormat } from "@/utils/contentNegotiation";
import type { Quad } from "@rdfjs/types";
import { Hono } from "hono";
import { DataFactory } from "n3";

const { namedNode, literal, quad } = DataFactory;

const voidRoutes = new Hono<{ Bindings: Env }>();

function generateVoIDDescriptor(): Quad[] {
  const quads: Quad[] = [];
  const datasetUri = "https://rdf.kuhi.jp/dataset";
  const dataset = namedNode(datasetUri);

  const voidNs = "http://rdfs.org/ns/void#";
  const dctermsNs = "http://purl.org/dc/terms/";
  const foafNs = "http://xmlns.com/foaf/0.1/";

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(`${voidNs}Dataset`),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.DC.title),
      literal("句碑データ RDF Dataset", "ja"),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.DC.title),
      literal("Haiku Monument RDF Dataset", "en"),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.SCHEMA.description),
      literal(
        "日本全国の句碑・歌碑データをLinked Open Data形式で提供するデータセット",
        "ja",
      ),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.SCHEMA.description),
      literal(
        "A Linked Open Data dataset of haiku monuments across Japan",
        "en",
      ),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${dctermsNs}license`),
      namedNode("https://creativecommons.org/licenses/by/4.0/"),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${foafNs}homepage`),
      namedNode("https://rdf.kuhi.jp/"),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}exampleResource`),
      namedNode(`${RESOURCE_BASE.MONUMENTS}1`),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}exampleResource`),
      namedNode(`${RESOURCE_BASE.POEMS}1`),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}exampleResource`),
      namedNode(`${RESOURCE_BASE.POETS}1`),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}uriRegexPattern`),
      literal(
        "^https://rdf\\.kuhi\\.jp/(monuments|poems|poets|locations)/\\d+$",
      ),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}vocabulary`),
      namedNode(VOCABULARIES.SCHEMA.BASE),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}vocabulary`),
      namedNode(VOCABULARIES.DC.BASE),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}vocabulary`),
      namedNode(VOCABULARIES.FOAF.BASE),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${voidNs}vocabulary`),
      namedNode(VOCABULARIES.GEO.BASE),
    ),
  );

  quads.push(
    quad(dataset, namedNode(`${dctermsNs}subject`), literal("haiku", "en")),
  );

  quads.push(
    quad(dataset, namedNode(`${dctermsNs}subject`), literal("monuments", "en")),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${dctermsNs}subject`),
      literal("Japanese poetry", "en"),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(`${dctermsNs}subject`),
      literal("cultural heritage", "en"),
    ),
  );

  const now = new Date().toISOString();
  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.DC.created),
      literal("2025-10-15", namedNode(VOCABULARIES.XSD.date)),
    ),
  );

  quads.push(
    quad(
      dataset,
      namedNode(VOCABULARIES.DC.modified),
      literal(now, namedNode(VOCABULARIES.XSD.dateTime)),
    ),
  );

  return quads;
}

/**
 * GET /void - VoIDディスクリプタを取得
 */
voidRoutes.get("/", async (c) => {
  try {
    const quads = generateVoIDDescriptor();

    const acceptHeader = c.req.header("Accept");
    const format = negotiateFormat(acceptHeader);
    const rdf = await serializeRDF(quads, format);

    c.header("Content-Type", `${getContentType(format)}; charset=utf-8`);
    return c.body(rdf);
  } catch (error) {
    console.error("Error generating VoID descriptor:", error);
    return c.json(
      {
        error: "Failed to generate VoID descriptor",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export default voidRoutes;
