# Haiku Monument Data

句碑データを RDF (Resource Description Framework) 形式で公開する Linked Open Data プロジェクトです。

## 概要

このプロジェクトは、[句碑 API](https://api.kuhi.jp/docs)から取得した句碑・俳句・俳人・設置場所の情報を RDF 形式に変換し、Linked Open Data として公開します。

## 公開データ

- **句碑情報**: 全国の句碑・歌碑の位置、材質、建立年などのメタデータ
- **俳句**: 碑文として刻まれた俳句・短歌のテキストと季語情報
- **俳人**: 作者の生没年、経歴、関連作品
- **設置場所**: 地理座標（緯度経度）、住所、施設名

## エンドポイント一覧

| エンドポイント       | 説明                                                     | 例                                                            |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| `GET /monuments`     | 句碑一覧を取得                                           | [/monuments?limit=10](https://rdf.kuhi.jp/monuments?limit=10) |
| `GET /monuments/:id` | 特定の句碑を取得                                         | [/monuments/1](https://rdf.kuhi.jp/monuments/1)               |
| `GET /poems`         | 俳句一覧を取得                                           | [/poems?limit=10](https://rdf.kuhi.jp/poems?limit=10)         |
| `GET /poems/:id`     | 特定の俳句を取得                                         | [/poems/1](https://rdf.kuhi.jp/poems/1)                       |
| `GET /poets`         | 俳人一覧を取得                                           | [/poets](https://rdf.kuhi.jp/poets)                           |
| `GET /poets/:id`     | 特定の俳人を取得                                         | [/poets/1](https://rdf.kuhi.jp/poets/1)                       |
| `GET /locations`     | 場所一覧を取得                                           | [/locations](https://rdf.kuhi.jp/locations)                   |
| `GET /locations/:id` | 特定の場所を取得                                         | [/locations/1](https://rdf.kuhi.jp/locations/1)               |
| `GET /void`          | VoID (Vocabulary of Interlinked Datasets) ディスクリプタ |
| `GET /`              | データセット情報とウェルカムメッセージ                   |

## 使用語彙

このプロジェクトでは、以下の W3C 標準 RDF 語彙を使用しています：

### Schema.org (`schema:`)

汎用的なメタデータの表現

- `schema:Monument`, `schema:Person`, `schema:CreativeWork`, `schema:Place`
- `schema:name`, `schema:author`, `schema:location`, `schema:text`

### Dublin Core Terms (`dc:`)

文書のメタデータ

- `dc:created`, `dc:modified`, `dc:source`, `dc:title`, `dc:creator`

### FOAF (`foaf:`)

人物・組織情報

- `foaf:Person`, `foaf:name`, `foaf:depiction`, `foaf:homepage`

### WGS84 Geo (`geo:`)

地理座標

- `geo:Point`, `geo:lat`, `geo:long`

### カスタム語彙 (`hm:`)

句碑固有の情報

- `hm:hasInscription`, `hm:hasPoem`, `hm:haiku`, `hm:season`, `hm:kigo`

## 関連プロジェクト・リソース

### データソース

- [句碑 API](https://api.kuhi.jp/docs)
- [句碑 API ドキュメント](https://developers.kuhi.jp)

### 技術仕様

- [RDF](https://www.w3.org/TR/rdf11-concepts/)
- [Turtle](https://www.w3.org/TR/turtle/)
- [JSON-LD](https://www.w3.org/TR/json-ld11/)
- [VoID](https://www.w3.org/TR/void/)

### 使用語彙

- [Schema.org](https://schema.org/)
- [Dublin Core](https://www.dublincore.org/)
- [FOAF](http://xmlns.com/foaf/spec/)
- [WGS84 Geo Positioning](https://www.w3.org/2003/01/geo/)
