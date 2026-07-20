# Database guide

Flyway scripts in `apps/backend/src/main/resources/db/migration` own the database structure.

- `products` stores the latest approved catalog values and quality state.
- `enrichment_suggestions` stores proposed values, confidence, explanation, and review state.
- `audit_events` stores important product and catalog actions with before/after JSON text.
- `import_jobs` stores each file-level result.
- `import_rejections` stores rejected row numbers, SKUs, and reasons.

`products.sku` is unique, providing a final database guard after the import service checks duplicates. Foreign keys connect suggestions and product audit events to products and rejection rows to their import job. Indexes cover common status, product, and created-time lookups.

On startup, Flyway applies unapplied migrations. Hibernate uses `ddl-auto=validate`, so application startup fails if the Java entities and migrated schema disagree rather than silently changing production tables.

Local standalone development uses an H2 database in PostgreSQL compatibility mode. Docker Compose, Testcontainers, and Render use PostgreSQL 17. The Testcontainers test verifies that the same Flyway scripts and JPA mappings work against a real PostgreSQL instance.
