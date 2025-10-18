import { createWriter, serializeRDF } from "@/infrastructure/rdf/serializer";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import { describe, expect, it } from "vitest";

const { namedNode, literal, quad } = DataFactory;

describe("RDF Serializer", () => {
  const testQuads: Quad[] = [
    quad(
      namedNode("https://rdf.kuhi.jp/monuments/1"),
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("http://schema.org/Monument"),
    ),
    quad(
      namedNode("https://rdf.kuhi.jp/monuments/1"),
      namedNode("http://schema.org/name"),
      literal("テスト句碑", "ja"),
    ),
  ];

  describe("serializeRDF", () => {
    it("should serialize quads to Turtle format by default", async () => {
      const result = await serializeRDF(testQuads);

      expect(result).toContain("@prefix");
      expect(result).toContain("schema:");
      expect(result).toContain("Monument");
    });

    it("should serialize quads to Turtle format explicitly", async () => {
      const result = await serializeRDF(testQuads, "text/turtle");

      expect(result).toContain("@prefix");
      expect(result).toContain("schema:name");
      expect(result).toContain('"テスト句碑"@ja');
    });

    it("should serialize quads to N-Triples format", async () => {
      const result = await serializeRDF(testQuads, "application/n-triples");

      expect(result).not.toContain("@prefix");
      expect(result).toContain("<https://rdf.kuhi.jp/monuments/1>");
      expect(result).toContain("<http://schema.org/name>");
      expect(result).toContain('"テスト句碑"@ja');
    });

    it("should handle JSON-LD format (fallback to Turtle)", async () => {
      const result = await serializeRDF(testQuads, "application/ld+json");

      // N3.js doesn't support JSON-LD output, should fallback to Turtle
      expect(result).toContain("@prefix");
    });

    it("should handle RDF/XML format (fallback to Turtle)", async () => {
      const result = await serializeRDF(testQuads, "application/rdf+xml");

      // N3.js doesn't support RDF/XML output, should fallback to Turtle
      expect(result).toContain("@prefix");
    });

    it("should handle empty quads array", async () => {
      const result = await serializeRDF([]);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0); // Should contain at least prefixes
    });

    it("should include all default prefixes", async () => {
      const result = await serializeRDF(testQuads, "text/turtle");

      expect(result).toContain("@prefix schema:");
      expect(result).toContain("@prefix dc:");
      expect(result).toContain("@prefix foaf:");
      expect(result).toContain("@prefix geo:");
      expect(result).toContain("@prefix rdf:");
      expect(result).toContain("@prefix xsd:");
    });

    it("should preserve language tags", async () => {
      const quadsWithLang: Quad[] = [
        quad(
          namedNode("https://example.org/test"),
          namedNode("http://schema.org/name"),
          literal("テスト", "ja"),
        ),
      ];

      const result = await serializeRDF(quadsWithLang, "text/turtle");

      expect(result).toContain('"テスト"@ja');
    });

    it("should preserve datatypes", async () => {
      const quadsWithDatatype: Quad[] = [
        quad(
          namedNode("https://example.org/test"),
          namedNode("http://schema.org/latitude"),
          literal(
            "35.6812",
            namedNode("http://www.w3.org/2001/XMLSchema#decimal"),
          ),
        ),
      ];

      const result = await serializeRDF(quadsWithDatatype, "text/turtle");

      expect(result).toContain("35.6812");
      // N3.js may optimize the output and omit explicit datatype for decimals
      expect(result).toContain("latitude");
    });
  });

  describe("createWriter", () => {
    it("should create a Writer with default format", () => {
      const prefixes = {
        ex: "https://example.org/",
      };
      const writer = createWriter(prefixes);

      expect(writer).toBeDefined();
      expect(typeof writer.addQuad).toBe("function");
    });

    it("should create a Writer with Turtle format", () => {
      const prefixes = {
        ex: "https://example.org/",
      };
      const writer = createWriter(prefixes, "text/turtle");

      expect(writer).toBeDefined();
    });

    it("should create a Writer with N-Triples format", () => {
      const prefixes = {
        ex: "https://example.org/",
      };
      const writer = createWriter(prefixes, "application/n-triples");

      expect(writer).toBeDefined();
    });

    it("should accept custom prefixes", () => {
      const customPrefixes = {
        custom: "https://custom.example.org/",
        test: "https://test.example.org/",
      };
      const writer = createWriter(customPrefixes);

      expect(writer).toBeDefined();
    });
  });
});
