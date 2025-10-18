import { HAIKU_MONUMENT_VOCAB, VOCABULARIES } from "@/domain/vocabularies";
import type { RDFFormat } from "@/types";
import type { Quad } from "@rdfjs/types";
/**
 * RDFシリアライザー
 * N3.jsを使用してRDFデータを各種フォーマットに変換
 */
import { Writer } from "n3";

/**
 * デフォルトのプレフィックス定義
 */
const DEFAULT_PREFIXES = {
  schema: VOCABULARIES.SCHEMA.BASE,
  dc: VOCABULARIES.DC.BASE,
  foaf: VOCABULARIES.FOAF.BASE,
  geo: VOCABULARIES.GEO.BASE,
  rdf: VOCABULARIES.RDF.BASE,
  rdfs: VOCABULARIES.RDFS.BASE,
  owl: VOCABULARIES.OWL.BASE,
  xsd: VOCABULARIES.XSD.BASE,
  hutime: VOCABULARIES.HUTIME.BASE,
  imi: VOCABULARIES.IMI.BASE,
  iiif: VOCABULARIES.IIIF.BASE,
  aat: VOCABULARIES.AAT.BASE,
  hm: HAIKU_MONUMENT_VOCAB.BASE,
};

/**
 * RDFトリプルを指定されたフォーマットでシリアライズ
 * @param quads - RDFクワッド（トリプル）の配列
 * @param format - 出力フォーマット
 * @returns シリアライズされたRDF文字列
 */
export async function serializeRDF(
  quads: Quad[],
  format: RDFFormat = "text/turtle",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writerFormat = mapFormatToN3Format(format);
    const writer = new Writer({
      format: writerFormat,
      prefixes: DEFAULT_PREFIXES,
    });

    // クワッドを追加
    for (const quad of quads) {
      writer.addQuad(quad);
    }

    // シリアライズして文字列として出力
    writer.end((error: Error | null, result: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * RDFFormatをN3.jsのフォーマット文字列に変換
 * @param format - RDFフォーマット
 * @returns N3.jsのフォーマット文字列
 */
function mapFormatToN3Format(
  format: RDFFormat,
): "Turtle" | "N-Triples" | "N-Quads" {
  switch (format) {
    case "text/turtle":
      return "Turtle";
    case "application/n-triples":
      return "N-Triples";
    case "application/ld+json":
      return "Turtle";
    case "application/rdf+xml":
      return "Turtle";
    default:
      return "Turtle";
  }
}

/**
 * プレフィックスを含むWriterを作成
 * @param prefixes - プレフィックスのマップ
 * @param format - 出力フォーマット
 * @returns N3 Writer
 */
export function createWriter(
  prefixes: Record<string, string>,
  format: RDFFormat = "text/turtle",
): Writer {
  const writerFormat = mapFormatToN3Format(format);
  return new Writer({
    format: writerFormat,
    prefixes,
  });
}
