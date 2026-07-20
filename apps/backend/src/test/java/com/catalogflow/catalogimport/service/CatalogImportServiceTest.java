package com.catalogflow.catalogimport.service;

import com.catalogflow.audit.service.AuditService;
import com.catalogflow.catalogimport.dto.ImportJobResponse;
import com.catalogflow.catalogimport.model.ImportJob;
import com.catalogflow.catalogimport.repository.ImportJobRepository;
import com.catalogflow.catalogimport.repository.ImportRejectionRepository;
import com.catalogflow.common.BadRequestException;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import com.catalogflow.product.service.ProductQualityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogImportServiceTest {

    @Mock private ImportJobRepository importJobRepository;
    @Mock private ImportRejectionRepository rejectionRepository;
    @Mock private ProductRepository productRepository;
    @Mock private AuditService auditService;

    private CatalogImportService service;

    @BeforeEach
    void setUp() {
        when(importJobRepository.save(any(ImportJob.class))).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(rejectionRepository.findByImportJobIdOrderByRowNumber(any())).thenReturn(List.of());
        service = new CatalogImportService(importJobRepository, rejectionRepository, productRepository,
                new ProductQualityService(), auditService);
    }

    @Test
    void importsValidRowsAndRejectsInvalidAndDuplicateSkus() {
        String csv = "sku,title,description,category\n"
                + "KBD-101,Mechanical Keyboard,A well made mechanical keyboard for daily work,Computer accessories\n"
                + "BAD SKU,Broken row,Description,General\n"
                + "KBD-101,Duplicate keyboard,Description,Computer accessories\n";
        MockMultipartFile file = new MockMultipartFile("file", "catalog.csv", "text/csv",
                csv.getBytes(StandardCharsets.UTF_8));

        ImportJobResponse result = service.importCsv(file);

        ArgumentCaptor<Product> product = ArgumentCaptor.forClass(Product.class);
        org.mockito.Mockito.verify(productRepository).save(product.capture());
        assertThat(product.getValue().getSku()).isEqualTo("KBD-101");
        assertThat(result.totalRows()).isEqualTo(3);
        assertThat(result.importedRows()).isEqualTo(1);
        assertThat(result.rejectedRows()).isEqualTo(2);
        assertThat(result.duplicateRows()).isEqualTo(1);
    }

    @Test
    void rejectsCsvFilesWithoutRequiredHeaders() {
        MockMultipartFile file = new MockMultipartFile("file", "catalog.csv", "text/csv",
                "sku,title\nABC-1,Product".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> service.importCsv(file))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("headers");
    }
}
