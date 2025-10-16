# Haiku Monument Data

句碑データを RDF (Resource Description Framework) 形式で公開する Linked Open Data プロジェクトです。

## 概要

このプロジェクトは、既存の[haiku_monument_api](https://api.kuhi.jp/docs)から取得した句碑データを RDF 形式に変換し、Linked Open Data として Web 上で公開します。日本全国の句碑・俳句・俳人・設置場所の情報を、標準的な RDF 語彙（Schema.org、Dublin Core、FOAF、GeoSPARQL）を使用して表現し、機械可読な形で提供します。

## RDF 語彙とオントロジー

このプロジェクトでは、以下の標準 RDF 語彙を使用しています：

### 標準語彙

- **Schema.org** (`schema:`) - 汎用的なメタデータ
  - `schema:Monument`, `schema:Person`, `schema:CreativeWork`, `schema:Place`
  - `schema:name`, `schema:author`, `schema:location`, `schema:text`
- **Dublin Core Terms** (`dc:`) - 文書メタデータ
  - `dc:created`, `dc:modified`, `dc:source`, `dc:title`
- **FOAF** (`foaf:`) - 人物・団体情報
  - `foaf:Person`, `foaf:name`, `foaf:depiction`, `foaf:homepage`
- **WGS84 Geo Positioning** (`geo:`) - 地理座標
  - `geo:Point`, `geo:lat`, `geo:long`

### URI 設計

```
https://rdf.kuhi.jp/
├── monuments/{id}        # 句碑リソース
├── poems/{id}           # 俳句リソース
├── poets/{id}           # 俳人リソース
├── locations/{id}       # 場所リソース
├── inscriptions/{id}    # 碑文リソース
└── vocab#               # カスタム語彙
```

## API エンドポイント

### リソースエンドポイント

| エンドポイント       | 説明                | 例                             |
| -------------------- | ------------------- | ------------------------------ |
| `GET /`              | データカタログ情報  | `/`                            |
| `GET /monuments`     | すべての句碑        | `/monuments?limit=50&offset=0` |
| `GET /monuments/:id` | 特定の句碑          | `/monuments/1`                 |
| `GET /poems`         | すべての俳句        | `/poems?limit=50`              |
| `GET /poems/:id`     | 特定の俳句          | `/poems/1`                     |
| `GET /poets`         | すべての俳人        | `/poets`                       |
| `GET /poets/:id`     | 特定の俳人          | `/poets/1`                     |
| `GET /locations`     | すべての場所        | `/locations`                   |
| `GET /locations/:id` | 特定の場所          | `/locations/1`                 |
| `GET /void`          | VoID ディスクリプタ | `/void`                        |

## 関連リンク

- [句碑 API](https://api.kuhi.jp) - ソースデータ API
- [RDF 仕様](https://www.w3.org/TR/rdf11-concepts/)
- [N3.js Documentation](https://github.com/rdfjs/N3.js)
- [Schema.org](https://schema.org/)
- [Dublin Core](https://www.dublincore.org/)
- [FOAF](http://xmlns.com/foaf/spec/)
- [GeoSPARQL](https://www.ogc.org/standards/geosparql)
- [VoID](https://www.w3.org/TR/void/)
