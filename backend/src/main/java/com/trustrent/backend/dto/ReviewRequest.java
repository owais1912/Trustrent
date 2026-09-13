package com.trustrent.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class ReviewRequest {

    @NotNull
    public UUID rentalId;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer maintenanceRating;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer responsivenessRating;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer communicationRating;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer propertyCareRating;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer ruleComplianceRating;

    @NotNull
    @Min(1)
    @Max(5)
    public Integer overallRating;

    @Size(max = 1000)
    public String comment;
}