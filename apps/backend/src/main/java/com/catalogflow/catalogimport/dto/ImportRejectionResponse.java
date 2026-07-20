package com.catalogflow.catalogimport.dto;

import com.catalogflow.catalogimport.model.ImportRejection;

public record ImportRejectionResponse(int rowNumber, String sku, String reason) {
    public static ImportRejectionResponse from(ImportRejection rejection) {
        return new ImportRejectionResponse(rejection.getRowNumber(), rejection.getSku(), rejection.getReason());
    }
}

