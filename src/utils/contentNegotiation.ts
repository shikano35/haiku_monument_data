/**
 * Content Negotiationを処理して適切なRDFフォーマットを選択
 */
import type { RDFFormat } from "@/types";
import { DEFAULT_RDF_FORMAT, MIME_TO_FORMAT } from "@/types";

/**
 * AcceptヘッダーからRDFフォーマットを決定
 * @param acceptHeader - リクエストのAcceptヘッダー
 * @returns 選択されたRDFフォーマット
 */
export function negotiateFormat(acceptHeader?: string): RDFFormat {
  if (!acceptHeader) {
    return DEFAULT_RDF_FORMAT;
  }

  if (acceptHeader.includes("text/html") || acceptHeader.includes("*/*")) {
    return DEFAULT_RDF_FORMAT;
  }

  const accepts = acceptHeader
    .split(",")
    .map((type) => {
      const [mimeType, ...params] = type.trim().split(";");
      const qMatch = params.find((p) => p.trim().startsWith("q="));
      const q = qMatch ? Number.parseFloat(qMatch.split("=")[1]) : 1;
      return { mimeType: mimeType.toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { mimeType } of accepts) {
    const format = MIME_TO_FORMAT[mimeType];
    if (format) {
      return format;
    }
  }

  return DEFAULT_RDF_FORMAT;
}

/**
 * RDFフォーマットに対応するMIMEタイプを取得
 * @param format - RDFフォーマット
 * @returns MIMEタイプ
 */
export function getContentType(format: RDFFormat): string {
  return format;
}

/**
 * RDFフォーマットに対応するファイル拡張子を取得
 * @param format - RDFフォーマット
 * @returns ファイル拡張子
 */
export function getFileExtension(format: RDFFormat): string {
  switch (format) {
    case "text/turtle":
      return ".ttl";
    case "application/n-triples":
      return ".nt";
    case "application/ld+json":
      return ".jsonld";
    case "application/rdf+xml":
      return ".rdf";
    default:
      return ".ttl";
  }
}
