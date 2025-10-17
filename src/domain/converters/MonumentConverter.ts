import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "@/domain/vocabularies";
import type { MonumentDetail } from "@/types/api";
import type { Quad } from "@rdfjs/types";
import { DataFactory } from "n3";
import { formatToISO8601 } from "@/utils/dateTimeFormatter";

const { namedNode, literal, quad } = DataFactory;

/**
 * Monument（句碑）データをRDF Triplesに変換
 */
export function convertMonumentToRDF(monument: MonumentDetail): Quad[] {
  const quads: Quad[] = [];
  const monumentUri = `${RESOURCE_BASE.MONUMENTS}${monument.id}`;
  const subject = namedNode(monumentUri);

  // Type declarations
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.SCHEMA.LandmarksOrHistoricalBuildings),
    ),
  );
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.RDF.type),
      namedNode(HAIKU_MONUMENT_VOCAB.Monument),
    ),
  );

  // Basic properties
  quads.push(
    quad(
      subject,
      namedNode(VOCABULARIES.SCHEMA.name),
      literal(monument.canonical_name, "ja"),
    ),
  );

  if (monument.canonical_uri) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.url),
        namedNode(monument.canonical_uri),
      ),
    );
  }

  if (monument.monument_type) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.monumentType),
        literal(monument.monument_type, "ja"),
      ),
    );
  }

  if (monument.monument_type_uri) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.monumentTypeUri),
        namedNode(monument.monument_type_uri),
      ),
    );
    
    // Getty AAT URIの場合は、明示的にAAT語彙として参照
    if (monument.monument_type_uri.startsWith("http://vocab.getty.edu/aat/")) {
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.additionalType),
          namedNode(monument.monument_type_uri),
        ),
      );
    }
  }

  if (monument.material) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.SCHEMA.material),
        literal(monument.material, "ja"),
      ),
    );
  }

  if (monument.material_uri) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.materialUri),
        namedNode(monument.material_uri),
      ),
    );
    
    // Getty AAT URIの場合は、明示的にAAT語彙として参照
    if (monument.material_uri.startsWith("http://vocab.getty.edu/aat/")) {
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.material),
          namedNode(monument.material_uri),
        ),
      );
    }
  }

  // Temporal properties (ISO 8601 format with timezone)
  const createdAt = formatToISO8601(monument.created_at);
  if (createdAt) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.DC.created),
        literal(createdAt, namedNode(VOCABULARIES.XSD.dateTime)),
      ),
    );
  }

  const updatedAt = formatToISO8601(monument.updated_at);
  if (updatedAt) {
    quads.push(
      quad(
        subject,
        namedNode(VOCABULARIES.DC.modified),
        literal(updatedAt, namedNode(VOCABULARIES.XSD.dateTime)),
      ),
    );
  }

  if (monument.hu_time_normalized) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.establishedDate),
        literal(monument.hu_time_normalized),
      ),
    );
  }

  if (monument.interval_start) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.intervalStart),
        literal(monument.interval_start),
      ),
    );
  }

  if (monument.interval_end) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.intervalEnd),
        literal(monument.interval_end),
      ),
    );
  }

  if (monument.uncertainty_note) {
    quads.push(
      quad(
        subject,
        namedNode(HAIKU_MONUMENT_VOCAB.uncertaintyNote),
        literal(monument.uncertainty_note, "ja"),
      ),
    );
  }

  // Relations
  if (monument.locations && monument.locations.length > 0) {
    for (const location of monument.locations) {
      const locationUri = `${RESOURCE_BASE.LOCATIONS}${location.id}`;
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.location),
          namedNode(locationUri),
        ),
      );

      // Add coordinates directly to monument if available
      if (location.latitude != null && location.longitude != null) {
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
            namedNode(VOCABULARIES.GEO.long),
            literal(
              location.longitude.toString(),
              namedNode(VOCABULARIES.XSD.decimal),
            ),
          ),
        );

        // schema:GeoCoordinates パターン
        const geoNodeId = `_:geo_${monument.id}`;
        const geoNode = namedNode(geoNodeId);
        
        quads.push(
          quad(
            subject,
            namedNode(VOCABULARIES.SCHEMA.geo),
            geoNode,
          ),
        );
        quads.push(
          quad(
            geoNode,
            namedNode(VOCABULARIES.RDF.type),
            namedNode(VOCABULARIES.SCHEMA.GeoCoordinates),
          ),
        );
        quads.push(
          quad(
            geoNode,
            namedNode(VOCABULARIES.SCHEMA.latitude),
            literal(
              location.latitude.toString(),
              namedNode(VOCABULARIES.XSD.decimal),
            ),
          ),
        );
        quads.push(
          quad(
            geoNode,
            namedNode(VOCABULARIES.SCHEMA.longitude),
            literal(
              location.longitude.toString(),
              namedNode(VOCABULARIES.XSD.decimal),
            ),
          ),
        );
      }
    }
  }

  if (monument.inscriptions && monument.inscriptions.length > 0) {
    for (const inscription of monument.inscriptions) {
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

  if (monument.poets && monument.poets.length > 0) {
    for (const poet of monument.poets) {
      const poetUri = `${RESOURCE_BASE.POETS}${poet.id}`;
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.author),
          namedNode(poetUri),
        ),
      );
    }
  }

  if (monument.media && monument.media.length > 0) {
    for (const media of monument.media) {
      const mediaUri = `${RESOURCE_BASE.MEDIA}${media.id}`;
      quads.push(
        quad(
          subject,
          namedNode(VOCABULARIES.SCHEMA.image),
          namedNode(mediaUri),
        ),
      );
    }
  }

  if (monument.events && monument.events.length > 0) {
    for (const event of monument.events) {
      const eventUri = `${RESOURCE_BASE.EVENTS}${event.id}`;
      quads.push(
        quad(
          subject,
          namedNode(HAIKU_MONUMENT_VOCAB.hasEvent),
          namedNode(eventUri),
        ),
      );
    }
  }

  if (monument.sources && monument.sources.length > 0) {
    for (const source of monument.sources) {
      const sourceUri = `${RESOURCE_BASE.SOURCES}${source.id}`;
      quads.push(
        quad(subject, namedNode(VOCABULARIES.DC.source), namedNode(sourceUri)),
      );
    }
  }

  return quads;
}

/**
 * 複数のMonumentをRDF Triplesに変換
 */
export function convertMonumentsToRDF(monuments: MonumentDetail[]): Quad[] {
  const quads: Quad[] = [];

  for (const monument of monuments) {
    quads.push(...convertMonumentToRDF(monument));
  }

  return quads;
}
