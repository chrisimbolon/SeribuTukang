package id.co.jasapro.seributukang.modules.provider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.provider.dto.ProviderResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;

    @Transactional(readOnly = true)
    public ProviderResponse getProviderById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        return mapToResponse(provider);
    }

    private ProviderResponse mapToResponse(Provider provider) {
        return new ProviderResponse(
                provider.getId(),
                provider.getFullName(),
                provider.getEmail(),
                provider.getSpecialization(),
                provider.getBio(),
                provider.getYearsOfExperience(),
                provider.getIsActive(),
                provider.getIsVerified(),
                provider.getCreatedAt());
    }
}