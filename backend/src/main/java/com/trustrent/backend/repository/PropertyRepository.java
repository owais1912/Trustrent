package com.trustrent.backend.repository;

import com.trustrent.backend.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID> {

    @Query("""
        SELECT p
        FROM Property p
        JOIN FETCH p.landlord
        ORDER BY p.createdAt DESC
        """)
    List<Property> findAllWithLandlord();

    @Query("""
        SELECT p
        FROM Property p
        JOIN FETCH p.landlord
        WHERE p.id = :id
        """)
    Optional<Property> findByIdWithLandlord(@Param("id") UUID id);

    @Query("""
        SELECT p
        FROM Property p
        JOIN FETCH p.landlord
        WHERE LOWER(p.city) = LOWER(:city)
        """)
    List<Property> findByCityWithLandlord(@Param("city") String city);

    @Query("""
        SELECT p
        FROM Property p
        JOIN FETCH p.landlord
        WHERE p.monthlyRent <= :maxRent
        """)
    List<Property> findByMaxRentWithLandlord(
            @Param("maxRent") BigDecimal maxRent
    );

    @Query("""
        SELECT p
        FROM Property p
        JOIN FETCH p.landlord
        WHERE LOWER(p.city) = LOWER(:city)
          AND p.monthlyRent <= :maxRent
        """)
    List<Property> findByCityAndMaxRentWithLandlord(
            @Param("city") String city,
            @Param("maxRent") BigDecimal maxRent
    );

    List<Property> findByCityIgnoreCaseAndMonthlyRentLessThanEqual(
            String city,
            BigDecimal maxRent
    );

    List<Property> findByCityIgnoreCase(String city);

    List<Property> findByMonthlyRentLessThanEqual(BigDecimal maxRent);
}