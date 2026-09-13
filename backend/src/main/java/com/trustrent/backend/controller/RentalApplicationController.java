package com.trustrent.backend.controller;

import com.trustrent.backend.dto.RentalApplicationRequest;
import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.RentalApplication;
import com.trustrent.backend.service.RentalApplicationService;
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
@RequestMapping("/api/applications")
public class RentalApplicationController {

    private final RentalApplicationService rentalApplicationService;

    public RentalApplicationController(
            RentalApplicationService rentalApplicationService) {
        this.rentalApplicationService = rentalApplicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Map<String, Object>> applyForProperty(
            @Valid @RequestBody RentalApplicationRequest request,
            Authentication authentication) {

        RentalApplication application =
                rentalApplicationService.applyForProperty(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(applicationResponse(application));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications(
            Authentication authentication) {

        List<Map<String, Object>> response =
                rentalApplicationService
                        .getTenantApplications(authentication.getName())
                        .stream()
                        .map(this::applicationResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/landlord")
    public ResponseEntity<List<Map<String, Object>>> getLandlordApplications(
            Authentication authentication) {

        List<Map<String, Object>> response =
                rentalApplicationService
                        .getLandlordApplications(authentication.getName())
                        .stream()
                        .map(this::applicationResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/accept")
    
    public ResponseEntity<Map<String, Object>> acceptApplication(
            @PathVariable UUID id,
            Authentication authentication) {

        Rental rental =
                rentalApplicationService.acceptApplication(
                        authentication.getName(),
                        id
                );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Application accepted and rental created");
        response.put("rentalId", rental.getId());
        response.put("applicationId", rental.getApplication().getId());
        response.put("propertyId", rental.getProperty().getId());
        response.put("tenantId", rental.getTenant().getId());
        response.put("landlordId", rental.getLandlord().getId());
        response.put("startDate", rental.getStartDate());
        response.put("monthlyRent", rental.getMonthlyRent());
        response.put("status", rental.getStatus());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectApplication(
            @PathVariable UUID id,
            Authentication authentication) {

        RentalApplication application =
                rentalApplicationService.rejectApplication(
                        authentication.getName(),
                        id
                );

        return ResponseEntity.ok(applicationResponse(application));
    }

    private Map<String, Object> applicationResponse(
            RentalApplication application) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", application.getId());
        response.put("propertyId", application.getProperty().getId());
        response.put("propertyTitle", application.getProperty().getTitle());
        response.put("propertyCity", application.getProperty().getCity());
        response.put("tenantId", application.getTenant().getId());
        response.put("tenantName", application.getTenant().getName());
        response.put("status", application.getStatus());
        response.put("message", application.getMessage());
        response.put("appliedAt", application.getAppliedAt());
        response.put("updatedAt", application.getUpdatedAt());

        return response;
    }
}