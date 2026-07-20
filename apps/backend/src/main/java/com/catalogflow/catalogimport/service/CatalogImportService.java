package com.catalogflow.catalogimport.service;

import com.catalogflow.audit.model.AuditEventType;
import com.catalogflow.audit.service.AuditService;
import com.catalogflow.catalogimport.dto.ImportJobResponse;
import com.catalogflow.catalogimport.dto.ImportRejectionResponse;
import com.catalogflow.catalogimport.model.ImportJob;
import com.catalogflow.catalogimport.model.ImportRejection;
import com.catalogflow.catalogimport.repository.ImportJobRepository;
import com.catalogflow.catalogimport.repository.ImportRejectionRepository;
import com.catalogflow.common.BadRequestException;
import com.catalogflow.common.NotFoundException;
import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import com.catalogflow.product.service.ProductQualityService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class CatalogImportService {

    private static final Pattern VALID_SKU = Pattern.compile("[A-Z0-9][A-Z0-9_-]{2,31}");
    private static final List<String> REQUIRED_HEADERS = List.of("sku", "title", "description", "category");

    private final ImportJobRepository importJobRepository;
    private final ImportRejectionRepository rejectionRepository;
    private final ProductRepository productRepository;
    private final ProductQualityService qualityService;
    private final AuditService auditService;

    public CatalogImportService(ImportJobRepository importJobRepository,
                                ImportRejectionRepository rejectionRepository,
                                ProductRepository productRepository,
                                ProductQualityService qualityService,
                                AuditService auditService) {
        this.importJobRepository = importJobRepository;
        this.rejectionRepository = rejectionRepository;
        this.productRepository = productRepository;
        this.qualityService = qualityService;
        this.auditService = auditService;
    }

    @Transactional
    public ImportJobResponse importCsv(MultipartFile file) {
        validateFile(file);
        ImportJob job = importJobRepository.save(new ImportJob(file.getOriginalFilename()));
        int total = 0;
        int imported = 0;
        int duplicate = 0;
        List<ImportRejection> rejections = new ArrayList<>();
        Set<String> fileSkus = new HashSet<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setTrim(true)
                     .get()
                     .parse(reader)) {
            validateHeaders(parser.getHeaderMap().keySet());
            for (CSVRecord record : parser) {
                total++;
                int rowNumber = Math.toIntExact(record.getRecordNumber() + 1);
                String sku = value(record, "sku").toUpperCase(Locale.ROOT);
                String title = value(record, "title");
                String description = value(record, "description");
                String category = value(record, "category");

                String validationProblem = validateRow(sku, title);
                if (validationProblem != null) {
                    rejections.add(new ImportRejection(job, rowNumber, sku, validationProblem));
                    continue;
                }
                if (!fileSkus.add(sku) || productRepository.existsBySkuIgnoreCase(sku)) {
                    duplicate++;
                    rejections.add(new ImportRejection(job, rowNumber, sku, "Duplicate SKU"));
                    continue;
                }

                String keywords = extractInitialKeywords(title, category);
                int qualityScore = qualityService.calculate(title, description, category, keywords);
                EnrichmentStatus status = qualityScore < 80 ? EnrichmentStatus.NEEDS_REVIEW : EnrichmentStatus.COMPLETE;
                Product product = productRepository.save(new Product(sku, title, description, category, keywords,
                        qualityScore, status));
                auditService.record(product.getId(), AuditEventType.PRODUCT_IMPORTED, null,
                        Map.of("sku", sku, "source", file.getOriginalFilename()));
                imported++;
            }
        } catch (IOException | IllegalArgumentException exception) {
            throw new BadRequestException("The CSV could not be read. Check the encoding and required columns.");
        }

        job.complete(total, imported, rejections.size(), duplicate);
        importJobRepository.save(job);
        rejectionRepository.saveAll(rejections);
        auditService.record(null, AuditEventType.IMPORT_COMPLETED, null,
                Map.of("importJobId", job.getId(), "filename", job.getFilename(), "importedRows", imported,
                        "rejectedRows", rejections.size()));
        return toResponse(job);
    }

    @Transactional(readOnly = true)
    public ImportJobResponse get(UUID id) {
        ImportJob job = importJobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Import job not found."));
        return toResponse(job);
    }

    @Transactional(readOnly = true)
    public String rejectionCsv(UUID id) {
        ImportJob job = importJobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Import job not found."));
        StringBuilder csv = new StringBuilder("row,sku,reason\n");
        for (ImportRejection rejection : rejectionRepository.findByImportJobIdOrderByRowNumber(id)) {
            csv.append(rejection.getRowNumber()).append(',')
                    .append(escape(rejection.getSku())).append(',')
                    .append(escape(rejection.getReason())).append('\n');
        }
        return csv.toString();
    }

    private ImportJobResponse toResponse(ImportJob job) {
        List<ImportRejectionResponse> rejections = rejectionRepository.findByImportJobIdOrderByRowNumber(job.getId())
                .stream().map(ImportRejectionResponse::from).toList();
        return ImportJobResponse.from(job, rejections);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Choose a CSV file to import.");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase(Locale.ROOT).endsWith(".csv")) {
            throw new BadRequestException("CatalogFlow accepts CSV files only.");
        }
    }

    private void validateHeaders(Set<String> headers) {
        if (!headers.containsAll(REQUIRED_HEADERS)) {
            throw new BadRequestException("CSV headers must be: sku,title,description,category");
        }
    }

    private String validateRow(String sku, String title) {
        if (!VALID_SKU.matcher(sku).matches()) {
            return "SKU must be 3-32 characters using letters, numbers, hyphens or underscores";
        }
        if (title.isBlank()) {
            return "Title is required";
        }
        if (title.length() > 240) {
            return "Title must be 240 characters or fewer";
        }
        return null;
    }

    private String extractInitialKeywords(String title, String category) {
        return (title + " " + category).toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]", " ")
                .trim()
                .replaceAll("\\s+", ",");
    }

    private String value(CSVRecord record, String header) {
        String value = record.get(header);
        return value == null ? "" : value.trim();
    }

    private String escape(String value) {
        String safe = value == null ? "" : value;
        return "\"" + safe.replace("\"", "\"\"") + "\"";
    }
}

