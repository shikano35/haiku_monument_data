import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "@/domain/vocabularies";
import type { Location, LocationDetail } from "@/types/api";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import { formatToISO8601 } from "@/utils/dateTimeFormatter";

const { namedNode, literal, quad } = DataFactory;

/**
 * Location（場所）データをRDF Triplesに変換
 */
export function convertLocationToRDF(
  location: Location | LocationDetail,
): Quad[] {
  const quads: Quad[] = [];
  const locationUri = `${RESOURCE_BASE.LOCATIONS}${location.id}`;
  const subject = namedNode(locationUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.Place),
    ),
  );
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.GEO.Point),
    ),
  );

  // Basic properties
  if (location.place_name) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.name),
        literal(location.place_name, "ja"),
      ),
    );
  }

  if (location.imi_pref_code) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.IMI.prefectureCode),
        literal(location.imi_pref_code),
      ),
    );
    
    // IMI Prefecture URIへのリンク
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.RDF.type),
        namedNode(`${VOCABULARIES.IMI.PrefectureBase}${location.imi_pref_code}`),
      ),
    );
  }

  if (location.region) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.region),
        literal(location.region, "ja"),
      ),
    );
  }

  if (location.prefecture) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.prefecture),
        literal(location.prefecture, "ja"),
      ),
    );
  }

  if (location.municipality) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.municipality),
        literal(location.municipality, "ja"),
      ),
    );
  }

  if (location.address) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.address),
        literal(location.address, "ja"),
      ),
    );
  }

  // Geographic coordinates
  if (location.latitude != null) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.GEO.lat),
        literal(
          location.latitude.toString(),
          namedNode(VOCABULARIES.XSD.decimal),
        ),
      ),
    );
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.latitude),
        literal(
          location.latitude.toString(),
          namedNode(VOCABULARIES.XSD.decimal),
        ),
      ),
    );
  }

  if (location.longitude != null) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.GEO.long),
        literal(
          location.longitude.toString(),
          namedNode(VOCABULARIES.XSD.decimal),
        ),
      ),
    );
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.longitude),
        literal(
          location.longitude.toString(),
          namedNode(VOCABULARIES.XSD.decimal),
        ),
      ),
    );
  }

  if (location.geohash) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.geohash),
        literal(location.geohash),
      ),
    );
  }

  if (location.accuracy_m != null) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.accuracyM),
        literal(
          location.accuracy_m.toString(),
          namedNode(VOCABULARIES.XSD.decimal),
        ),
      ),
    );
  }

  // Temporal properties (ISO 8601 format with timezone)
  if (location.created_at) {
    const createdAt = formatToISO8601(location.created_at);
    if (createdAt) {
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.DC.created),
          literal(createdAt, namedNode(VOCABULARIES.XSD.dateTime)),
        ),
      );
    }
  }

  if (location.updated_at) {
    const updatedAt = formatToISO8601(location.updated_at);
    if (updatedAt) {
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.DC.modified),
          literal(updatedAt, namedNode(VOCABULARIES.XSD.dateTime)),
        ),
      );
    }
  }

  // LocationDetail specific properties
  if ("monuments" in location && location.monuments) {
    for (const monument of location.monuments) {
      const monumentUri = `${RESOURCE_BASE.MONUMENTS}${monument.id}`;
      quads.push(
        quad(
          namedNode(monumentUri),
          namedNode(VOCABULARIES.SCHEMA.location),
          subject,
        ),
      );
    }
  }

  return quads;
}

/**
 * 複数のLocationをRDF Triplesに変換
 */
export function convertLocationsToRDF(
  locations: Location[] | LocationDetail[],
): Quad[] {
  const quads: Quad[] = [];

  for (const location of locations) {
    quads.push(...convertLocationToRDF(location));
  }

  return quads;
}
