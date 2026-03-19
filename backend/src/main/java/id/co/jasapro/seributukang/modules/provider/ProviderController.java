package id.co.jasapro.seributukang.modules.provider;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.common.ApiResponse;
import id.co.jasapro.seributukang.modules.provider.dto.ProviderResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderResponse>> getProviderById(@PathVariable Long id) {
        ProviderResponse response = providerService.getProviderById(id);
        ApiResponse<ProviderResponse> apiResponse = new ApiResponse<>();
        apiResponse.success = true;
        apiResponse.message = "Provider retrieved successfully";
        apiResponse.data = response;
        return ResponseEntity.ok(apiResponse);
    }
}