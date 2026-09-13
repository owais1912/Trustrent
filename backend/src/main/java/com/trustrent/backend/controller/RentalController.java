package com.trustrent.backend.controller;

import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<Map<String, Object>>> getMyRentals(
            Authentication authentication) {

        List<Map<String, Object>> response =
                rentalService.getTenantRentals(authentication.getName())
                        .stream()
                        .map(this::rentalResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<Map<String, Object>>> getLandlordRentals(
            Authentication authentication) {

        List<Map<String, Object>> response =
                rentalService.getLandlordRentals(authentication.getName())
                        .stream()
                        .map(this::rentalResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> rentalResponse(Rental rental) {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", rental.getId());
        response.put("propertyId", rental.getProperty().getId());
        response.put("propertyTitle", rental.getProperty().getTitle());
        response.put("propertyCity", rental.getProperty().getCity());
        response.put("tenantId", rental.getTenant().getId());
        response.put("tenantName", rental.getTenant().getName());
        response.put("landlordId", rental.getLandlord().getId());
        response.put("landlordName", rental.getLandlord().getName());
        response.put("applicationId", rental.getApplication().getId());
        response.put("startDate", rental.getStartDate());
        response.put("endDate", rental.getEndDate());
        response.put("monthlyRent", rental.getMonthlyRent());
        response.put("status", rental.getStatus());
        response.put("createdAt", rental.getCreatedAt());
        response.put("updatedAt", rental.getUpdatedAt());

        return response;
    }
}