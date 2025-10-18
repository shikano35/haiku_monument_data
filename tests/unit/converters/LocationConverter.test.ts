import { convertLocationToRDF } from "@/domain/converters/LocationConverter";
import { HAIKU_MONUMENT_VOCAB, VOCABULARIES } from "@/domain/vocabularies";
import type { Location } from "@/types/api";
import { describe, expect, it } from "vitest";

describe("LocationConverter", () => {
  const mockLocation: Location = {
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
  };

  it("should convert Location to RDF quads", () => {
    const quads = convertLocationToRDF(mockLocation);

    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI for Location", () => {
    const quads = convertLocationToRDF(mockLocation);

    const locationUri = `https://rdf.kuhi.jp/locations/${mockLocation.id}`;
    const subjectUris = quads.map((q) => q.subject.value);

    expect(subjectUris).toContain(locationUri);
  });

  it("should include Location type (schema:Place)", () => {
    const quads = convertLocationToRDF(mockLocation);

    const typeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.SCHEMA.Place,
    );

    expect(typeQuad).toBeDefined();
  });

  it("should include place name with language tag", () => {
    const quads = convertLocationToRDF(mockLocation);

    const nameQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.name &&
        q.object.value === mockLocation.place_name,
    );

    expect(nameQuad).toBeDefined();
    if ("language" in nameQuad!.object) {
      expect(nameQuad!.object.language).toBe("ja");
    }
  });

  it("should include region with language tag", () => {
    const quads = convertLocationToRDF(mockLocation);

    const regionQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.region &&
        q.object.value === mockLocation.region,
    );

    expect(regionQuad).toBeDefined();
    if ("language" in regionQuad!.object) {
      expect(regionQuad!.object.language).toBe("ja");
    }
  });

  it("should include prefecture and municipality with language tags", () => {
    const quads = convertLocationToRDF(mockLocation);

    const prefectureQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.prefecture &&
        q.object.value === mockLocation.prefecture,
    );
    expect(prefectureQuad).toBeDefined();
    if ("language" in prefectureQuad!.object) {
      expect(prefectureQuad!.object.language).toBe("ja");
    }

    const municipalityQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.municipality &&
        q.object.value === mockLocation.municipality,
    );
    expect(municipalityQuad).toBeDefined();
    if ("language" in municipalityQuad!.object) {
      expect(municipalityQuad!.object.language).toBe("ja");
    }
  });

  it("should include geographic coordinates with xsd:decimal", () => {
    const quads = convertLocationToRDF(mockLocation);

    const latitudeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.GEO.lat &&
        q.object.value === String(mockLocation.latitude),
    );
    expect(latitudeQuad).toBeDefined();
    if ("datatype" in latitudeQuad!.object) {
      expect(latitudeQuad!.object.datatype.value).toBe(
        VOCABULARIES.XSD.decimal,
      );
    }

    const longitudeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.GEO.long &&
        q.object.value === String(mockLocation.longitude),
    );
    expect(longitudeQuad).toBeDefined();
    if ("datatype" in longitudeQuad!.object) {
      expect(longitudeQuad!.object.datatype.value).toBe(
        VOCABULARIES.XSD.decimal,
      );
    }
  });

  it("should include address with language tag when provided", () => {
    const quads = convertLocationToRDF(mockLocation);

    const addressQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.address &&
        q.object.value === mockLocation.address,
    );

    expect(addressQuad).toBeDefined();
    if ("language" in addressQuad!.object) {
      expect(addressQuad!.object.language).toBe("ja");
    }
  });

  it("should handle Location without address", () => {
    const locationWithoutAddress: Location = {
      ...mockLocation,
      address: null,
    };

    const quads = convertLocationToRDF(locationWithoutAddress);

    const addressQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.SCHEMA.address,
    );

    expect(addressQuad).toBeUndefined();
  });

  it("should handle Location without coordinates", () => {
    const locationWithoutCoords: Location = {
      ...mockLocation,
      latitude: null,
      longitude: null,
    };

    const quads = convertLocationToRDF(locationWithoutCoords);

    const latQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.GEO.lat,
    );
    const longQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.GEO.long,
    );

    expect(latQuad).toBeUndefined();
    expect(longQuad).toBeUndefined();
  });
});
