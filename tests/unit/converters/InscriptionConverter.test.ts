import { describe, it, expect } from "vitest";
import { convertInscriptionToRDF, inscriptionApiToRDF } from "@/domain/converters/InscriptionConverter";
import type { Inscription } from "@/types/api";
import { Store } from "n3";

describe("InscriptionConverter", () => {
  const mockInscription: Inscription = {
    id: 1,
    side: "front",
    original_text: "古池や蛙飛び込む水の音",
    transliteration: "ふるいけやかわずとびこむみずのおと",
    reading: "ふるいけや かわずとびこむ みずのおと",
    language: "ja",
    notes: "有名な句",
    poems: [
      {
        id: 1,
        text: "古池や蛙飛び込む水の音",
        normalized_text: "古池や蛙飛び込む水の音",
        text_hash: "test123",
        kigo: "蛙",
        season: "春",
        created_at: "2025-05-11T16:02:33.000Z",
        updated_at: "2025-05-11T16:02:33.000Z",
      },
    ],
    source: {
      id: 1,
      citation: "テスト出典",
      author: "テスト著者",
      title: "テストタイトル",
      publisher: "テスト出版社",
      source_year: 2025,
      url: "https://example.com",
      created_at: "2025-05-11T15:54:14.000Z",
      updated_at: "2025-05-11T15:54:14.000Z",
    },
  };

  it("should convert Inscription to RDF and add to Store", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const quads = store.getQuads(null, null, null, null);
    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI instead of blank node", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const inscriptionUri = "https://rdf.kuhi.jp/inscriptions/1";
    const quads = store.getQuads(null, null, null, null);
    
    const hasNamedSubject = quads.some(
      (quad) => quad.subject.value === inscriptionUri
    );
    expect(hasNamedSubject).toBe(true);
  });

  it("should include Inscription type", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const typeQuad = store.getQuads(null, null, null, null).find(
      (quad) =>
        quad.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
        quad.object.value === "https://rdf.kuhi.jp/vocab#Inscription"
    );
    expect(typeQuad).toBeDefined();
  });

  it("should include side property", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const sideQuad = store.getQuads(null, null, null, null).find(
      (quad) =>
        quad.predicate.value === "https://rdf.kuhi.jp/vocab#side" &&
        quad.object.value === "front"
    );
    expect(sideQuad).toBeDefined();
  });

  it("should include originalText with language tag", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const textQuad = store.getQuads(null, null, null, null).find(
      (quad) =>
        quad.predicate.value === "https://rdf.kuhi.jp/vocab#originalText" &&
        quad.object.value === "古池や蛙飛び込む水の音"
    );
    expect(textQuad).toBeDefined();
  });

  it("should reference Poem with named URI", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const poemRef = store.getQuads(null, null, null, null).find(
      (quad) => quad.predicate.value === "https://rdf.kuhi.jp/vocab#hasPoem"
    );
    expect(poemRef).toBeDefined();
    expect(poemRef?.object.value).toBe("https://rdf.kuhi.jp/poems/1");
  });

  it("should reference Source when provided", () => {
    const rdfInscription = inscriptionApiToRDF(mockInscription, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const sourceRef = store.getQuads(null, null, null, null).find(
      (quad) => quad.predicate.value === "http://purl.org/dc/terms/source"
    );
    expect(sourceRef).toBeDefined();
    expect(sourceRef?.object.value).toBe("https://rdf.kuhi.jp/sources/1");
  });

  it("should handle optional transliteration", () => {
    const inscriptionWithoutTranslit = { ...mockInscription, transliteration: null };
    const rdfInscription = inscriptionApiToRDF(inscriptionWithoutTranslit, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const translitQuad = store.getQuads(null, null, null, null).find(
      (quad) => quad.predicate.value === "https://rdf.kuhi.jp/vocab#transliteration"
    );
    expect(translitQuad).toBeUndefined();
  });

  it("should handle optional reading", () => {
    const inscriptionWithoutReading = { ...mockInscription, reading: null };
    const rdfInscription = inscriptionApiToRDF(inscriptionWithoutReading, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const readingQuad = store.getQuads(null, null, null, null).find(
      (quad) => quad.predicate.value === "https://rdf.kuhi.jp/vocab#reading"
    );
    expect(readingQuad).toBeUndefined();
  });

  it("should handle inscription without source", () => {
    const inscriptionWithoutSource = { ...mockInscription, source: null };
    const rdfInscription = inscriptionApiToRDF(inscriptionWithoutSource, 1);
    const store = new Store();
    
    convertInscriptionToRDF(rdfInscription, store);
    
    const sourceRef = store.getQuads(null, null, null, null).find(
      (quad) => quad.predicate.value === "http://purl.org/dc/terms/source"
    );
    expect(sourceRef).toBeUndefined();
  });
});
