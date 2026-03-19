package id.co.jasapro.seributukang.modules.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import id.co.jasapro.seributukang.modules.auth.dto.LoginRequest;
import id.co.jasapro.seributukang.modules.auth.dto.LoginResponse;
import id.co.jasapro.seributukang.modules.auth.dto.RegisterProviderRequest;
import id.co.jasapro.seributukang.modules.auth.dto.RegisterUserRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/user")
    public ResponseEntity<LoginResponse> registerUser(@Valid @RequestBody RegisterUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(request));
    }

    @PostMapping("/register/provider")
    public ResponseEntity<LoginResponse> registerProvider(@Valid @RequestBody RegisterProviderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerProvider(request));
    }
}