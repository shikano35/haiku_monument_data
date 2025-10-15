/**
 * RDF語彙・オントロジーの定義
 * 句碑データのRDF表現で使用する語彙の名前空間とURI
 */

/**
 * 標準語彙
 */
export const VOCABULARIES = {
  // Schema.org - 汎用的なメタデータ
  SCHEMA: "http://schema.org/",

  // Dublin Core Terms - 文書メタデータ
  DC: "http://purl.org/dc/terms/",

  // Friend of a Friend - 人物・団体情報
  FOAF: "http://xmlns.com/foaf/0.1/",

  // WGS84 Geo Positioning - 地理座標
  GEO: "http://www.w3.org/2003/01/geo/wgs84_pos#",

  // RDF/RDFS/OWL - RDF基本語彙
  RDF: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  RDFS: "http://www.w3.org/2000/01/rdf-schema#",
  OWL: "http://www.w3.org/2002/07/owl#",

  // XSD - XMLスキーマデータ型
  XSD: "http://www.w3.org/2001/XMLSchema#",
} as const;

/**
 * 句碑カスタム語彙
 * プロジェクト固有の概念を表現するための語彙
 */
export const HAIKU_MONUMENT_VOCAB = {
  // 基本名前空間
  BASE: "https://rdf.kuhi.jp/vocab#",

  // クラス
  MONUMENT: "https://rdf.kuhi.jp/vocab#Monument",
  HAIKU: "https://rdf.kuhi.jp/vocab#Haiku",
  INSCRIPTION: "https://rdf.kuhi.jp/vocab#Inscription",

  // プロパティ
  HAS_POEM: "https://rdf.kuhi.jp/vocab#hasPoem",
  HAS_INSCRIPTION: "https://rdf.kuhi.jp/vocab#hasInscription",
  HAS_POET: "https://rdf.kuhi.jp/vocab#hasPoet",
  LOCATION: "https://rdf.kuhi.jp/vocab#location",
  ERECTED_DATE: "https://rdf.kuhi.jp/vocab#erectedDate",
  MATERIAL: "https://rdf.kuhi.jp/vocab#material",
  SIZE: "https://rdf.kuhi.jp/vocab#size",
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
@prefix schema: <${VOCABULARIES.SCHEMA}> .
@prefix dc: <${VOCABULARIES.DC}> .
@prefix foaf: <${VOCABULARIES.FOAF}> .
@prefix geo: <${VOCABULARIES.GEO}> .
@prefix rdf: <${VOCABULARIES.RDF}> .
@prefix rdfs: <${VOCABULARIES.RDFS}> .
@prefix owl: <${VOCABULARIES.OWL}> .
@prefix xsd: <${VOCABULARIES.XSD}> .
@prefix hm: <${HAIKU_MONUMENT_VOCAB.BASE}> .
`.trim();
