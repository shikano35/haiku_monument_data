/**
 * メディアデータをRDFに変換するコンバーター
 * IIIF Presentation API 3.0対応
 */

import type { Store } from "n3";
import { DataFactory } from "n3";
import type { MediaRDFEntity } from "../entities/RDFEntity";
import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "../vocabularies";

const { namedNode, literal } = DataFactory;

/**
 * メディアデータをRDFトリプルに変換
 * @param media - メディアデータ
 * @param store - RDFストア
 */
export function convertMediaToRDF(media: MediaRDFEntity, store: Store): void {
  const mediaUri = namedNode(`${RESOURCE_BASE.MEDIA}${media.id}`);

  // 基本的なクラス定義
  store.addQuad(
    mediaUri,
    namedNode(VOCABULARIES.RDF.type),
    namedNode(VOCABULARIES.SCHEMA.ImageObject)
  );

  // メディアタイプ
  if (media.mediaType) {
    store.addQuad(
      mediaUri,
      namedNode(HAIKU_MONUMENT_VOCAB.mediaType),
      literal(media.mediaType, "en")
    );
  }

  // 画像URL
  if (media.url) {
    store.addQuad(
      mediaUri,
      namedNode(VOCABULARIES.SCHEMA.contentUrl),
      namedNode(media.url)
    );
  }

  // IIIF Manifest URL
  if (media.iiifManifestUrl) {
    store.addQuad(
      mediaUri,
      namedNode(HAIKU_MONUMENT_VOCAB.iiifManifestUrl),
      namedNode(media.iiifManifestUrl)
    );
    
    // IIIF Manifest へのリンク
    store.addQuad(
      namedNode(media.iiifManifestUrl),
      namedNode(VOCABULARIES.RDF.type),
      namedNode(VOCABULARIES.IIIF.Manifest)
    );
    
    // メディアとManifestの関連
    store.addQuad(
      mediaUri,
      namedNode(VOCABULARIES.SCHEMA.associatedMedia),
      namedNode(media.iiifManifestUrl)
    );
  }

  // 撮影日時
  if (media.capturedAt) {
    store.addQuad(
      mediaUri,
      namedNode(HAIKU_MONUMENT_VOCAB.capturedAt),
      literal(media.capturedAt, namedNode(VOCABULARIES.XSD.dateTime))
    );
  }

  // 撮影者
  if (media.photographer) {
    store.addQuad(
      mediaUri,
      namedNode(HAIKU_MONUMENT_VOCAB.photographer),
      literal(media.photographer, "ja")
    );
  }

  // ライセンス
  if (media.license) {
    store.addQuad(
      mediaUri,
      namedNode(HAIKU_MONUMENT_VOCAB.license),
      literal(media.license)
    );
  }
}
