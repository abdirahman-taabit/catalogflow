package com.catalogflow.catalogimport.repository;

import com.catalogflow.catalogimport.model.ImportRejection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImportRejectionRepository extends JpaRepository<ImportRejection, UUID> {
    List<ImportRejection> findByImportJobIdOrderByRowNumber(UUID importJobId);
}

