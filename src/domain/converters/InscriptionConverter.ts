import { HAIKU_MONUMENT_VOCAB, RESOURCE_BASE, VOCABULARIES } from "@/domain/vocabularies";
import type { Inscription } from "@/types/api";
import type { Store } from "n3";
import { DataFactory } from "n3";

const { namedNode, literal, quad } = DataFactory;

export interface InscriptionRDF {
  id: number;
  side: string;
  originalText?: string;
  transliteration?: string;
  reading?: string;
  language: string;
  notes?: string;
  poems?: Array<{ id: number }>;
  source?: {
    id: number;
    uri: string;
  };
  uri: string;
}

/**
 * Inscription（碑文）データをRDF Triplesに変換してStoreに追加
 */
export function convertInscriptionToRDF(
  inscription: InscriptionRDF,
  store: Store
): void {
  const subject = namedNode(inscription.uri);

  // Type
  store.addQuad(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(HAIKU_MONUMENT_VOCAB.Inscription)
    )
  );

  // Side (front, back, left, right, etc.)
  store.addQuad(
    quad(
      subject,
      namedNode(HAIKU_MONUMENT_VOCAB.side),
      literal(inscription.side, "en")
    )
  );

  // Original text
  if (inscription.originalText) {
    store.addQuad(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.originalText),
        literal(inscription.originalText, inscription.language || "ja")
      )
    );
  }

  // Transliteration
  if (inscription.transliteration) {
    store.addQuad(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.transliteration),
        literal(inscription.transliteration, inscription.language || "ja")
      )
    );
  }

  // Reading
  if (inscription.reading) {
    store.addQuad(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.reading),
        literal(inscription.reading, inscription.language || "ja")
      )
    );
  }

  // Language
  store.addQuad(
    quad(
      subject,
      namedNode(VOCABULARIES.SCHEMA.inLanguage),
      literal(inscription.language)
    )
  );

  // Notes
  if (inscription.notes) {
    store.addQuad(
      quad(
        subject,
        namedNode(VOCABULARIES.RDFS.comment),
        literal(inscription.notes, inscription.language || "ja")
      )
    );
  }

  // Poems
  if (inscription.poems && inscription.poems.length > 0) {
    for (const poem of inscription.poems) {
      const poemUri = `${RESOURCE_BASE.POEMS}${poem.id}`;
      store.addQuad(
        quad(
          subject,
          namedNode(HAIKU_MONUMENT_VOCAB.hasPoem),
          namedNode(poemUri)
        )
      );
    }
  }

  // Source
  if (inscription.source) {
    store.addQuad(
      quad(
        subject,
        namedNode(VOCABULARIES.DC.source),
        namedNode(inscription.source.uri)
      )
    );
  }
}

/**
 * API型からRDF型への変換ヘルパー
 */
export function inscriptionApiToRDF(inscription: Inscription, _monumentId: number): InscriptionRDF {
  return {
    id: inscription.id,
    side: inscription.side,
    originalText: inscription.original_text ?? undefined,
    transliteration: inscription.transliteration ?? undefined,
    reading: inscription.reading ?? undefined,
    language: inscription.language || "ja",
    notes: inscription.notes ?? undefined,
    poems: inscription.poems?.map(p => ({ id: p.id })),
    source: inscription.source
      ? {
          id: inscription.source.id,
          uri: `${RESOURCE_BASE.SOURCES}${inscription.source.id}`,
        }
      : undefined,
    uri: `${RESOURCE_BASE.INSCRIPTIONS}${inscription.id}`,
  };
}
