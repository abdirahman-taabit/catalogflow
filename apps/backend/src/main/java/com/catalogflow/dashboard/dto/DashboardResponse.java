package com.catalogflow.dashboard.dto;

import com.catalogflow.audit.dto.AuditEventResponse;
import com.catalogflow.catalogimport.dto.ImportJobResponse;

import java.util.List;

public record DashboardResponse(
        long totalProducts,
        long productsRequiringReview,
        long pendingSuggestions,
        long approvedImprovements,
        int averageQuality,
        QualityOverview qualityOverview,
        List<ImportJobResponse> recentImports,
        List<AuditEventResponse> recentActivity
) {
    public record QualityOverview(long healthy, long watch, long critical) {
    }
}

