/**
 * メディアデータをRDFに変換するコンバーター
 * IIIF Presentation API 3.0対応
 */

import type { Media } from "@/types/api";
import { formatToISO8601 } from "@/utils/dateTimeFormatter";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "../vocabularies";

const { namedNode, literal, quad } = DataFactory;

/**
 * Media（メディア）データをRDF Triplesに変換
 */
export function convertMediaToRDF(media: Media): Quad[] {
  const quads: Quad[] = [];
  const mediaUri = `${RESOURCE_BASE.MEDIA}${media.id}`;
  const subject = namedNode(mediaUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.ImageObject),
    ),
  );

  // Media type
  if (media.media_type) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.mediaType),
        literal(media.media_type, "ja"),
      ),
    );
  }

  // Content URL
  if (media.url) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.contentUrl),
        namedNode(media.url),
      ),
    );
  }

  // IIIF Manifest URL
  if (media.iiif_manifest_url) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.iiifManifestUrl),
        namedNode(media.iiif_manifest_url),
      ),
    );

    // IIIF Manifest type
    quads.push(
      quad(
        namedNode(media.iiif_manifest_url),
        namedNode(VOCABULARIES.RDF.type),
        namedNode(VOCABULARIES.IIIF.Manifest),
      ),
    );
  }

  // Captured date
  if (media.captured_at) {
    const capturedAt = formatToISO8601(media.captured_at);
    if (capturedAt) {
      quads.push(
        quad(
          subject,
          namedNode(HAIKU_MONUMENT_VOCAB.capturedAt),
          literal(capturedAt, namedNode(VOCABULARIES.XSD.dateTime)),
        ),
      );
    }
  }

  // Photographer
  if (media.photographer) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.photographer),
        literal(media.photographer, "ja"),
      ),
    );
  }

  // License
  if (media.license) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.license),
        literal(media.license),
      ),
    );
  }

  return quads;
}

/**
 * 複数のMediaをRDF Triplesに変換
 */
export function convertMediaListToRDF(mediaList: Media[]): Quad[] {
  const quads: Quad[] = [];

  for (const media of mediaList) {
    quads.push(...convertMediaToRDF(media));
  }

  return quads;
}
