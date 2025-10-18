import { describe, it, expect } from "vitest";
import { DataFactory } from "n3";
import { serializeRDF } from "@/infrastructure/rdf/serializer";
import { VOCABULARIES } from "@/domain/vocabularies";

const { namedNode, literal, quad } = DataFactory;

describe("RDF Serializer", () => {
  const testQuads = [
    quad(
      namedNode("https://rdf.kuhi.jp/monuments/1"),
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.LandmarksOrHistoricalBuildings)
    ),
    quad(
      namedNode("https://rdf.kuhi.jp/monuments/1"),
      namedNode(VOCABULARIES.SCHEMA.name),
      literal("芭蕉記念碑", "ja")
    ),
  ];

  it("should serialize to Turtle format", async () => {
    const result = await serializeRDF(testQuads, "text/turtle");

    expect(result).toContain("https://rdf.kuhi.jp/monuments/1");
    expect(result).toContain("schema:LandmarksOrHistoricalBuildings");
    expect(result).toContain("芭蕉記念碑");
  });

  it("should serialize to N-Triples format", async () => {
    const result = await serializeRDF(testQuads, "application/n-triples");

    expect(result).toContain("<https://rdf.kuhi.jp/monuments/1>");
    expect(result).toContain(`<${VOCABULARIES.SCHEMA.LandmarksOrHistoricalBuildings}>`);
    expect(result).toContain('"芭蕉記念碑"@ja');
  });

  it("should include proper prefixes in Turtle", async () => {
    const result = await serializeRDF(testQuads, "text/turtle");

    expect(result).toContain("@prefix schema:");
    expect(result).toContain("@prefix rdf:");
  });

  it("should handle empty quad array", async () => {
    const result = await serializeRDF([], "text/turtle");

    expect(result).toBeTruthy();
  });

  it("should preserve language tags", async () => {
    const result = await serializeRDF(testQuads, "text/turtle");

    expect(result).toContain("@ja");
  });
});
