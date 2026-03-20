package id.co.jasapro.seributukang.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import id.co.jasapro.seributukang.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth

                                                // Auth — fully public
                                                .requestMatchers(
                                                                "/auth/login",
                                                                "/auth/register/user",
                                                                "/auth/register/provider")
                                                .permitAll()

                                                // Health check — public
                                                .requestMatchers("/providers/ping")
                                                .permitAll()

                                                // Jobs — GET is public, POST requires USER token
                                                .requestMatchers(HttpMethod.GET, "/jobs", "/jobs/**")
                                                .permitAll()

                                                // Categories — GET is public
                                                .requestMatchers(HttpMethod.GET, "/categories", "/categories/**")
                                                .permitAll()

                                                // Reviews — GET is public
                                                .requestMatchers(HttpMethod.GET, "/providers/*/reviews")
                                                .permitAll()

                                                // Everything else requires authentication
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}