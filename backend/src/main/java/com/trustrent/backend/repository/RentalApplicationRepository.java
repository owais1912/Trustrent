package com.trustrent.backend.repository;

import com.trustrent.backend.entity.RentalApplication;
import com.trustrent.backend.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RentalApplicationRepository
        extends JpaRepository<RentalApplication, UUID> {

    boolean existsByPropertyIdAndTenantId(
            UUID propertyId,
            UUID tenantId
    );

    @Query("""
        SELECT a
        FROM RentalApplication a
        JOIN FETCH a.property
        JOIN FETCH a.tenant
        WHERE a.tenant.id = :tenantId
        ORDER BY a.appliedAt DESC
        """)
    List<RentalApplication> findTenantApplicationsWithDetails(
            @Param("tenantId") UUID tenantId
    );

    @Query("""
        SELECT a
        FROM RentalApplication a
        JOIN FETCH a.property
        JOIN FETCH a.tenant
        WHERE a.property.landlord.id = :landlordId
        ORDER BY a.appliedAt DESC
        """)
    List<RentalApplication> findLandlordApplicationsWithDetails(
            @Param("landlordId") UUID landlordId
    );

    List<RentalApplication> findByTenantIdOrderByAppliedAtDesc(
            UUID tenantId
    );

    List<RentalApplication> findByPropertyLandlordIdOrderByAppliedAtDesc(
            UUID landlordId
    );

    List<RentalApplication> findByPropertyIdAndStatus(
            UUID propertyId,
            ApplicationStatus status
    );
}