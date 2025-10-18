import { describe, it, expect } from "vitest";
import { convertPoetToRDF } from "@/domain/converters/PoetConverter";
import type { Poet } from "@/types/api";
import { VOCABULARIES, HAIKU_MONUMENT_VOCAB } from "@/domain/vocabularies";

describe("PoetConverter", () => {
  const mockPoet: Poet = {
    id: 1,
    name: "松尾芭蕉",
    name_kana: "まつおばしょう",
    biography: "江戸時代の俳人",
    birth_year: 1644,
    death_year: 1694,
    link_url: "https://example.com/basho",
    image_url: "https://example.com/images/basho.jpg",
    created_at: "2025-08-25T18:05:44.000Z",
    updated_at: "2025-08-25T18:05:44.000Z",
  };

  it("should convert Poet to RDF quads", () => {
    const quads = convertPoetToRDF(mockPoet);

    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI for Poet", () => {
    const quads = convertPoetToRDF(mockPoet);

    const poetUri = `https://rdf.kuhi.jp/poets/${mockPoet.id}`;
    const subjectUris = quads.map((q) => q.subject.value);

    expect(subjectUris).toContain(poetUri);
  });

  it("should include Poet type (schema:Person and foaf:Person)", () => {
    const quads = convertPoetToRDF(mockPoet);

    const schemaPersonQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.SCHEMA.Person
    );
    expect(schemaPersonQuad).toBeDefined();

    const foafPersonQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.FOAF.Person
    );
    expect(foafPersonQuad).toBeDefined();
  });

  it("should include poet name with language tag", () => {
    const quads = convertPoetToRDF(mockPoet);

    const nameQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.FOAF.name &&
        q.object.value === mockPoet.name
    );

    expect(nameQuad).toBeDefined();
    if ("language" in nameQuad!.object) {
      expect(nameQuad!.object.language).toBe("ja");
    }
  });

  it("should include name kana with language tag", () => {
    const quads = convertPoetToRDF(mockPoet);

    const nameKanaQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.nameKana &&
        q.object.value === mockPoet.name_kana
    );

    expect(nameKanaQuad).toBeDefined();
    if ("language" in nameKanaQuad!.object) {
      expect(nameKanaQuad!.object.language).toBe("ja");
    }
  });

  it("should include biography when provided", () => {
    const quads = convertPoetToRDF(mockPoet);

    const biographyQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.description &&
        q.object.value === mockPoet.biography
    );

    expect(biographyQuad).toBeDefined();
    if ("language" in biographyQuad!.object) {
      expect(biographyQuad!.object.language).toBe("ja");
    }
  });

  it("should include birth and death years with xsd:integer", () => {
    const quads = convertPoetToRDF(mockPoet);

    const birthYearQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.birthDate &&
        q.object.value === String(mockPoet.birth_year)
    );
    expect(birthYearQuad).toBeDefined();
    if ("datatype" in birthYearQuad!.object) {
      expect(birthYearQuad!.object.datatype.value).toBe(VOCABULARIES.XSD.integer);
    }

    const deathYearQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.deathDate &&
        q.object.value === String(mockPoet.death_year)
    );
    expect(deathYearQuad).toBeDefined();
    if ("datatype" in deathYearQuad!.object) {
      expect(deathYearQuad!.object.datatype.value).toBe(VOCABULARIES.XSD.integer);
    }
  });

  it("should include homepage URL", () => {
    const quads = convertPoetToRDF(mockPoet);

    const homepageQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.FOAF.homepage &&
        q.object.value === mockPoet.link_url
    );

    expect(homepageQuad).toBeDefined();
  });

  it("should include image URL", () => {
    const quads = convertPoetToRDF(mockPoet);

    const depictionQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.FOAF.depiction &&
        q.object.value === mockPoet.image_url
    );

    expect(depictionQuad).toBeDefined();
  });

  it("should handle Poet without optional fields", () => {
    const poetWithoutOptionals: Poet = {
      id: 2,
      name: "小林一茶",
      name_kana: null,
      biography: null,
      birth_year: null,
      death_year: null,
      link_url: null,
      image_url: null,
      created_at: "2025-08-25T18:05:44.000Z",
      updated_at: "2025-08-25T18:05:44.000Z",
    };

    const quads = convertPoetToRDF(poetWithoutOptionals);

    const nameKanaQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.nameKana
    );
    expect(nameKanaQuad).toBeUndefined();

    const biographyQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.SCHEMA.description
    );
    expect(biographyQuad).toBeUndefined();
  });
});
