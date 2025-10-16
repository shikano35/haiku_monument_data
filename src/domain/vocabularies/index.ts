/**
 * RDF語彙・オントロジーの定義
 * 句碑データのRDF表現で使用する語彙の名前空間とURI
 */

/**
 * 標準語彙
 */
export const VOCABULARIES = {
  // Schema.org - 汎用的なメタデータ
  SCHEMA: {
    BASE: "http://schema.org/",
    Monument: "http://schema.org/Monument",
    Place: "http://schema.org/Place",
    Person: "http://schema.org/Person",
    CreativeWork: "http://schema.org/CreativeWork",
    name: "http://schema.org/name",
    url: "http://schema.org/url",
    author: "http://schema.org/author",
    location: "http://schema.org/location",
    image: "http://schema.org/image",
    material: "http://schema.org/material",
    text: "http://schema.org/text",
    inLanguage: "http://schema.org/inLanguage",
    birthDate: "http://schema.org/birthDate",
    deathDate: "http://schema.org/deathDate",
    description: "http://schema.org/description",
    latitude: "http://schema.org/latitude",
    longitude: "http://schema.org/longitude",
    address: "http://schema.org/address",
  },

  // Dublin Core Terms - 文書メタデータ
  DC: {
    BASE: "http://purl.org/dc/terms/",
    created: "http://purl.org/dc/terms/created",
    modified: "http://purl.org/dc/terms/modified",
    source: "http://purl.org/dc/terms/source",
    title: "http://purl.org/dc/terms/title",
    creator: "http://purl.org/dc/terms/creator",
    publisher: "http://purl.org/dc/terms/publisher",
    identifier: "http://purl.org/dc/terms/identifier",
  },

  // Friend of a Friend - 人物・団体情報
  FOAF: {
    BASE: "http://xmlns.com/foaf/0.1/",
    Person: "http://xmlns.com/foaf/0.1/Person",
    name: "http://xmlns.com/foaf/0.1/name",
    depiction: "http://xmlns.com/foaf/0.1/depiction",
    homepage: "http://xmlns.com/foaf/0.1/homepage",
  },

  // WGS84 Geo Positioning - 地理座標
  GEO: {
    BASE: "http://www.w3.org/2003/01/geo/wgs84_pos#",
    Point: "http://www.w3.org/2003/01/geo/wgs84_pos#Point",
    lat: "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
    long: "http://www.w3.org/2003/01/geo/wgs84_pos#long",
  },

  // RDF/RDFS/OWL - RDF基本語彙
  RDF: {
    BASE: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  },
  RDFS: {
    BASE: "http://www.w3.org/2000/01/rdf-schema#",
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    comment: "http://www.w3.org/2000/01/rdf-schema#comment",
  },
  OWL: {
    BASE: "http://www.w3.org/2002/07/owl#",
    sameAs: "http://www.w3.org/2002/07/owl#sameAs",
  },

  // XSD - XMLスキーマデータ型
  XSD: {
    BASE: "http://www.w3.org/2001/XMLSchema#",
    string: "http://www.w3.org/2001/XMLSchema#string",
    integer: "http://www.w3.org/2001/XMLSchema#integer",
    decimal: "http://www.w3.org/2001/XMLSchema#decimal",
    dateTime: "http://www.w3.org/2001/XMLSchema#dateTime",
    date: "http://www.w3.org/2001/XMLSchema#date",
    boolean: "http://www.w3.org/2001/XMLSchema#boolean",
  },
} as const;

/**
 * 句碑カスタム語彙
 * プロジェクト固有の概念を表現するための語彙
 */
