package id.co.jasapro.seributukang.modules.provider;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.exception.ResourceNotFoundException;
import id.co.jasapro.seributukang.modules.provider.dto.ProviderRequest;
import id.co.jasapro.seributukang.modules.provider.dto.ProviderResponse;
import id.co.jasapro.seributukang.util.PasswordEncoderUtil;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    public ProviderService(ProviderRepository providerRepository, PasswordEncoderUtil passwordEncoderUtil) {
        this.providerRepository = providerRepository;
        this.passwordEncoder = passwordEncoderUtil.passwordEncoder();
    }

    @Transactional
    public ProviderResponse registerProvider(ProviderRequest request) {
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        Provider provider = new Provider(
                request.getFullName(),
                request.getEmail(),
                hashedPassword,
                request.getSpecialization(),
                request.getBio(),
                request.getYearsOfExperience());

        Provider saved = providerRepository.save(provider);

        return mapToResponse(saved);
    }

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
