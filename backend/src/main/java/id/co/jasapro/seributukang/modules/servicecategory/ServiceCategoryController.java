package id.co.jasapro.seributukang.modules.servicecategory;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.common.ApiResponse;
import id.co.jasapro.seributukang.modules.servicecategory.dto.CategoryRequest;
import id.co.jasapro.seributukang.modules.servicecategory.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryService service;

    // POST /categories — requires authentication (admin only in future)
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.success = true;
        response.message = "Category created successfully";
        response.data = service.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /categories — public
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>();
        response.success = true;
        response.message = "Categories retrieved successfully";
        response.data = service.getAllCategories();
        return ResponseEntity.ok(response);
    }

    // GET /categories/{id} — public
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.success = true;
        response.message = "Category retrieved successfully";
        response.data = service.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    // PUT /categories/{id} — requires authentication
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.success = true;
        response.message = "Category updated successfully";
        response.data = service.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /categories/{id} — requires authentication (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.success = true;
        response.message = "Category deleted successfully";
        response.data = null;
        return ResponseEntity.ok(response);
    }
}