# Architecture

CatalogFlow is one Next.js frontend, one Spring Boot backend, and one PostgreSQL database. It intentionally avoids extra services so the request path is easy to follow.

```mermaid
sequenceDiagram
    actor User
    participant Web as Next.js UI
    participant Controller as Spring controller
    participant Service as Feature service
    participant Repository as JPA repository
    participant Database as PostgreSQL
    User->>Web: Search, import, or review
    Web->>Controller: REST request
    Controller->>Service: Validated input
    Service->>Repository: Read or save entity
    Repository->>Database: SQL through Hibernate
    Database-->>Repository: Stored data
    Repository-->>Service: Entity/result page
    Service-->>Controller: Response DTO
    Controller-->>Web: JSON response
    Web-->>User: Updated interface
```

Controllers only translate HTTP input and output. Services contain the import, quality, enrichment, approval, and dashboard decisions. Repositories use Spring Data JPA. DTOs prevent persistence objects from becoming the public API.

Flyway applies ordered SQL migrations before Hibernate validates the entity mappings. The production profile connects to Render PostgreSQL; the default local profile uses H2 for a low-friction standalone start.

Important writes also call `AuditService`. Approvals store before-and-after values, while imports and rejections store the event details needed by the activity timeline.
