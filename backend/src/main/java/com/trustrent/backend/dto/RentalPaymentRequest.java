package com.trustrent.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public class RentalPaymentRequest {

    @NotNull
    public UUID rentalId;

    @NotNull
    public LocalDate paymentMonth;

    @NotNull
    public LocalDate paidDate;

    public String transactionReference;

    public String notes;
}