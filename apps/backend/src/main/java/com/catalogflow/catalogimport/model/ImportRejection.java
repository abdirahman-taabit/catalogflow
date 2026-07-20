package com.catalogflow.catalogimport.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "import_rejections")
public class ImportRejection {

    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "import_job_id", nullable = false)
    private ImportJob importJob;

    @Column(name = "row_number", nullable = false)
    private int rowNumber;

    @Column(length = 120)
    private String sku;

    @Column(nullable = false, length = 500)
    private String reason;

    protected ImportRejection() {
    }

    public ImportRejection(ImportJob importJob, int rowNumber, String sku, String reason) {
        this.importJob = importJob;
        this.rowNumber = rowNumber;
        this.sku = sku;
        this.reason = reason;
    }

    public UUID getId() { return id; }
    public ImportJob getImportJob() { return importJob; }
    public int getRowNumber() { return rowNumber; }
    public String getSku() { return sku; }
    public String getReason() { return reason; }
}

