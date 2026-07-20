package com.catalogflow.product.service;

import com.catalogflow.product.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductQualityService {

    public int calculate(String title, String description, String category, String keywords) {
        int score = 0;
        if (hasText(title)) {
            score += isPoorlyFormatted(title) ? 20 : 30;
        }
        if (hasText(description)) {
            score += description.trim().length() >= 60 ? 30 : description.trim().length() >= 20 ? 18 : 6;
        }
        if (hasText(category)) {
            score += 20;
        }
        if (hasText(keywords)) {
            int count = keywords.split(",").length;
            score += count >= 3 ? 20 : 10;
        }
        return Math.min(score, 100);
    }

    public List<String> problems(Product product) {
        List<String> problems = new ArrayList<>();
        if (isPoorlyFormatted(product.getTitle())) {
            problems.add("Title formatting");
        }
        if (!hasText(product.getDescription())) {
            problems.add("Description missing");
        } else if (product.getDescription().trim().length() < 60) {
            problems.add("Description too short");
        }
        if (!hasText(product.getCategory())) {
            problems.add("Category missing");
        }
        if (!hasText(product.getKeywords()) || product.getKeywords().split(",").length < 3) {
            problems.add("Keywords incomplete");
        }
        return problems;
    }

    public boolean isPoorlyFormatted(String title) {
        if (!hasText(title)) {
            return true;
        }
        String trimmed = title.trim();
        return !trimmed.equals(title) || trimmed.equals(trimmed.toUpperCase()) || trimmed.equals(trimmed.toLowerCase());
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}

