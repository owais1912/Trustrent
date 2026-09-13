package com.trustrent.backend.dto;

import com.trustrent.backend.enums.Role;
import java.util.UUID;

public class AuthResponse {
    public UUID userId;
    public String name;
    public Role role;
    public String accessToken;

    public AuthResponse(UUID userId, String name, Role role, String accessToken) {
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.accessToken = accessToken;
    }
}