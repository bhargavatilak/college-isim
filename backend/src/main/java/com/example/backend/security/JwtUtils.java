package com.example.backend.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    
    public String generateJwtToken(String username) {
        return "mock-jwt-token-for-" + username;
    }

    public String getUserNameFromJwtToken(String token) {
        return "mock-username";
    }

    public boolean validateJwtToken(String authToken) {
        return true;
    }
}
