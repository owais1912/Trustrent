package com.trustrent.backend.service;

import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.repository.RentalRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    public RentalService(
            RentalRepository rentalRepository,
            UserRepository userRepository) {

        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Rental> getTenantRentals(String email) {

        User tenant = findUserByEmail(email);

        return rentalRepository
                .findByTenantIdOrderByCreatedAtDesc(tenant.getId());
    }

    @Transactional(readOnly = true)
    public List<Rental> getLandlordRentals(String email) {

        User landlord = findUserByEmail(email);

        return rentalRepository
                .findByLandlordIdOrderByCreatedAtDesc(landlord.getId());
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}