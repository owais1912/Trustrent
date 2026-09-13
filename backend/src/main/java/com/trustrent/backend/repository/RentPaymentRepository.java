package com.trustrent.backend.repository;

import com.trustrent.backend.entity.RentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface RentPaymentRepository extends JpaRepository<RentPayment, UUID> {
}
