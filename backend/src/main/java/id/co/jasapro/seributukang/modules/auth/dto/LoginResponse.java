package id.co.jasapro.seributukang.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
    private String email;
    private String fullName;
}