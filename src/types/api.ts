export interface MonumentBase {
  id: number;
  canonical_name: string;
  canonical_uri?: string;
  monument_type: string | null;
  monument_type_uri: string | null;
  material: string | null;
  material_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inscription {
  id: number;
  side: string;
  original_text: string | null;
  transliteration: string | null;
  reading: string | null;
  language: string;
  notes: string | null;
  poems?: Poem[];
  source?: Source | null;
}

export interface Event {
  id: number;
  event_type: string;
  hu_time_normalized: string | null;
  interval_start: string | null;
  interval_end: string | null;
  uncertainty_note: string | null;
  actor: string | null;
  source?: Source | null;
}

export interface Media {
  id: number;
  media_type: string;
  url: string;
  iiif_manifest_url: string | null;
  captured_at: string | null;
  photographer: string | null;
  license: string | null;
  exif?: Record<string, unknown> | null;
  primary?: boolean;
  order?: number;
}

export interface Location {
  id: number;
  imi_pref_code: string | null;
  region: string | null;
  prefecture: string | null;
  municipality: string | null;
  address?: string | null;
  place_name: string | null;
  latitude: number | null;
  longitude: number | null;
  geohash?: string | null;
  geom_geojson?: string | null;
  accuracy_m?: number | null;
  geojson?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface Poet {
  id: number;
  name: string;
  name_kana: string | null;
  biography: string | null;
  birth_year: number | null;
  death_year: number | null;
  link_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  citation: string;
  author: string | null;
  title: string | null;
  publisher: string | null;
  source_year: number | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonumentDetail extends MonumentBase {
  inscriptions?: Inscription[];
  events?: Event[];
  media?: Media[];
  locations?: Location[];
  poets?: Poet[];
  sources?: Source[];
  original_established_date?: string | null;
  hu_time_normalized?: string | null;
  interval_start?: string | null;
  interval_end?: string | null;
  uncertainty_note?: string | null;
}

export interface MonumentList {
  monuments: MonumentDetail[];
  total: number;
  limit: number;
  offset: number;
}

export interface Poem {
  id: number;
  text: string;
  normalized_text: string;
  text_hash: string;
  kigo: string | null;
  season: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoemDetail extends Poem {
  attributions?: Array<{
    id: number;
    poet: {
      id: number;
      name: string;
      link_url: string | null;
    };
    confidence: string;
    confidence_score: number;
    source: {
      id: number;
      title: string;
      url: string | null;
    } | null;
  }> | null;
  inscriptions?: Array<{
    id: number;
    monument: {
      id: number;
      canonical_name: string;
    };
    side: string;
  }> | null;
}

export interface PoemList {
  poems: Poem[];
  total: number;
  limit: number;
  offset: number;
}

export interface PoetDetail extends Poet {
  monuments?: Array<{
    id: number;
    canonical_name: string;
    monument_type: string | null;
  }>;
}

export interface PoetList {
  poets: Poet[];
  total: number;
  limit: number;
  offset: number;
}

export interface LocationDetail extends Location {
  monuments?: Array<{
    id: number;
    canonical_name: string;
    monument_type: string | null;
  }>;
}

export interface LocationList {
  locations: Location[];
  total: number;
  limit: number;
  offset: number;
}
