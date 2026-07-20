package com.catalogflow.catalogimport.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "import_jobs")
public class ImportJob {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String filename;

    @Column(name = "total_rows", nullable = false)
    private int totalRows;

    @Column(name = "imported_rows", nullable = false)
    private int importedRows;

    @Column(name = "rejected_rows", nullable = false)
    private int rejectedRows;

    @Column(name = "duplicate_rows", nullable = false)
    private int duplicateRows;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ImportStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected ImportJob() {
    }

    public ImportJob(String filename) {
        this.filename = filename;
        this.status = ImportStatus.PROCESSING;
    }

    public UUID getId() { return id; }
    public String getFilename() { return filename; }
    public int getTotalRows() { return totalRows; }
    public int getImportedRows() { return importedRows; }
    public int getRejectedRows() { return rejectedRows; }
    public int getDuplicateRows() { return duplicateRows; }
    public ImportStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void complete(int totalRows, int importedRows, int rejectedRows, int duplicateRows) {
        this.totalRows = totalRows;
        this.importedRows = importedRows;
        this.rejectedRows = rejectedRows;
        this.duplicateRows = duplicateRows;
        this.status = rejectedRows > 0 ? ImportStatus.COMPLETED_WITH_ERRORS : ImportStatus.COMPLETED;
    }
}

