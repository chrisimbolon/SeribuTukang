package id.co.jasapro.seributukang.modules.servicecategory;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.servicecategory.dto.CategoryRequest;
import id.co.jasapro.seributukang.modules.servicecategory.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (repository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Category already exists: " + request.getName());
        }

        ServiceCategory category = new ServiceCategory(
                request.getName(),
                request.getDescription(),
                request.getIconUrl());

        return mapToResponse(repository.save(category));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return repository.findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return mapToResponse(findCategoryById(id));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        ServiceCategory category = findCategoryById(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        return mapToResponse(repository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        ServiceCategory category = findCategoryById(id);
        category.setIsActive(false);
        repository.save(category);
    }

    private ServiceCategory findCategoryById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    private CategoryResponse mapToResponse(ServiceCategory category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIconUrl(),
                category.getIsActive(),
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}