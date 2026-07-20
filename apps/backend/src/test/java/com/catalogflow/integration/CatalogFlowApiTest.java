package com.catalogflow.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:catalogflow-api;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=validate"
})
@AutoConfigureMockMvc
class CatalogFlowApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthChecksTheApplicationAndDatabase() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"));
    }

    @Test
    void productSearchAndStatusFilteringReturnMatchingRows() throws Exception {
        mockMvc.perform(get("/api/products")
                        .queryParam("search", "camera")
                        .queryParam("status", "NEEDS_REVIEW")
                        .queryParam("sort", "title")
                        .queryParam("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.items[0].sku").value("CAM-8820"));
    }

    @Test
    void missingUploadPartReturnsAStructuredValidationError() throws Exception {
        mockMvc.perform(multipart("/api/imports"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Choose a CSV file to import."));
    }
}
