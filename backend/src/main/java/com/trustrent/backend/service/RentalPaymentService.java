package com.trustrent.backend.service;

import com.trustrent.backend.dto.RentalPaymentRequest;
import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.RentalPayment;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.PaymentStatus;
import com.trustrent.backend.enums.TrustEventType;
import com.trustrent.backend.repository.RentalPaymentRepository;
import com.trustrent.backend.repository.RentalRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RentalPaymentService {

    private final RentalPaymentRepository paymentRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final TrustEngineService trustEngineService;

    public RentalPaymentService(
            RentalPaymentRepository paymentRepository,
            RentalRepository rentalRepository,
            UserRepository userRepository,
            TrustEngineService trustEngineService
    ) {
        this.paymentRepository = paymentRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.trustEngineService = trustEngineService;
    }

    public RentalPayment recordPayment(
            String email,
            RentalPaymentRequest request
    ) {

        User tenant = findUserByEmail(email);

        Rental rental = rentalRepository
                .findById(request.rentalId)
                .orElseThrow(() ->
                        new RuntimeException("Rental not found")
                );

        if (rental.getTenant() == null ||
                !rental.getTenant()
                        .getId()
                        .equals(tenant.getId())) {

            throw new RuntimeException(
                    "You are not authorized to record payment for this rental"
            );
        }

        if (request.paymentMonth == null) {
            throw new RuntimeException(
                    "Payment month is required"
            );
        }

        if (request.paidDate == null) {
            throw new RuntimeException(
                    "Paid date is required"
            );
        }

        if (request.paidDate.isAfter(LocalDate.now())) {
            throw new RuntimeException(
                    "Paid date cannot be in the future"
            );
        }

        LocalDate paymentMonth =
                request.paymentMonth.withDayOfMonth(1);

        LocalDate currentMonth =
                LocalDate.now().withDayOfMonth(1);

        if (paymentMonth.isAfter(currentMonth)) {
            throw new RuntimeException(
                    "Payment month cannot be in the future"
            );
        }

        if (rental.getStatus() != null &&
                !rental.getStatus().name().equals("ACTIVE")) {

            throw new RuntimeException(
                    "Payments can only be recorded for active rentals"
            );
        }

        boolean exists =
                paymentRepository.existsByRentalIdAndPaymentMonth(
                        rental.getId(),
                        paymentMonth
                );

        if (exists) {
            throw new RuntimeException(
                    "Payment for this month already exists"
            );
        }

        LocalDate dueDate =
                paymentMonth.withDayOfMonth(5);

        PaymentStatus status;

        if (request.paidDate.isBefore(dueDate)) {

            status = PaymentStatus.EARLY;

        } else if (request.paidDate.equals(dueDate)) {

            status = PaymentStatus.ON_TIME;

        } else {

            status = PaymentStatus.LATE;
        }

        BigDecimal amount =
                rental.getMonthlyRent();

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Invalid rental monthly rent"
            );
        }

        RentalPayment payment =
                new RentalPayment();

        payment.setRental(rental);
        payment.setTenant(tenant);
        payment.setPaymentMonth(paymentMonth);
        payment.setDueDate(dueDate);
        payment.setPaidDate(request.paidDate);
        payment.setAmount(amount);
        payment.setStatus(status);

        payment.setTransactionReference(
                request.transactionReference
        );

        payment.setNotes(
                request.notes
        );

        RentalPayment saved =
                paymentRepository.save(payment);

        recordTrustEvent(
                tenant,
                saved,
                status
        );

        return saved;
    }

    private void recordTrustEvent(
            User tenant,
            RentalPayment payment,
            PaymentStatus status
    ) {

        if (status == PaymentStatus.EARLY) {

            trustEngineService.recordEvent(
                    tenant,
                    TrustEventType.RENT_PAID_EARLY,
                    "RENTAL_PAYMENT",
                    payment.getId(),
                    10,
                    "Rent paid early"
            );

        } else if (status == PaymentStatus.ON_TIME) {

            trustEngineService.recordEvent(
                    tenant,
                    TrustEventType.RENT_PAID_ON_TIME,
                    "RENTAL_PAYMENT",
                    payment.getId(),
                    5,
                    "Rent paid on time"
            );

        } else if (status == PaymentStatus.LATE) {

            trustEngineService.recordEvent(
                    tenant,
                    TrustEventType.RENT_PAID_LATE,
                    "RENTAL_PAYMENT",
                    payment.getId(),
                    -10,
                    "Rent paid late"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<RentalPayment> getRentalPaymentHistory(
            String email,
            UUID rentalId
    ) {

        User user =
                findUserByEmail(email);

        Rental rental =
                rentalRepository
                        .findById(rentalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rental not found"
                                )
                        );

        boolean isTenant =
                rental.getTenant() != null &&
                rental.getTenant()
                        .getId()
                        .equals(user.getId());

        boolean isLandlord =
                rental.getLandlord() != null &&
                rental.getLandlord()
                        .getId()
                        .equals(user.getId());

        if (!isTenant && !isLandlord) {

            throw new RuntimeException(
                    "You are not authorized to view these payments"
            );
        }

        return paymentRepository
                .findByRentalIdOrderByPaymentMonthDesc(
                        rentalId
                );
    }

    @Transactional(readOnly = true)
    public List<RentalPayment> getTenantPaymentHistory(
            String email
    ) {

        User tenant =
                findUserByEmail(email);

        return paymentRepository
                .findByTenantIdOrderByPaymentMonthDesc(
                        tenant.getId()
                );
    }

    private User findUserByEmail(
            String email
    ) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}