package com.trustrent.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class RentalApplicationRequest {
    @NotNull
    public UUID propertyId;
    public String message;
}