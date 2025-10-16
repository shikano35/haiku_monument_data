import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "@/domain/vocabularies";
import type { Poet, PoetDetail } from "@/types/api";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";

const { namedNode, literal, quad } = DataFactory;

/**
 * Poet（俳人）データをRDF Triplesに変換
 */
export function convertPoetToRDF(poet: Poet | PoetDetail): Quad[] {
  const quads: Quad[] = [];
  const poetUri = `${RESOURCE_BASE.POETS}${poet.id}`;
  const subject = namedNode(poetUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.Person),
    ),
  );
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.FOAF.Person),
    ),
  );

  // Basic properties
  quads.push(
    quad(subject, namedNode(VOCABULARIES.FOAF.name), literal(poet.name, "ja")),
  );

  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.SCHEMA.name),
      literal(poet.name, "ja"),
    ),
  );

  if (poet.name_kana) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.nameKana),
        literal(poet.name_kana, "ja"),
      ),
    );
  }

  if (poet.biography) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.description),
        literal(poet.biography, "ja"),
      ),
    );
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.biography),
        literal(poet.biography, "ja"),
      ),
    );
  }

  if (poet.birth_year) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.birthDate),
        literal(
          poet.birth_year.toString(),
          namedNode(VOCABULARIES.XSD.integer),
        ),
      ),
    );
  }

  if (poet.death_year) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.deathDate),
        literal(
          poet.death_year.toString(),
          namedNode(VOCABULARIES.XSD.integer),
        ),
      ),
    );
  }

  if (poet.link_url) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.FOAF.homepage),
        namedNode(poet.link_url),
      ),
    );
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.url),
        namedNode(poet.link_url),
      ),
    );
  }

  if (poet.image_url) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.FOAF.depiction),
        namedNode(poet.image_url),
      ),
    );
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.image),
        namedNode(poet.image_url),
      ),
    );
  }

  // Temporal properties
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.DC.created),
      literal(poet.created_at, namedNode(VOCABULARIES.XSD.dateTime)),
    ),
  );

  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.DC.modified),
      literal(poet.updated_at, namedNode(VOCABULARIES.XSD.dateTime)),
    ),
  );

  // PoetDetail specific properties
  if ("monuments" in poet && poet.monuments) {
    for (const monument of poet.monuments) {
      const monumentUri = `${RESOURCE_BASE.MONUMENTS}${monument.id}`;
      quads.push(
        quad(
          namedNode(monumentUri),
          namedNode(VOCABULARIES.SCHEMA.author),
          subject,
        ),
      );
    }
  }

  return quads;
}

/**
 * 複数のPoetをRDF Triplesに変換
 */
export function convertPoetsToRDF(poets: Poet[] | PoetDetail[]): Quad[] {
  const quads: Quad[] = [];

  for (const poet of poets) {
    quads.push(...convertPoetToRDF(poet));
  }

  return quads;
}
