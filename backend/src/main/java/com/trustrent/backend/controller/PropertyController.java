package com.trustrent.backend.controller;

import com.trustrent.backend.dto.PropertyResponse;
import com.trustrent.backend.entity.Property;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.PropertyStatus;
import com.trustrent.backend.repository.PropertyRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyController(
            PropertyRepository propertyRepository,
            UserRepository userRepository) {

        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @RequestBody Property propertyRequest,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        User landlord = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        if (!"LANDLORD".equals(
                landlord.getRole().name())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .build();
        }

        if (propertyRequest.getTitle() == null ||
                propertyRequest.getTitle().isBlank()) {

            throw new RuntimeException(
                    "Property title is required"
            );
        }

        if (propertyRequest.getDescription() == null ||
                propertyRequest.getDescription().isBlank()) {

            throw new RuntimeException(
                    "Property description is required"
            );
        }

        if (propertyRequest.getLocation() == null ||
                propertyRequest.getLocation().isBlank()) {

            throw new RuntimeException(
                    "Property location is required"
            );
        }

        if (propertyRequest.getCity() == null ||
                propertyRequest.getCity().isBlank()) {

            throw new RuntimeException(
                    "Property city is required"
            );
        }

        if (propertyRequest.getMonthlyRent() == null ||
                propertyRequest.getMonthlyRent()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Monthly rent must be greater than zero"
            );
        }

        if (propertyRequest.getSecurityDeposit() == null ||
                propertyRequest.getSecurityDeposit()
                        .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Security deposit cannot be negative"
            );
        }

        if (propertyRequest.getBedrooms() == null ||
                propertyRequest.getBedrooms() < 0) {

            throw new RuntimeException(
                    "Bedrooms must be zero or greater"
            );
        }

        if (propertyRequest.getBathrooms() == null ||
                propertyRequest.getBathrooms() < 0) {

            throw new RuntimeException(
                    "Bathrooms must be zero or greater"
            );
        }

        if (propertyRequest.getPropertyType() == null ||
                propertyRequest.getPropertyType().isBlank()) {

            throw new RuntimeException(
                    "Property type is required"
            );
        }

        /*
         * The landlord is always taken from the
         * authenticated user. Never trust a landlord
         * supplied by the frontend.
         */
        propertyRequest.setLandlord(landlord);

        /*
         * A newly created property is available by default.
         */
        propertyRequest.setStatus(
                PropertyStatus.AVAILABLE
        );

        /*
         * Initialize optional charges.
         */
        if (propertyRequest.getMaintenanceCharge() == null) {
            propertyRequest.setMaintenanceCharge(
                    BigDecimal.ZERO
            );
        }

        if (propertyRequest.getParkingCharge() == null) {
            propertyRequest.setParkingCharge(
                    BigDecimal.ZERO
            );
        }

        if (propertyRequest.getWaterCharge() == null) {
            propertyRequest.setWaterCharge(
                    BigDecimal.ZERO
            );
        }

        if (propertyRequest.getElectricityCharge() == null) {
            propertyRequest.setElectricityCharge(
                    BigDecimal.ZERO
            );
        }

        if (propertyRequest.getInternetCharge() == null) {
            propertyRequest.setInternetCharge(
                    BigDecimal.ZERO
            );
        }

        Property savedProperty =
                propertyRepository.save(propertyRequest);

        /*
         * Reload with landlord so the response does not
         * contain a Hibernate lazy proxy.
         */
        Property responseProperty =
                propertyRepository
                        .findByIdWithLandlord(savedProperty.getId())
                        .orElse(savedProperty);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(responseProperty));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal maxRent) {

        List<Property> properties =
                propertyRepository.findAllWithLandlord();

        if (city != null && !city.isBlank()) {

            properties = properties.stream()
                    .filter(property ->
                            property.getCity() != null &&
                            property.getCity()
                                    .equalsIgnoreCase(city))
                    .toList();
        }

        if (maxRent != null) {

            properties = properties.stream()
                    .filter(property ->
                            property.getMonthlyRent() != null &&
                            property.getMonthlyRent()
                                    .compareTo(maxRent) <= 0)
                    .toList();
        }

        List<PropertyResponse> responses =
                properties.stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @PathVariable UUID id) {

        return propertyRepository
                .findByIdWithLandlord(id)
                .map(property ->
                        ResponseEntity.ok(
                                toResponse(property)
                        )
                )
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable UUID id,
            @RequestBody Property propertyRequest,
            Authentication authentication) {

        Property property =
                propertyRepository
                        .findByIdWithLandlord(id)
                        .orElse(null);

        if (property == null) {
            return ResponseEntity.notFound().build();
        }

        User landlord = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        if (property.getLandlord() == null ||
                !property.getLandlord()
                        .getId()
                        .equals(landlord.getId())) {

            return ResponseEntity.status(
                    HttpStatus.FORBIDDEN
            ).build();
        }

        if (propertyRequest.getTitle() == null ||
                propertyRequest.getTitle().isBlank()) {

            throw new RuntimeException(
                    "Property title is required"
            );
        }

        if (propertyRequest.getDescription() == null ||
                propertyRequest.getDescription().isBlank()) {

            throw new RuntimeException(
                    "Property description is required"
            );
        }

        if (propertyRequest.getLocation() == null ||
                propertyRequest.getLocation().isBlank()) {

            throw new RuntimeException(
                    "Property location is required"
            );
        }

        if (propertyRequest.getCity() == null ||
                propertyRequest.getCity().isBlank()) {

            throw new RuntimeException(
                    "Property city is required"
            );
        }

        if (propertyRequest.getMonthlyRent() == null ||
                propertyRequest.getMonthlyRent()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Monthly rent must be greater than zero"
            );
        }

        if (propertyRequest.getSecurityDeposit() == null ||
                propertyRequest.getSecurityDeposit()
                        .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Security deposit cannot be negative"
            );
        }

        if (propertyRequest.getBedrooms() == null ||
                propertyRequest.getBedrooms() < 0) {

            throw new RuntimeException(
                    "Bedrooms must be zero or greater"
            );
        }

        if (propertyRequest.getBathrooms() == null ||
                propertyRequest.getBathrooms() < 0) {

            throw new RuntimeException(
                    "Bathrooms must be zero or greater"
            );
        }

        property.setTitle(
                propertyRequest.getTitle().trim()
        );

        property.setDescription(
                propertyRequest.getDescription().trim()
        );

        property.setLocation(
                propertyRequest.getLocation().trim()
        );

        property.setCity(
                propertyRequest.getCity().trim()
        );

        property.setMonthlyRent(
                propertyRequest.getMonthlyRent()
        );

        property.setSecurityDeposit(
                propertyRequest.getSecurityDeposit()
        );

        property.setBedrooms(
                propertyRequest.getBedrooms()
        );

        property.setBathrooms(
                propertyRequest.getBathrooms()
        );

        property.setPropertyType(
                propertyRequest.getPropertyType()
        );

        /*
         * Do not allow an arbitrary status from the frontend
         * to overwrite RENTED properties.
         */
        if (propertyRequest.getStatus() != null &&
                propertyRequest.getStatus() !=
                        PropertyStatus.RENTED) {

            property.setStatus(
                    propertyRequest.getStatus()
            );
        }

        property.setMaintenanceCharge(
                propertyRequest.getMaintenanceCharge() != null
                        ? propertyRequest.getMaintenanceCharge()
                        : BigDecimal.ZERO
        );

        property.setParkingCharge(
                propertyRequest.getParkingCharge() != null
                        ? propertyRequest.getParkingCharge()
                        : BigDecimal.ZERO
        );

        property.setWaterCharge(
                propertyRequest.getWaterCharge() != null
                        ? propertyRequest.getWaterCharge()
                        : BigDecimal.ZERO
        );

        property.setElectricityCharge(
                propertyRequest.getElectricityCharge() != null
                        ? propertyRequest.getElectricityCharge()
                        : BigDecimal.ZERO
        );

        property.setInternetCharge(
                propertyRequest.getInternetCharge() != null
                        ? propertyRequest.getInternetCharge()
                        : BigDecimal.ZERO
        );

        property.setAmenities(
                propertyRequest.getAmenities()
        );

        property.setRules(
                propertyRequest.getRules()
        );

        Property updatedProperty =
                propertyRepository.save(property);

        Property responseProperty =
                propertyRepository
                        .findByIdWithLandlord(
                                updatedProperty.getId()
                        )
                        .orElse(updatedProperty);

        return ResponseEntity.ok(
                toResponse(responseProperty)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateProperty(
            @PathVariable UUID id,
            Authentication authentication) {

        Property property =
                propertyRepository
                        .findByIdWithLandlord(id)
                        .orElse(null);

        if (property == null) {
            return ResponseEntity.notFound().build();
        }

        User landlord = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );

        if (property.getLandlord() == null ||
                !property.getLandlord()
                        .getId()
                        .equals(landlord.getId())) {

            return ResponseEntity.status(
                    HttpStatus.FORBIDDEN
            ).build();
        }

        property.setStatus(
                PropertyStatus.UNAVAILABLE
        );

        propertyRepository.save(property);

        return ResponseEntity.noContent().build();
    }

    private PropertyResponse toResponse(
            Property property) {

        User landlord = property.getLandlord();

        if (landlord == null) {
            throw new RuntimeException(
                    "Property landlord not found"
            );
        }

        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getLocation(),
                property.getCity(),
                property.getMonthlyRent(),
                property.getSecurityDeposit(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getPropertyType(),
                property.getStatus(),
                landlord.getId(),
                landlord.getName(),
                landlord.getEmail(),
                landlord.getPhone()
        );
    }
}