package com.trustrent.backend.service;

import com.trustrent.backend.dto.RentalApplicationRequest;
import com.trustrent.backend.entity.Property;
import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.RentalApplication;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.ApplicationStatus;
import com.trustrent.backend.enums.PropertyStatus;
import com.trustrent.backend.enums.RentalStatus;
import com.trustrent.backend.repository.PropertyRepository;
import com.trustrent.backend.repository.RentalApplicationRepository;
import com.trustrent.backend.repository.RentalRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RentalApplicationService {

    private final RentalApplicationRepository applicationRepository;
    private final PropertyRepository propertyRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    public RentalApplicationService(
            RentalApplicationRepository applicationRepository,
            PropertyRepository propertyRepository,
            RentalRepository rentalRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.propertyRepository = propertyRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
    }

    public RentalApplication applyForProperty(
            String email,
            RentalApplicationRequest request
    ) {

        User tenant = findUserByEmail(email);

        if (!"TENANT".equals(tenant.getRole().name())) {
            throw new RuntimeException(
                    "Only tenants can apply for properties"
            );
        }

        Property property = propertyRepository
                .findById(request.propertyId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Property not found"
                        )
                );

        if (property.getStatus() != PropertyStatus.AVAILABLE) {
            throw new RuntimeException(
                    "This property is not available"
            );
        }

        boolean alreadyApplied =
                applicationRepository
                        .existsByPropertyIdAndTenantId(
                                property.getId(),
                                tenant.getId()
                        );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this property"
            );
        }

        RentalApplication application =
                new RentalApplication();

        application.setProperty(property);
        application.setTenant(tenant);
        application.setStatus(ApplicationStatus.PENDING);
        application.setMessage(request.message);

        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
public List<RentalApplication> getTenantApplications(String email) {
    User tenant = findUserByEmail(email);

    return applicationRepository
            .findTenantApplicationsWithDetails(tenant.getId());
}

    @Transactional(readOnly = true)
public List<RentalApplication> getLandlordApplications(String email) {
    User landlord = findUserByEmail(email);

    return applicationRepository
            .findLandlordApplicationsWithDetails(landlord.getId());
}

    public Rental acceptApplication(
            String email,
            UUID applicationId
    ) {

        User landlord = findUserByEmail(email);

        RentalApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Application not found"
                                )
                        );

        Property property =
                application.getProperty();

        if (property == null) {
            throw new RuntimeException(
                    "Application property not found"
            );
        }

        if (property.getLandlord() == null ||
                !property.getLandlord()
                        .getId()
                        .equals(landlord.getId())) {

            throw new RuntimeException(
                    "You are not authorized to manage this application"
            );
        }

        if (application.getStatus() !=
                ApplicationStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending applications can be accepted"
            );
        }

        if (property.getStatus() !=
                PropertyStatus.AVAILABLE) {

            throw new RuntimeException(
                    "Property is no longer available"
            );
        }

        if (rentalRepository.existsByApplicationId(
                application.getId()
        )) {

            throw new RuntimeException(
                    "Rental already exists for this application"
            );
        }

        application.setStatus(
                ApplicationStatus.ACCEPTED
        );

        applicationRepository.save(application);

        Rental rental = new Rental();

        rental.setProperty(property);
        rental.setTenant(application.getTenant());
        rental.setLandlord(landlord);
        rental.setApplication(application);
        rental.setMonthlyRent(property.getMonthlyRent());
        rental.setStatus(RentalStatus.ACTIVE);
        rental.setStartDate(LocalDate.now());

        Rental savedRental =
                rentalRepository.save(rental);

        property.setStatus(PropertyStatus.RENTED);

        propertyRepository.save(property);

        List<RentalApplication> otherApplications =
                applicationRepository
                        .findByPropertyIdAndStatus(
                                property.getId(),
                                ApplicationStatus.PENDING
                        );

        for (RentalApplication other :
                otherApplications) {

            if (!other.getId()
                    .equals(application.getId())) {

                other.setStatus(
                        ApplicationStatus.REJECTED
                );
            }
        }

        if (!otherApplications.isEmpty()) {
            applicationRepository.saveAll(
                    otherApplications
            );
        }

        return savedRental;
    }

    public RentalApplication rejectApplication(
            String email,
            UUID applicationId
    ) {

        User landlord = findUserByEmail(email);

        RentalApplication application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Application not found"
                                )
                        );

        Property property =
                application.getProperty();

        if (property == null ||
                property.getLandlord() == null ||
                !property.getLandlord()
                        .getId()
                        .equals(landlord.getId())) {

            throw new RuntimeException(
                    "You are not authorized to manage this application"
            );
        }

        if (application.getStatus() !=
                ApplicationStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending applications can be rejected"
            );
        }

        application.setStatus(
                ApplicationStatus.REJECTED
        );

        return applicationRepository.save(application);
    }

    private User findUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }
}