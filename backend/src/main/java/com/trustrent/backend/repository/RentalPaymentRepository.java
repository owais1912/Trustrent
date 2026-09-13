package com.trustrent.backend.repository;

import com.trustrent.backend.entity.RentalPayment;
import com.trustrent.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RentalPaymentRepository
        extends JpaRepository<RentalPayment, UUID> {

    boolean existsByRentalIdAndPaymentMonth(
            UUID rentalId,
            LocalDate paymentMonth
    );

    Optional<RentalPayment> findByRentalIdAndPaymentMonth(
            UUID rentalId,
            LocalDate paymentMonth
    );

    List<RentalPayment> findByRentalIdOrderByPaymentMonthDesc(
            UUID rentalId
    );

    List<RentalPayment> findByTenantIdOrderByPaymentMonthDesc(
            UUID tenantId
    );

    List<RentalPayment> findByStatusAndDueDateBefore(
            PaymentStatus status,
            LocalDate date
    );
}