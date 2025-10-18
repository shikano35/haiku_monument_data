import { convertEventToRDF } from "@/domain/converters/EventConverter";
import { HAIKU_MONUMENT_VOCAB, VOCABULARIES } from "@/domain/vocabularies";
import type { Event } from "@/types/api";
import { describe, expect, it } from "vitest";

describe("EventConverter", () => {
  const mockEvent: Event = {
    id: 1,
    event_type: "erected",
    hu_time_normalized: "HT:interval/1937-04-01/1937-04-30",
    interval_start: "1937-04-01",
    interval_end: "1937-04-30",
    uncertainty_note: "月は特定だが日不明",
    actor: "小林雨月",
    source: {
      id: 1,
      citation: "三重県庁 『俳句のくに・三重』 三重県庁 2011",
      author: "三重県庁",
      title: "俳句のくに・三重",
      publisher: "三重県庁",
      source_year: 2011,
      url: "https://www.bunka.pref.mie.lg.jp/haiku/",
      created_at: "2025-05-11T15:54:14.000Z",
      updated_at: "2025-05-11T15:54:14.000Z",
    },
  };

  it("should convert Event to RDF quads", () => {
    const quads = convertEventToRDF(mockEvent);
    expect(quads.length).toBeGreaterThan(0);
  });

  it("should use named URI for Event", () => {
    const quads = convertEventToRDF(mockEvent);
    const eventUri = `https://rdf.kuhi.jp/events/${mockEvent.id}`;
    const subjectUris = quads.map((q) => q.subject.value);
    expect(subjectUris).toContain(eventUri);
  });

  it("should include Event type (schema:Event)", () => {
    const quads = convertEventToRDF(mockEvent);
    const typeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.RDF.type &&
        q.object.value === VOCABULARIES.SCHEMA.Event,
    );
    expect(typeQuad).toBeDefined();
  });

  it("should include event type with language tag", () => {
    const quads = convertEventToRDF(mockEvent);
    const eventTypeQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.eventType &&
        q.object.value === mockEvent.event_type,
    );
    expect(eventTypeQuad).toBeDefined();
    if ("language" in eventTypeQuad!.object) {
      expect(eventTypeQuad!.object.language).toBe("ja");
    }
  });

  it("should include HuTime normalized temporal representation", () => {
    const quads = convertEventToRDF(mockEvent);
    const huTimeQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.HUTIME.huTimeNormalized &&
        q.object.value === mockEvent.hu_time_normalized,
    );
    expect(huTimeQuad).toBeDefined();
  });

  it("should include interval start and end with xsd:date", () => {
    const quads = convertEventToRDF(mockEvent);

    const intervalStartQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.HUTIME.intervalStart &&
        q.object.value === mockEvent.interval_start,
    );
    expect(intervalStartQuad).toBeDefined();
    if ("datatype" in intervalStartQuad!.object) {
      expect(intervalStartQuad!.object.datatype.value).toBe(
        VOCABULARIES.XSD.date,
      );
    }

    const intervalEndQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.HUTIME.intervalEnd &&
        q.object.value === mockEvent.interval_end,
    );
    expect(intervalEndQuad).toBeDefined();
    if ("datatype" in intervalEndQuad!.object) {
      expect(intervalEndQuad!.object.datatype.value).toBe(
        VOCABULARIES.XSD.date,
      );
    }
  });

  it("should include uncertainty note with language tag", () => {
    const quads = convertEventToRDF(mockEvent);
    const uncertaintyQuad = quads.find(
      (q) =>
        q.predicate.value === VOCABULARIES.HUTIME.uncertaintyNote &&
        q.object.value === mockEvent.uncertainty_note,
    );
    expect(uncertaintyQuad).toBeDefined();
    if ("language" in uncertaintyQuad!.object) {
      expect(uncertaintyQuad!.object.language).toBe("ja");
    }
  });

  it("should include actor with language tag", () => {
    const quads = convertEventToRDF(mockEvent);
    const actorQuad = quads.find(
      (q) =>
        q.predicate.value === HAIKU_MONUMENT_VOCAB.actor &&
        q.object.value === mockEvent.actor,
    );
    expect(actorQuad).toBeDefined();
    if ("language" in actorQuad!.object) {
      expect(actorQuad!.object.language).toBe("ja");
    }
  });

  it("should reference source when provided", () => {
    const quads = convertEventToRDF(mockEvent);
    const sourceQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.DC.source,
    );
    expect(sourceQuad).toBeDefined();
    expect(sourceQuad?.object.value).toBe(
      `https://rdf.kuhi.jp/sources/${mockEvent.source!.id}`,
    );
  });

  it("should handle Event without optional fields", () => {
    const minimalEvent: Event = {
      id: 2,
      event_type: "renovated",
      hu_time_normalized: null,
      interval_start: null,
      interval_end: null,
      uncertainty_note: null,
      actor: null,
      source: null,
    };

    const quads = convertEventToRDF(minimalEvent);
    expect(quads.length).toBeGreaterThan(0);

    const actorQuad = quads.find(
      (q) => q.predicate.value === HAIKU_MONUMENT_VOCAB.actor,
    );
    expect(actorQuad).toBeUndefined();

    const sourceQuad = quads.find(
      (q) => q.predicate.value === VOCABULARIES.DC.source,
    );
    expect(sourceQuad).toBeUndefined();
  });
});
