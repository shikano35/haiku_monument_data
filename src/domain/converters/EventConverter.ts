/**
 * イベントデータをRDFに変換するコンバーター
 * HuTime時間情報の標準化表現を含む
 */

import type { Store } from "n3";
import { DataFactory } from "n3";
import type { EventRDFEntity } from "../entities/RDFEntity";
import {
  HAIKU_MONUMENT_VOCAB,
  RESOURCE_BASE,
  VOCABULARIES,
} from "../vocabularies";
import { formatToXSDDate } from "@/utils/dateTimeFormatter";

const { namedNode, literal } = DataFactory;

/**
 * イベントデータをRDFトリプルに変換
 * @param event - イベントデータ
 * @param store - RDFストア
 */
export function convertEventToRDF(event: EventRDFEntity, store: Store): void {
  const eventUri = namedNode(`${RESOURCE_BASE.EVENTS}${event.id}`);

  // 基本的なクラス定義
  store.addQuad(
    eventUri,
    namedNode(VOCABULARIES.RDF.type),
    namedNode(HAIKU_MONUMENT_VOCAB.Event)
  );

  // イベントタイプ
  if (event.eventType) {
    store.addQuad(
      eventUri,
      namedNode(HAIKU_MONUMENT_VOCAB.eventType),
      literal(event.eventType, "en")
    );
  }

  // HuTime正規化時間表現
  if (event.huTimeNormalized) {
    store.addQuad(
      eventUri,
      namedNode(VOCABULARIES.HUTIME.huTimeNormalized),
      literal(event.huTimeNormalized)
    );
  }

  // 時間間隔の開始（xsd:date形式）
  if (event.intervalStart) {
    const startDate = formatToXSDDate(event.intervalStart);
    if (startDate) {
      store.addQuad(
        eventUri,
        namedNode(VOCABULARIES.HUTIME.intervalStart),
        literal(startDate, namedNode(VOCABULARIES.XSD.date))
      );
    }
  }

  // 時間間隔の終了（xsd:date形式）
  if (event.intervalEnd) {
    const endDate = formatToXSDDate(event.intervalEnd);
    if (endDate) {
      store.addQuad(
        eventUri,
        namedNode(VOCABULARIES.HUTIME.intervalEnd),
        literal(endDate, namedNode(VOCABULARIES.XSD.date))
      );
    }
  }

  // 不確実性に関する注記
  if (event.uncertaintyNote) {
    store.addQuad(
      eventUri,
      namedNode(VOCABULARIES.HUTIME.uncertaintyNote),
      literal(event.uncertaintyNote, "ja")
    );
  }

  // 行為者（Actor）
  if (event.actor) {
    store.addQuad(
      eventUri,
      namedNode(HAIKU_MONUMENT_VOCAB.actor),
      literal(event.actor, "ja")
    );
  }

  // 出典へのリンク
  if (event.source) {
    store.addQuad(
      eventUri,
      namedNode(VOCABULARIES.DC.source),
      namedNode(`${RESOURCE_BASE.SOURCES}${event.source.id}`)
    );
  }
}
