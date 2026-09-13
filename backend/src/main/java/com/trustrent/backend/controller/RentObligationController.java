package com.trustrent.backend.controller;

import com.trustrent.backend.service.RentObligationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rent-obligations")
public class RentObligationController {

    private final RentObligationService rentObligationService;

    public RentObligationController(
            RentObligationService rentObligationService
    ) {
        this.rentObligationService =
                rentObligationService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> generateObligations() {

        rentObligationService
                .generateCurrentMonthObligations();

        return ResponseEntity.ok(
                "Current month rent obligations processed"
        );
    }

    @PostMapping("/mark-overdue")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<String> markOverdue() {

        rentObligationService
                .markOverduePaymentsAsMissed();

        return ResponseEntity.ok(
                "Overdue rent payments processed"
        );
    }
}