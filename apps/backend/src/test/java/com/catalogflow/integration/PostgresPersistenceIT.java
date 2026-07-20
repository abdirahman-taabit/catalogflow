package com.catalogflow.integration;

import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import com.catalogflow.product.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
class PostgresPersistenceIT {

    @Container
    static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:17-alpine");

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private ProductRepository productRepository;

    @Test
    void flywayMigratesAndJpaPersistsAgainstPostgres() {
        Product product = productRepository.save(new Product("TST-9001", "Postgres Test Product",
                "A durable product used to verify the PostgreSQL integration path end to end.",
                "Testing", "postgres,integration,catalog", 100, EnrichmentStatus.COMPLETE));

        assertThat(productRepository.findById(product.getId())).isPresent();
        assertThat(productRepository.count()).isGreaterThanOrEqualTo(13);
    }
}
