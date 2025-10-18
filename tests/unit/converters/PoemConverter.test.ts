import { convertPoemToRDF } from "@/domain/converters/PoemConverter";
import { HAIKU_MONUMENT_VOCAB, VOCABULARIES } from "@/domain/vocabularies";
import type { Poem } from "@/types/api";
import { describe, expect, it } from "vitest";

describe("PoemConverter", () => {
  const mockPoem: Poem = {
    id: 1,
    text: "古池や蛙飛び込む水の音",
    normalized_text: "ふるいけやかわずとびこむみずのおと",
    text_hash: "abc123def456",
    kigo: "蛙",
    season: "春",
    created_at: "2025-08-25T18:05:44.000Z",
    updated_at: "2025-08-25T18:05:44.000Z",
  };

  it("should convert Poem to RDF quads", () => {
    const quads = convertPoemToRDF(mockPoem);

    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI for Poem", () => {
    const quads = convertPoemToRDF(mockPoem);

    const poemUri = `https://rdf.kuhi.jp/poems/${mockPoem.id}`;
    const subjectUris = quads.map((q) => q.subject.value);

    expect(subjectUris).toContain(poemUri);
  });

  it("should include Poem type (schema:CreativeWork and hm:Haiku)", () => {
    const quads = convertPoemToRDF(mockPoem);

    const creativeWorkQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.SCHEMA.CreativeWork,
    );
    expect(creativeWorkQuad).toBeDefined();

    const haikuQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === HAIKU_MONUMENT_VOCAB.Haiku,
    );
    expect(haikuQuad).toBeDefined();
  });

  it("should include text with language tag", () => {
    const quads = convertPoemToRDF(mockPoem);

    const textQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.text &&
        q.object.value === mockPoem.text,
    );

    expect(textQuad).toBeDefined();
    if ("language" in textQuad!.object) {
      expect(textQuad!.object.language).toBe("ja");
    }
  });

  it("should include normalized text with language tag", () => {
    const quads = convertPoemToRDF(mockPoem);

    const normalizedTextQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.normalizedText &&
        q.object.value === mockPoem.normalized_text,
    );

    expect(normalizedTextQuad).toBeDefined();
    if ("language" in normalizedTextQuad!.object) {
      expect(normalizedTextQuad!.object.language).toBe("ja");
    }
  });

  it("should include text hash", () => {
    const quads = convertPoemToRDF(mockPoem);

    const textHashQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.textHash &&
        q.object.value === mockPoem.text_hash,
    );

    expect(textHashQuad).toBeDefined();
  });

  it("should include language as 'ja'", () => {
    const quads = convertPoemToRDF(mockPoem);

    const languageQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.inLanguage &&
        q.object.value === "ja",
    );

    expect(languageQuad).toBeDefined();
  });

  it("should include kigo when provided", () => {
    const quads = convertPoemToRDF(mockPoem);

    const kigoQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.kigo &&
        q.object.value === mockPoem.kigo,
    );

    expect(kigoQuad).toBeDefined();
    if ("language" in kigoQuad!.object) {
      expect(kigoQuad!.object.language).toBe("ja");
    }
  });

  it("should include season when provided", () => {
    const quads = convertPoemToRDF(mockPoem);

    const seasonQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.season &&
        q.object.value === mockPoem.season,
    );

    expect(seasonQuad).toBeDefined();
    if ("language" in seasonQuad!.object) {
      expect(seasonQuad!.object.language).toBe("ja");
    }
  });

  it("should handle Poem without kigo and season", () => {
    const poemWithoutOptionals: Poem = {
      id: 2,
      text: "夏草や兵どもが夢の跡",
      normalized_text: "なつくさやつわものどもがゆめのあと",
      text_hash: "def789ghi012",
      kigo: null,
      season: null,
      created_at: "2025-08-25T18:05:44.000Z",
      updated_at: "2025-08-25T18:05:44.000Z",
    };

    const quads = convertPoemToRDF(poemWithoutOptionals);

    const kigoQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.kigo,
    );
    expect(kigoQuad).toBeUndefined();

    const seasonQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.season,
    );
    expect(seasonQuad).toBeUndefined();
  });
});
