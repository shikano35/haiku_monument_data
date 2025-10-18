import { describe, it, expect } from "vitest";
import { negotiateFormat, getContentType } from "@/utils/contentNegotiation";

describe("Content Negotiation", () => {
  describe("negotiateFormat", () => {
    it("should return text/turtle for Accept: text/turtle", () => {
      const format = negotiateFormat("text/turtle");
      expect(format).toBe("text/turtle");
    });

    it("should return application/n-triples for Accept: application/n-triples", () => {
      const format = negotiateFormat("application/n-triples");
      expect(format).toBe("application/n-triples");
    });

    it("should return text/turtle as default", () => {
      const format = negotiateFormat();
      expect(format).toBe("text/turtle");
    });

    it("should return text/turtle for unknown Accept header", () => {
      const format = negotiateFormat("application/unknown-format");
      expect(format).toBe("text/turtle");
    });

    it("should handle Accept header with quality values", () => {
      const format = negotiateFormat("text/html,text/turtle;q=0.9,*/*;q=0.8");
      expect(format).toBe("text/turtle");
    });

    it("should handle Accept header with multiple RDF formats", () => {
      const format = negotiateFormat("application/n-triples,text/turtle");
      expect(format).toBe("application/n-triples");
    });

    it("should be case-insensitive", () => {
      const format = negotiateFormat("TEXT/TURTLE");
      expect(format).toBe("text/turtle");
    });
  });

  describe("getContentType", () => {
    it("should return correct content type for text/turtle", () => {
      const contentType = getContentType("text/turtle");
      expect(contentType).toBe("text/turtle");
    });

    it("should return correct content type for application/n-triples", () => {
      const contentType = getContentType("application/n-triples");
      expect(contentType).toBe("application/n-triples");
    });
  });
});
