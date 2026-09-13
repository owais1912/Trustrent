package com.trustrent.backend.controller;

import com.trustrent.backend.dto.RentalPaymentRequest;
import com.trustrent.backend.entity.RentalPayment;
import com.trustrent.backend.service.RentalPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class RentalPaymentController {

    private final RentalPaymentService paymentService;

    public RentalPaymentController(
            RentalPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Map<String, Object>> recordPayment(
            @Valid @RequestBody RentalPaymentRequest request,
            Authentication authentication) {

        RentalPayment payment =
                paymentService.recordPayment(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(paymentResponse(payment));
    }

    @GetMapping("/rental/{rentalId}")
    @PreAuthorize("hasAnyRole('TENANT','LANDLORD')")
    public ResponseEntity<List<Map<String, Object>>> getRentalHistory(
            @PathVariable UUID rentalId,
            Authentication authentication) {

        List<Map<String, Object>> response =
                paymentService
                        .getRentalPaymentHistory(
                                authentication.getName(),
                                rentalId
                        )
                        .stream()
                        .map(this::paymentResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<Map<String, Object>>> getMyPayments(
            Authentication authentication) {

        List<Map<String, Object>> response =
                paymentService
                        .getTenantPaymentHistory(
                                authentication.getName()
                        )
                        .stream()
                        .map(this::paymentResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> paymentResponse(
            RentalPayment payment) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", payment.getId());
        response.put("rentalId", payment.getRental().getId());
        response.put("tenantId", payment.getTenant().getId());
        response.put("paymentMonth", payment.getPaymentMonth());
        response.put("dueDate", payment.getDueDate());
        response.put("paidDate", payment.getPaidDate());
        response.put("amount", payment.getAmount());
        response.put("status", payment.getStatus());
        response.put(
                "transactionReference",
                payment.getTransactionReference()
        );
        response.put("notes", payment.getNotes());
        response.put("createdAt", payment.getCreatedAt());
        response.put("updatedAt", payment.getUpdatedAt());

        return response;
    }
}