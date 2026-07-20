package com.catalogflow.catalogimport.controller;

import com.catalogflow.catalogimport.dto.ImportJobResponse;
import com.catalogflow.catalogimport.service.CatalogImportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/imports")
public class ImportController {

    private final CatalogImportService catalogImportService;

    public ImportController(CatalogImportService catalogImportService) {
        this.catalogImportService = catalogImportService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImportJobResponse upload(@RequestPart("file") MultipartFile file) {
        return catalogImportService.importCsv(file);
    }

    @GetMapping("/{id}")
    public ImportJobResponse get(@PathVariable UUID id) {
        return catalogImportService.get(id);
    }

    @GetMapping(value = "/{id}/rejections.csv", produces = "text/csv")
    public ResponseEntity<String> rejectionReport(@PathVariable UUID id) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"catalogflow-rejections.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(catalogImportService.rejectionCsv(id));
    }
}

