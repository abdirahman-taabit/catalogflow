package com.catalogflow.common;

import com.catalogflow.product.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final ProductRepository productRepository;

    public HealthController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public Map<String, Object> health() {
        productRepository.count();
        return Map.of("status", "UP", "database", "UP", "timestamp", Instant.now());
    }
}

