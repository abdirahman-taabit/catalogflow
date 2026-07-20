package com.catalogflow.enrichment.service;

import com.catalogflow.enrichment.model.EnrichmentSuggestion;
import com.catalogflow.product.model.Product;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RuleBasedEnrichmentProvider implements EnrichmentProvider {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "with", "for", "from", "this", "that", "your", "our", "a", "an", "of", "to", "in"
    );

    private static final Map<String, String> CATEGORY_RULES = Map.ofEntries(
            Map.entry("keyboard", "Computer accessories"),
            Map.entry("mouse", "Computer accessories"),
            Map.entry("monitor", "Computer accessories"),
            Map.entry("usb", "Computer accessories"),
            Map.entry("headphone", "Audio"),
            Map.entry("speaker", "Audio"),
            Map.entry("bottle", "Kitchen and dining"),
            Map.entry("chair", "Furniture"),
            Map.entry("desk", "Furniture"),
            Map.entry("camera", "Photography"),
            Map.entry("tripod", "Photography"),
            Map.entry("jacket", "Apparel"),
            Map.entry("shoe", "Apparel")
    );

    @Override
    public EnrichmentSuggestion generateSuggestion(Product product) {
        List<String> appliedRules = new ArrayList<>();
        int confidence = 45;

        String title = normalizeTitle(product.getTitle());
        if (!title.equals(product.getTitle())) {
            confidence += 15;
            appliedRules.add("normalized title casing");
        }

        String category = hasText(product.getCategory()) ? product.getCategory().trim() : suggestCategory(product);
        if (!hasText(product.getCategory())) {
            confidence += 15;
            appliedRules.add("matched category using product keywords");
        }

        String keywords = extractKeywords(product, title, category);
        if (!keywords.equals(nullToEmpty(product.getKeywords()))) {
            confidence += 10;
            appliedRules.add("extracted searchable keywords");
        }

        String description = product.getDescription();
        if (!hasText(description) || description.trim().length() < 60) {
            description = createDescription(title, category, keywords);
            confidence += 15;
            appliedRules.add("expanded a short description from known fields");
        }

        if (appliedRules.isEmpty()) {
            appliedRules.add("confirmed the existing fields already meet the configured rules");
        }
        String explanation = "Rules applied: " + String.join(", ", appliedRules) + ".";
        return new EnrichmentSuggestion(product, title, description, category, keywords,
                Math.min(confidence, 95), explanation);
    }

    private String normalizeTitle(String value) {
        String trimmed = value == null ? "Untitled product" : value.trim().replaceAll("\\s+", " ");
        if (!trimmed.equals(trimmed.toUpperCase()) && !trimmed.equals(trimmed.toLowerCase())) {
            return trimmed;
        }
        return Arrays.stream(trimmed.toLowerCase(Locale.ROOT).split(" "))
                .map(word -> word.isBlank() ? word : Character.toUpperCase(word.charAt(0)) + word.substring(1))
                .collect(Collectors.joining(" "));
    }

    private String suggestCategory(Product product) {
        String searchable = (nullToEmpty(product.getTitle()) + " " + nullToEmpty(product.getDescription()))
                .toLowerCase(Locale.ROOT);
        return CATEGORY_RULES.entrySet().stream()
                .filter(entry -> searchable.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("General merchandise");
    }

    private String extractKeywords(Product product, String title, String category) {
        LinkedHashSet<String> words = new LinkedHashSet<>();
        String source = title + " " + nullToEmpty(product.getDescription()) + " " + category;
        Arrays.stream(source.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9 -]", " ").split("\\s+"))
                .filter(word -> word.length() > 2)
                .filter(word -> !STOP_WORDS.contains(word))
                .limit(6)
                .forEach(words::add);
        return String.join(",", words);
    }

    private String createDescription(String title, String category, String keywords) {
        String features = Arrays.stream(keywords.split(",")).limit(3).collect(Collectors.joining(", "));
        return title + " is a practical " + category.toLowerCase(Locale.ROOT)
                + " product featuring " + features + ". Designed for reliable everyday use.";
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}

