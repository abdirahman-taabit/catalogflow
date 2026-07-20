package com.catalogflow.product.repository;

import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    boolean existsBySkuIgnoreCase(String sku);
    long countByEnrichmentStatus(EnrichmentStatus status);
    Page<Product> findByTitleContainingIgnoreCaseOrSkuContainingIgnoreCase(String title, String sku, Pageable pageable);
}

