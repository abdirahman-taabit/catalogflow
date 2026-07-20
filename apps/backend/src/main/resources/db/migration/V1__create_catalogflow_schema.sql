CREATE TABLE products (
    id UUID PRIMARY KEY,
    sku VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(240) NOT NULL,
    description VARCHAR(4000),
    category VARCHAR(120),
    keywords VARCHAR(1000),
    quality_score INTEGER NOT NULL,
    enrichment_status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE enrichment_suggestions (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    suggested_title VARCHAR(240),
    suggested_description VARCHAR(4000),
    suggested_category VARCHAR(120),
    suggested_keywords VARCHAR(1000),
    confidence_score INTEGER NOT NULL,
    explanation VARCHAR(4000) NOT NULL,
    status VARCHAR(24) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY,
    product_id UUID,
    event_type VARCHAR(40) NOT NULL,
    previous_values VARCHAR(8000),
    new_values VARCHAR(8000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE import_jobs (
    id UUID PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL,
    imported_rows INTEGER NOT NULL,
    rejected_rows INTEGER NOT NULL,
    duplicate_rows INTEGER NOT NULL,
    status VARCHAR(40) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE import_rejections (
    id UUID PRIMARY KEY,
    import_job_id UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
    row_number INTEGER NOT NULL,
    sku VARCHAR(120),
    reason VARCHAR(500) NOT NULL
);

CREATE INDEX idx_products_quality ON products(quality_score);
CREATE INDEX idx_products_status ON products(enrichment_status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_suggestions_product ON enrichment_suggestions(product_id);
CREATE INDEX idx_audit_created ON audit_events(created_at DESC);
CREATE INDEX idx_rejections_job ON import_rejections(import_job_id);

