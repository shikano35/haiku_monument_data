import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "@/domain/vocabularies";
import type { Poem, PoemDetail } from "@/types/api";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import { formatToISO8601 } from "@/utils/dateTimeFormatter";

const { namedNode, literal, quad } = DataFactory;

/**
 * Poem（俳句）データをRDF Triplesに変換
 */
export function convertPoemToRDF(poem: Poem | PoemDetail): Quad[] {
  const quads: Quad[] = [];
  const poemUri = `${RESOURCE_BASE.POEMS}${poem.id}`;
  const subject = namedNode(poemUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.CreativeWork),
    ),
  );
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(HAIKU_MONUMENT_VOCAB.Haiku),
    ),
  );

  // Basic properties
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.SCHEMA.text),
      literal(poem.text, "ja"),
    ),
  );

  quads.push(
    quad(
      subject,
      namedNode(HAIKU_MONUMENT_VOCAB.normalizedText),
      literal(poem.normalized_text, "ja"),
    ),
  );

  quads.push(
    quad(
      subject,
      namedNode(HAIKU_MONUMENT_VOCAB.textHash),
      literal(poem.text_hash),
    ),
  );

  quads.push(
    quad(subject, namedNode(VOCABULARIES.SCHEMA.inLanguage), literal("ja")),
  );

  if (poem.kigo) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.kigo),
        literal(poem.kigo, "ja"),
      ),
    );
  }

  if (poem.season) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.season),
        literal(poem.season, "ja"),
      ),
    );
  }

  // Temporal properties (ISO 8601 format with timezone)
  const createdAt = formatToISO8601(poem.created_at);
  if (createdAt) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.DC.created),
        literal(createdAt, namedNode(VOCABULARIES.XSD.dateTime)),
      ),
    );
  }

  const updatedAt = formatToISO8601(poem.updated_at);
  if (updatedAt) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.DC.modified),
        literal(updatedAt, namedNode(VOCABULARIES.XSD.dateTime)),
      ),
    );
  }

  // PoemDetail specific properties
  if ("attributions" in poem && poem.attributions) {
    for (const attribution of poem.attributions) {
      const poetUri = `${RESOURCE_BASE.POETS}${attribution.poet.id}`;
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.author),
          namedNode(poetUri),
        ),
      );
    }
  }

  if ("inscriptions" in poem && poem.inscriptions) {
    for (const inscription of poem.inscriptions) {
      const inscriptionUri = `${RESOURCE_BASE.INSCRIPTIONS}${inscription.id}`;

      quads.push(
        quad(
          subject,
          namedNode(HAIKU_MONUMENT_VOCAB.hasInscription),
          namedNode(inscriptionUri),
        ),
      );
    }
  }

  return quads;
}

/**
 * 複数のPoemをRDF Triplesに変換
 */
export function convertPoemsToRDF(poems: Poem[] | PoemDetail[]): Quad[] {
  const quads: Quad[] = [];

  for (const poem of poems) {
    quads.push(...convertPoemToRDF(poem));
  }

  return quads;
}
