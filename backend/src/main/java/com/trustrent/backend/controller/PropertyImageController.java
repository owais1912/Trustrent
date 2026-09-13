package com.trustrent.backend.controller;

import com.trustrent.backend.entity.PropertyImage;
import com.trustrent.backend.service.PropertyImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/properties")
public class PropertyImageController {

    private final PropertyImageService propertyImageService;

    public PropertyImageController(
            PropertyImageService propertyImageService) {

        this.propertyImageService = propertyImageService;
    }

    @GetMapping("/{propertyId}/images")
    public ResponseEntity<List<Map<String, Object>>> getImages(
            @PathVariable UUID propertyId) {

        List<Map<String, Object>> response =
                propertyImageService
                        .getPropertyImages(propertyId)
                        .stream()
                        .map(this::imageResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{propertyId}/images")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> addImage(
            @PathVariable UUID propertyId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        String imageUrl =
                request.get("imageUrl") != null
                        ? request.get("imageUrl").toString()
                        : null;

        Integer displayOrder = null;

        if (request.get("displayOrder") != null) {
            try {
                displayOrder =
                        Integer.valueOf(
                                request.get("displayOrder").toString());
            } catch (NumberFormatException exception) {
                throw new RuntimeException(
                        "Display order must be a number");
            }
        }

        PropertyImage image =
                propertyImageService.addImage(
                        authentication.getName(),
                        propertyId,
                        imageUrl,
                        displayOrder
                );

        return ResponseEntity.ok(imageResponse(image));
    }

    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Map<String, Object>> deleteImage(
            @PathVariable UUID imageId,
            Authentication authentication) {

        propertyImageService.deleteImage(
                authentication.getName(),
                imageId
        );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("message", "Image deleted successfully");

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> imageResponse(
            PropertyImage image) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("id", image.getId());
        response.put(
                "propertyId",
                image.getProperty().getId()
        );
        response.put(
                "imageUrl",
                image.getImageUrl()
        );
        response.put(
                "displayOrder",
                image.getDisplayOrder()
        );
        response.put(
                "createdAt",
                image.getCreatedAt()
        );

        return response;
    }
}