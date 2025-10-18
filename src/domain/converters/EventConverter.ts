/**
 * イベントデータをRDFに変換するコンバーター
 * HuTime時間情報の標準化表現を含む
 */

import type { Event } from "@/types/api";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "../vocabularies";

const { namedNode, literal, quad } = DataFactory;

/**
 * Event（イベント）データをRDF Triplesに変換
 */
export function convertEventToRDF(event: Event): Quad[] {
  const quads: Quad[] = [];
  const eventUri = `${RESOURCE_BASE.EVENTS}${event.id}`;
  const subject = namedNode(eventUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.Event),
    ),
  );
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(HAIKU_MONUMENT_VOCAB.Event),
    ),
  );

  // Event type
  if (event.event_type) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.eventType),
        literal(event.event_type, "ja"),
      ),
    );
  }

  // HuTime normalized temporal representation
  if (event.hu_time_normalized) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.HUTIME.huTimeNormalized),
        literal(event.hu_time_normalized),
      ),
    );
  }

  // Interval start and end (xsd:date format)
  if (event.interval_start) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.HUTIME.intervalStart),
        literal(event.interval_start, namedNode(VOCABULARIES.XSD.date)),
      ),
    );
  }

  if (event.interval_end) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.HUTIME.intervalEnd),
        literal(event.interval_end, namedNode(VOCABULARIES.XSD.date)),
      ),
    );
  }

  // Uncertainty note
  if (event.uncertainty_note) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.HUTIME.uncertaintyNote),
        literal(event.uncertainty_note, "ja"),
      ),
    );
  }

  // Actor
  if (event.actor) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.actor),
        literal(event.actor, "ja"),
      ),
    );
  }

  // Source reference
  if (event.source) {
    const sourceUri = `${RESOURCE_BASE.SOURCES}${event.source.id}`;
    quads.push(
      quad(subject, namedNode(VOCABULARIES.DC.source), namedNode(sourceUri)),
    );
  }

  return quads;
}

/**
 * 複数のEventをRDF Triplesに変換
 */
export function convertEventsToRDF(events: Event[]): Quad[] {
  const quads: Quad[] = [];

  for (const event of events) {
    quads.push(...convertEventToRDF(event));
  }

  return quads;
}
