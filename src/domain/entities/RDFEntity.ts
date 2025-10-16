/**
 * RDFエンティティの基底インターフェース
 */
export interface RDFEntity {
  uri: string;
}

/**
 * Monument（句碑）のRDFエンティティ
 */
export interface MonumentRDFEntity extends RDFEntity {
  id: number;
  name: string;
  canonicalUri?: string;
  monumentType?: string;
  monumentTypeUri?: string;
  material?: string;
  materialUri?: string;
  createdAt: Date;
  updatedAt: Date;
  inscriptions?: InscriptionRDFEntity[];
  events?: EventRDFEntity[];
  media?: MediaRDFEntity[];
  locations?: LocationRDFEntity[];
  poets?: PoetRDFEntity[];
  sources?: SourceRDFEntity[];
  originalEstablishedDate?: string;
  huTimeNormalized?: string;
  intervalStart?: string;
  intervalEnd?: string;
  uncertaintyNote?: string;
}

/**
 * Inscription（碑文）のRDFエンティティ
 */
export interface InscriptionRDFEntity extends RDFEntity {
  id: number;
  side: string;
  originalText?: string;
  transliteration?: string;
  reading?: string;
  language: string;
  notes?: string;
  poems?: PoemRDFEntity[];
  source?: SourceRDFEntity;
}

/**
 * Poem（俳句）のRDFエンティティ
 */
export interface PoemRDFEntity extends RDFEntity {
  id: number;
  text: string;
  normalizedText: string;
  textHash: string;
  kigo?: string;
  season?: string;
  createdAt: Date;
  updatedAt: Date;
  attributions?: Array<{
    id: number;
    poet: {
      id: number;
      name: string;
      uri: string;
    };
    confidence: string;
    confidenceScore: number;
    source?: {
      id: number;
      title: string;
      uri: string;
    };
  }>;
  inscriptions?: Array<{
    id: number;
    uri: string;
    monument: {
      id: number;
      name: string;
      uri: string;
    };
    side: string;
  }>;
}

/**
 * Poet（俳人）のRDFエンティティ
 */
export interface PoetRDFEntity extends RDFEntity {
  id: number;
  name: string;
  nameKana?: string;
  biography?: string;
  birthYear?: number;
  deathYear?: number;
  linkUrl?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  monuments?: Array<{
    id: number;
    name: string;
    uri: string;
    monumentType?: string;
  }>;
}

/**
 * Location（場所）のRDFエンティティ
 */
export interface LocationRDFEntity extends RDFEntity {
  id: number;
  imiPrefCode?: string;
  region?: string;
  prefecture?: string;
  municipality?: string;
  address?: string;
  placeName?: string;
  latitude?: number;
  longitude?: number;
  geohash?: string;
  geomGeojson?: string;
  accuracyM?: number;
  createdAt?: Date;
  updatedAt?: Date;
  monuments?: Array<{
    id: number;
    name: string;
    uri: string;
    monumentType?: string;
  }>;
}

/**
 * Event（出来事）のRDFエンティティ
 */
export interface EventRDFEntity extends RDFEntity {
  id: number;
  eventType: string;
  huTimeNormalized?: string;
  intervalStart?: string;
  intervalEnd?: string;
  uncertaintyNote?: string;
  actor?: string;
  source?: SourceRDFEntity;
}

/**
 * Media（メディア）のRDFエンティティ
 */
export interface MediaRDFEntity extends RDFEntity {
  id: number;
  mediaType: string;
  url: string;
  iiifManifestUrl?: string;
  capturedAt?: string;
  photographer?: string;
  license?: string;
  exif?: Record<string, unknown>;
  primary?: boolean;
  order?: number;
}

/**
 * Source（出典）のRDFエンティティ
 */
export interface SourceRDFEntity extends RDFEntity {
  id: number;
  citation: string;
  author?: string;
  title?: string;
  publisher?: string;
  sourceYear?: number;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}
