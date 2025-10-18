import { describe, it, expect } from "vitest";
import { convertMonumentToRDF } from "@/domain/converters/MonumentConverter";
import type { MonumentDetail } from "@/types/api";

describe("MonumentConverter", () => {
  const mockMonument: MonumentDetail = {
    id: 1,
    canonical_name: "テスト句碑",
    canonical_uri: "https://api.kuhi.jp/monuments/1",
    monument_type: "句碑",
    monument_type_uri: null,
    material: null,
    material_uri: null,
    created_at: "2025-05-11T16:02:33.000Z",
    updated_at: "2025-05-11T16:02:33.000Z",
    inscriptions: [
      {
        id: 1,
        side: "front",
        original_text: "古池や蛙飛び込む水の音",
        transliteration: null,
        reading: null,
        language: "ja",
        notes: "テスト注記",
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
        source: null,
      },
    ],
    events: [],
    media: [],
    locations: [
      {
        id: 1,
        imi_pref_code: null,
        region: "東海",
        prefecture: "三重県",
        municipality: "桑名市",
        address: "桑名市北寺町47",
        place_name: "本統寺",
        latitude: 35.065502,
        longitude: 136.692193,
        geohash: null,
        geom_geojson: null,
        accuracy_m: null,
        created_at: "2025-08-25T18:05:44.000Z",
        updated_at: "2025-08-25T18:05:44.000Z",
      },
    ],
    poets: [
      {
        id: 1,
        name: "松尾芭蕉",
        name_kana: null,
        biography: "日本史上最高の俳諧師の一人",
        birth_year: null,
        death_year: null,
        link_url: "https://ja.wikipedia.org/wiki/松尾芭蕉",
        image_url: null,
        created_at: "2025-05-11T15:56:40.000Z",
        updated_at: "2025-05-11T15:56:40.000Z",
      },
    ],
    sources: [],
    original_established_date: null,
    hu_time_normalized: null,
    interval_start: null,
    interval_end: null,
    uncertainty_note: null,
  };

  it("should convert Monument to RDF quads", () => {
    const quads = convertMonumentToRDF(mockMonument);
    expect(quads.length).toBeGreaterThan(0);
  });

  it("should have correct Monument URI", () => {
    const quads = convertMonumentToRDF(mockMonument);
    const monumentUri = "https://rdf.kuhi.jp/monuments/1";
    
    const hasMonumentSubject = quads.some(
      (quad) => quad.subject.value === monumentUri
    );
    expect(hasMonumentSubject).toBe(true);
  });

  it("should include Monument type", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const hasMonumentType = quads.some(
      (quad) =>
        quad.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" &&
        quad.object.value === "http://schema.org/LandmarksOrHistoricalBuildings"
    );
    expect(hasMonumentType).toBe(true);
  });

  it("should include monument name with language tag", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const nameQuad = quads.find(
      (quad) =>
        quad.predicate.value === "http://schema.org/name" &&
        quad.object.value === "テスト句碑"
    );
    expect(nameQuad).toBeDefined();
    // Literal型の場合にlanguageプロパティが存在
    if (nameQuad && 'language' in nameQuad.object) {
      expect(nameQuad.object.language).toBe("ja");
    }
  });

  it("should reference Inscription with named URI", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const inscriptionRef = quads.find(
      (quad) =>
        quad.predicate.value === "https://rdf.kuhi.jp/vocab#hasInscription"
    );
    expect(inscriptionRef).toBeDefined();
    expect(inscriptionRef?.object.value).toBe("https://rdf.kuhi.jp/inscriptions/1");
  });

  it("should include DateTime in ISO 8601 format", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const createdQuad = quads.find(
      (quad) => quad.predicate.value === "http://purl.org/dc/terms/created"
    );
    expect(createdQuad).toBeDefined();
    expect(createdQuad?.object.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    if (createdQuad && 'datatype' in createdQuad.object) {
      expect(createdQuad.object.datatype?.value).toBe("http://www.w3.org/2001/XMLSchema#dateTime");
    }
  });

  it("should reference Location", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const locationRef = quads.find(
      (quad) => quad.predicate.value === "http://schema.org/location"
    );
    expect(locationRef).toBeDefined();
    expect(locationRef?.object.value).toBe("https://rdf.kuhi.jp/locations/1");
  });

  it("should include GeoCoordinates with xsd:decimal", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const latQuad = quads.find(
      (quad) => quad.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#lat"
    );
    expect(latQuad).toBeDefined();
    if (latQuad && 'datatype' in latQuad.object) {
      expect(latQuad.object.datatype?.value).toBe("http://www.w3.org/2001/XMLSchema#decimal");
    }
  });

  it("should reference Poet", () => {
    const quads = convertMonumentToRDF(mockMonument);
    
    const poetRef = quads.find(
      (quad) => quad.predicate.value === "http://schema.org/author"
    );
    expect(poetRef).toBeDefined();
    expect(poetRef?.object.value).toBe("https://rdf.kuhi.jp/poets/1");
  });

  it("should handle empty inscriptions array", () => {
    const monumentWithoutInscriptions = { ...mockMonument, inscriptions: [] };
    const quads = convertMonumentToRDF(monumentWithoutInscriptions);
    
    const hasInscription = quads.some(
      (quad) => quad.predicate.value === "https://rdf.kuhi.jp/vocab#hasInscription"
    );
    expect(hasInscription).toBe(false);
  });

  it("should handle multiple locations", () => {
    const monumentWithMultipleLocations = {
      ...mockMonument,
      locations: [
        mockMonument.locations![0],
        {
          ...mockMonument.locations![0],
          id: 2,
          place_name: "別の場所",
        },
      ],
    };
    const quads = convertMonumentToRDF(monumentWithMultipleLocations);
    
    const locationRefs = quads.filter(
      (quad) => quad.predicate.value === "http://schema.org/location"
    );
    expect(locationRefs.length).toBe(2);
  });
});
