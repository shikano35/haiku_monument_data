/**
 * RDF関連の型定義
 */

/**
 * RDFシリアライゼーションフォーマット
 */
export type RDFFormat =
  | "text/turtle"
  | "application/n-triples"
  | "application/ld+json"
  | "application/rdf+xml";

/**
 * Content Negotiation用のフォーマットマッピング
 */
export const MIME_TO_FORMAT: Record<string, RDFFormat> = {
  "text/turtle": "text/turtle",
  "text/ttl": "text/turtle",
  "application/x-turtle": "text/turtle",
  "application/n-triples": "application/n-triples",
  "text/n3": "application/n-triples",
  "application/ld+json": "application/ld+json",
  "application/json": "application/ld+json",
  "application/rdf+xml": "application/rdf+xml",
  "application/xml": "application/rdf+xml",
};

/**
 * デフォルトのRDFフォーマット
 */
export const DEFAULT_RDF_FORMAT: RDFFormat = "text/turtle";

/**
 * エンティティの基本型
 */
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Cloudflare Workers環境変数の型定義
 */
export interface Env {
  HAIKU_MONUMENT_API_URL: string;
  RDF_CACHE?: KVNamespace;
  RDF_STORAGE?: R2Bucket;
}
