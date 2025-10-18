import { convertMediaToRDF } from "@/domain/converters/MediaConverter";
import { HAIKU_MONUMENT_VOCAB, VOCABULARIES } from "@/domain/vocabularies";
import type { Media } from "@/types/api";
import { describe, expect, it } from "vitest";

describe("MediaConverter", () => {
  const mockMedia: Media = {
    id: 1,
    media_type: "photo",
    url: "https://example.com/images/monument1.jpg",
    iiif_manifest_url: "https://example.com/iiif/manifest.json",
    captured_at: "2025-05-11T16:02:33.000Z",
    photographer: "山田太郎",
    license: "CC BY 4.0",
  };

  it("should convert Media to RDF quads", () => {
    const quads = convertMediaToRDF(mockMedia);
    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI for Media", () => {
    const quads = convertMediaToRDF(mockMedia);
    const mediaUri = `https://rdf.kuhi.jp/media/${mockMedia.id}`;
    const subjectUris = quads.map((q) => q.subject.value);
    expect(subjectUris).toContain(mediaUri);
  });

  it("should include Media type (schema:ImageObject)", () => {
    const quads = convertMediaToRDF(mockMedia);
    const typeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.SCHEMA.ImageObject,
    );
    expect(typeQuad).toBeDefined();
  });

  it("should include media type with language tag", () => {
    const quads = convertMediaToRDF(mockMedia);
    const mediaTypeQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.mediaType &&
        q.object.value === mockMedia.media_type,
    );
    expect(mediaTypeQuad).toBeDefined();
    if ("language" in mediaTypeQuad!.object) {
      expect(mediaTypeQuad!.object.language).toBe("ja");
    }
  });

  it("should include content URL", () => {
    const quads = convertMediaToRDF(mockMedia);
    const urlQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.SCHEMA.contentUrl &&
        q.object.value === mockMedia.url,
    );
    expect(urlQuad).toBeDefined();
  });

  it("should include IIIF manifest URL", () => {
    const quads = convertMediaToRDF(mockMedia);
    const iiifQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.iiifManifestUrl &&
        q.object.value === mockMedia.iiif_manifest_url,
    );
    expect(iiifQuad).toBeDefined();
  });

  it("should declare IIIF Manifest type when manifest URL is provided", () => {
    const quads = convertMediaToRDF(mockMedia);
    const manifestTypeQuad = quads.find(
      (q) =>
        q.subject.value === mockMedia.iiif_manifest_url &&
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.IIIF.Manifest,
    );
    expect(manifestTypeQuad).toBeDefined();
  });

  it("should include captured date with xsd:dateTime", () => {
    const quads = convertMediaToRDF(mockMedia);
    const capturedQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.capturedAt,
    );
    expect(capturedQuad).toBeDefined();
    expect(capturedQuad?.object.value).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    if ("datatype" in capturedQuad!.object) {
      expect(capturedQuad!.object.datatype.value).toBe(
        VOCABULARIES.XSD.dateTime,
      );
    }
  });

  it("should include photographer with language tag", () => {
    const quads = convertMediaToRDF(mockMedia);
    const photographerQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.photographer &&
        q.object.value === mockMedia.photographer,
    );
    expect(photographerQuad).toBeDefined();
    if ("language" in photographerQuad!.object) {
      expect(photographerQuad!.object.language).toBe("ja");
    }
  });

  it("should include license", () => {
    const quads = convertMediaToRDF(mockMedia);
    const licenseQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.license &&
        q.object.value === mockMedia.license,
    );
    expect(licenseQuad).toBeDefined();
  });

  it("should handle Media without optional fields", () => {
    const minimalMedia: Media = {
      id: 2,
      media_type: "photo",
      url: "https://example.com/images/monument2.jpg",
      iiif_manifest_url: null,
      captured_at: null,
      photographer: null,
      license: null,
    };

    const quads = convertMediaToRDF(minimalMedia);
    expect(quads.length).toBeGreaterThan(0);

    const iiifQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.iiifManifestUrl,
    );
    expect(iiifQuad).toBeUndefined();

    const photographerQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.photographer,
    );
    expect(photographerQuad).toBeUndefined();
  });
});
