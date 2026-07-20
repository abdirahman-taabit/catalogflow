package com.catalogflow.product.service;

import com.catalogflow.product.model.EnrichmentStatus;
import com.catalogflow.product.model.Product;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProductQualityServiceTest {

    private final ProductQualityService service = new ProductQualityService();

    @Test
    void awardsACompleteProductTheMaximumScore() {
        int score = service.calculate(
                "Compact Travel Camera",
                "A compact travel camera with stabilisation, durable housing, and a long-life battery.",
                "Photography",
                "camera,travel,photography"
        );

        assertThat(score).isEqualTo(100);
    }

    @Test
    void identifiesEveryReviewProblem() {
        Product product = new Product("KEY-1042", " WIRELESS KEYBOARD ", "Short", "", "keyboard",
                36, EnrichmentStatus.NEEDS_REVIEW);

        assertThat(service.problems(product)).containsExactly(
                "Title formatting",
                "Description too short",
                "Category missing",
                "Keywords incomplete"
        );
    }
}
