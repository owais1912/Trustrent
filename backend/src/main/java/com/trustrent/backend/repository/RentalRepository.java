package com.trustrent.backend.repository;

import com.trustrent.backend.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RentalRepository extends JpaRepository<Rental, UUID> {

    List<Rental> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);

    List<Rental> findByLandlordIdOrderByCreatedAtDesc(UUID landlordId);

    boolean existsByApplicationId(UUID applicationId);
}