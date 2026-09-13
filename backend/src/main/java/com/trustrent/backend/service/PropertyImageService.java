package com.trustrent.backend.service;

import com.trustrent.backend.entity.Property;
import com.trustrent.backend.entity.PropertyImage;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.repository.PropertyImageRepository;
import com.trustrent.backend.repository.PropertyRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PropertyImageService {

    private static final int MAX_IMAGES_PER_PROPERTY = 10;

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyImageService(
            PropertyImageRepository propertyImageRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository) {

        this.propertyImageRepository = propertyImageRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PropertyImage> getPropertyImages(UUID propertyId) {

        if (!propertyRepository.existsById(propertyId)) {
            throw new RuntimeException("Property not found");
        }

        return propertyImageRepository
                .findByPropertyIdOrderByDisplayOrderAsc(propertyId);
    }

    @Transactional
    public PropertyImage addImage(
            String landlordEmail,
            UUID propertyId,
            String imageUrl,
            Integer displayOrder) {

        User landlord = findUserByEmail(landlordEmail);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found"));

        verifyOwnership(property, landlord);

        if (imageUrl == null || imageUrl.isBlank()) {
            throw new RuntimeException("Image URL is required");
        }

        if (imageUrl.length() > 2000) {
            throw new RuntimeException("Image URL is too long");
        }

        long imageCount =
                propertyImageRepository.countByPropertyId(propertyId);

        if (imageCount >= MAX_IMAGES_PER_PROPERTY) {
            throw new RuntimeException(
                    "Maximum of " + MAX_IMAGES_PER_PROPERTY
                            + " images allowed per property");
        }

        PropertyImage image = new PropertyImage();

        image.setProperty(property);
        image.setImageUrl(imageUrl.trim());
        image.setDisplayOrder(
                displayOrder != null && displayOrder >= 0
                        ? displayOrder
                        : (int) imageCount
        );

        return propertyImageRepository.save(image);
    }

    @Transactional
    public void deleteImage(
            String landlordEmail,
            UUID imageId) {

        User landlord = findUserByEmail(landlordEmail);

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() ->
                        new RuntimeException("Image not found"));

        verifyOwnership(image.getProperty(), landlord);

        propertyImageRepository.delete(image);
    }

    private void verifyOwnership(
            Property property,
            User landlord) {

        if (!property.getLandlord().getId()
                .equals(landlord.getId())) {

            throw new RuntimeException(
                    "You are not authorized to manage images for this property");
        }
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}