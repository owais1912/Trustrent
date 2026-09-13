package com.trustrent.backend.dto;

import com.trustrent.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @NotBlank public String name;
    @NotBlank @Email public String email;
    @NotBlank public String password;
    public String phone;
    @NotNull public Role role;
}