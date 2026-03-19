package id.co.jasapro.seributukang.modules.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.jasapro.seributukang.exception.BadRequestException;
import id.co.jasapro.seributukang.modules.auth.dto.LoginRequest;
import id.co.jasapro.seributukang.modules.auth.dto.LoginResponse;
import id.co.jasapro.seributukang.modules.auth.dto.RegisterProviderRequest;
import id.co.jasapro.seributukang.modules.auth.dto.RegisterUserRequest;
import id.co.jasapro.seributukang.modules.provider.Provider;
import id.co.jasapro.seributukang.modules.provider.ProviderRepository;
import id.co.jasapro.seributukang.modules.user.User;
import id.co.jasapro.seributukang.modules.user.UserRepository;
import id.co.jasapro.seributukang.security.JwtService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {

        // Step 1 — check users table first
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new BadRequestException("Invalid email or password");
            }
            String token = jwtService.generateToken(user.getId(), user.getEmail(), "USER");
            return new LoginResponse(token, "USER", user.getId(), user.getEmail(), user.getFullName());
        }

        // Step 2 — not a user? check providers table
        var providerOpt = providerRepository.findByEmail(request.getEmail());
        if (providerOpt.isPresent()) {
            Provider provider = providerOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), provider.getPasswordHash())) {
                throw new BadRequestException("Invalid email or password");
            }
            String token = jwtService.generateToken(provider.getId(), provider.getEmail(), "PROVIDER");
            return new LoginResponse(token, "PROVIDER", provider.getId(), provider.getEmail(), provider.getFullName());
        }

        // Step 3 — not found in either table
        throw new BadRequestException("Invalid email or password");
    }

    @Transactional
    public LoginResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), "USER");
        return new LoginResponse(token, "USER", saved.getId(), saved.getEmail(), saved.getFullName());
    }

    @Transactional
    public LoginResponse registerProvider(RegisterProviderRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (providerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Provider provider = new Provider(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getSpecialization(),
                request.getBio(),
                request.getYearsOfExperience());

        Provider saved = providerRepository.save(provider);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), "PROVIDER");
        return new LoginResponse(token, "PROVIDER", saved.getId(), saved.getEmail(), saved.getFullName());
    }
}