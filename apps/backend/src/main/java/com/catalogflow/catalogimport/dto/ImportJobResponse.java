package com.catalogflow.catalogimport.dto;

import com.catalogflow.catalogimport.model.ImportJob;
import com.catalogflow.catalogimport.model.ImportStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ImportJobResponse(
        UUID id,
        String filename,
        int totalRows,
        int importedRows,
        int rejectedRows,
        int duplicateRows,
        ImportStatus status,
        Instant createdAt,
        List<ImportRejectionResponse> rejections
) {
    public static ImportJobResponse from(ImportJob job, List<ImportRejectionResponse> rejections) {
        return new ImportJobResponse(job.getId(), job.getFilename(), job.getTotalRows(), job.getImportedRows(),
                job.getRejectedRows(), job.getDuplicateRows(), job.getStatus(), job.getCreatedAt(), rejections);
    }
}

