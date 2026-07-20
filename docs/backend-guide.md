# Backend guide

The backend lives in `apps/backend` and follows the feature packages `product`, `catalogimport`, `enrichment`, `audit`, `dashboard`, `common`, and `configuration`.

## From HTTP to PostgreSQL

1. A controller receives a request under `/api`.
2. Spring converts route, query, or multipart values into Java values.
3. The controller calls one service method.
4. The service validates business rules and calls a JPA repository.
5. The repository reads or writes PostgreSQL in the current transaction.
6. The service returns a small response DTO for JSON serialization.

`GlobalExceptionHandler` turns expected failures into structured responses with a timestamp, HTTP status, error code, message, and optional field errors.

## CSV importing

`CatalogImportService` uses Apache Commons CSV. It first checks the file type and required `sku,title,description,category` headers. Each record is then checked for SKU syntax, title presence, duplicates already seen in the file, and duplicates already stored. Valid rows become products; invalid rows become `ImportRejection` records with the original row number and reason. The rejection endpoint rebuilds those records as a downloadable CSV.

## Enrichment rules

`RuleBasedEnrichmentProvider` implements the small `EnrichmentProvider` interface. It normalizes all-upper/all-lower titles, chooses categories with readable keyword mappings, extracts searchable keywords, and expands missing or short descriptions. Its confidence score increases only when a known rule contributes. The explanation lists those rules.

## Approval and audit

Generating a suggestion marks the product as pending. Approval copies the suggested fields to the product, recalculates quality, marks both records, and stores before-and-after audit values in one transaction. Rejection leaves the product fields untouched and stores a rejection event.

Run `./mvnw test` for unit/API tests and `./mvnw verify` for the PostgreSQL Testcontainers integration test and final JAR.
