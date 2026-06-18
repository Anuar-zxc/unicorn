# Open data sources for Lexo MVP

## data.egov.kz

`data.egov.kz` is usable without a goszakup API token for public open-data
datasets. The portal exposes:

- catalogue AJAX: `/datasets/getdatasetsre`
- metadata: `/meta/{apiUri}/v1?pretty`
- JSON export: `/datasets/exportjson?index={apiUri}&version=v1&from=1&count=100`
- Excel export: `/datasets/exportexcel?...`

Run:

```bash
npm run egov:open-data -- --pages 50 --page-size 100 --rows-per-dataset 100
```

Pilot output is stored in:

```text
data/egov/open-data-pilot/
```

The collector filters public datasets by procurement/legal keywords such as:

- договор / контракт
- закуп / тендер / конкурс
- право / юрид
- лизинг / аренда / финанс
- шарт / келісім / мемлекеттік сатып алу

This is not a replacement for the official goszakup contracts API, but it gives
Lexo usable Kazakhstan public-sector/legal/procurement data without requiring a
token.

## goszakup.gov.kz

The official goszakup Open Web Services v3 contract API is still supported by:

```bash
npm run goszakup:contracts -- --token "$GOSZAKUP_API_TOKEN"
```

Use it later when a bearer token is available.