export const HAIKU_MONUMENT_VOCAB = {
  // 基本名前空間
  BASE: "https://rdf.kuhi.jp/vocab#",

  // クラス
  Monument: "https://rdf.kuhi.jp/vocab#Monument",
  Haiku: "https://rdf.kuhi.jp/vocab#Haiku",
  Inscription: "https://rdf.kuhi.jp/vocab#Inscription",
  Event: "https://rdf.kuhi.jp/vocab#Event",

  // プロパティ - Monument関連
  hasPoem: "https://rdf.kuhi.jp/vocab#hasPoem",
  hasInscription: "https://rdf.kuhi.jp/vocab#hasInscription",
  hasEvent: "https://rdf.kuhi.jp/vocab#hasEvent",
  monumentType: "https://rdf.kuhi.jp/vocab#monumentType",
  monumentTypeUri: "https://rdf.kuhi.jp/vocab#monumentTypeUri",
  materialUri: "https://rdf.kuhi.jp/vocab#materialUri",
  establishedDate: "https://rdf.kuhi.jp/vocab#establishedDate",
  intervalStart: "https://rdf.kuhi.jp/vocab#intervalStart",
  intervalEnd: "https://rdf.kuhi.jp/vocab#intervalEnd",
  uncertaintyNote: "https://rdf.kuhi.jp/vocab#uncertaintyNote",

  // プロパティ - Poem関連
  normalizedText: "https://rdf.kuhi.jp/vocab#normalizedText",
  textHash: "https://rdf.kuhi.jp/vocab#textHash",
  kigo: "https://rdf.kuhi.jp/vocab#kigo",
  season: "https://rdf.kuhi.jp/vocab#season",

  // プロパティ - Inscription関連
  side: "https://rdf.kuhi.jp/vocab#side",
  originalText: "https://rdf.kuhi.jp/vocab#originalText",
  transliteration: "https://rdf.kuhi.jp/vocab#transliteration",
  reading: "https://rdf.kuhi.jp/vocab#reading",

  // プロパティ - Poet関連
  nameKana: "https://rdf.kuhi.jp/vocab#nameKana",
  biography: "https://rdf.kuhi.jp/vocab#biography",

  // プロパティ - Location関連
  imiPrefCode: "https://rdf.kuhi.jp/vocab#imiPrefCode",
  region: "https://rdf.kuhi.jp/vocab#region",
  prefecture: "https://rdf.kuhi.jp/vocab#prefecture",
  municipality: "https://rdf.kuhi.jp/vocab#municipality",
  placeName: "https://rdf.kuhi.jp/vocab#placeName",
  geohash: "https://rdf.kuhi.jp/vocab#geohash",
  accuracyM: "https://rdf.kuhi.jp/vocab#accuracyM",

  // プロパティ - Event関連
  eventType: "https://rdf.kuhi.jp/vocab#eventType",
  actor: "https://rdf.kuhi.jp/vocab#actor",

  // プロパティ - Media関連
  mediaType: "https://rdf.kuhi.jp/vocab#mediaType",
  iiifManifestUrl: "https://rdf.kuhi.jp/vocab#iiifManifestUrl",
  capturedAt: "https://rdf.kuhi.jp/vocab#capturedAt",
  photographer: "https://rdf.kuhi.jp/vocab#photographer",
  license: "https://rdf.kuhi.jp/vocab#license",
} as const;

/**
 * リソースURI生成のためのベースURL
 */
export const RESOURCE_BASE = {
  MONUMENTS: "https://rdf.kuhi.jp/monuments/",
  POEMS: "https://rdf.kuhi.jp/poems/",
  POETS: "https://rdf.kuhi.jp/poets/",
  LOCATIONS: "https://rdf.kuhi.jp/locations/",
  INSCRIPTIONS: "https://rdf.kuhi.jp/inscriptions/",
  SOURCES: "https://rdf.kuhi.jp/sources/",
  EVENTS: "https://rdf.kuhi.jp/events/",
  MEDIA: "https://rdf.kuhi.jp/media/",
} as const;

/**
 * Turtleフォーマット用のプレフィックス定義
 */
export const TURTLE_PREFIXES = `
@prefix schema: <${VOCABULARIES.SCHEMA.BASE}> .
@prefix dc: <${VOCABULARIES.DC.BASE}> .
@prefix foaf: <${VOCABULARIES.FOAF.BASE}> .
@prefix geo: <${VOCABULARIES.GEO.BASE}> .
@prefix rdf: <${VOCABULARIES.RDF.BASE}> .
@prefix rdfs: <${VOCABULARIES.RDFS.BASE}> .
@prefix owl: <${VOCABULARIES.OWL.BASE}> .
@prefix xsd: <${VOCABULARIES.XSD.BASE}> .
@prefix hm: <${HAIKU_MONUMENT_VOCAB.BASE}> .
`.trim();
