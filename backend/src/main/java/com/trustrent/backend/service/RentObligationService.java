package com.trustrent.backend.service;

import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.RentalPayment;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.PaymentStatus;
import com.trustrent.backend.enums.RentalStatus;
import com.trustrent.backend.enums.TrustEventType;
import com.trustrent.backend.repository.RentalPaymentRepository;
import com.trustrent.backend.repository.RentalRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class RentObligationService {

    private final RentalRepository rentalRepository;
    private final RentalPaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final TrustEngineService trustEngineService;

    public RentObligationService(
            RentalRepository rentalRepository,
            RentalPaymentRepository paymentRepository,
            UserRepository userRepository,
            TrustEngineService trustEngineService
    ) {
        this.rentalRepository = rentalRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.trustEngineService = trustEngineService;
    }

    /**
     * Creates a MISSED payment record for active rentals
     * when the current month's rent is past its due date.
     *
     * Due date = 5th day of the payment month.
     */
    public void generateCurrentMonthObligations() {

        LocalDate today = LocalDate.now();
        LocalDate paymentMonth =
                today.withDayOfMonth(1);

        LocalDate dueDate =
                paymentMonth.withDayOfMonth(5);

        // Do not mark the current month as missed
        // before the due date.
        if (!today.isAfter(dueDate)) {
            return;
        }

        List<Rental> rentals =
                rentalRepository.findAll();

        for (Rental rental : rentals) {

            if (rental.getStatus() != RentalStatus.ACTIVE) {
                continue;
            }

            if (rental.getTenant() == null) {
                continue;
            }

            if (paymentRepository.existsByRentalIdAndPaymentMonth(
                    rental.getId(),
                    paymentMonth
            )) {
                continue;
            }

            createMissedPayment(
                    rental,
                    paymentMonth,
                    dueDate
            );
        }
    }

    /**
     * Converts existing unpaid/placeholder ON_TIME records
     * into MISSED records after the due date.
     */
    public void markOverduePaymentsAsMissed() {

        LocalDate today = LocalDate.now();

        List<RentalPayment> overduePayments =
                paymentRepository.findByStatusAndDueDateBefore(
                        PaymentStatus.ON_TIME,
                        today
                );

        for (RentalPayment payment : overduePayments) {

            if (payment.getPaidDate() != null) {
                continue;
            }

            payment.setStatus(PaymentStatus.MISSED);

            RentalPayment saved =
                    paymentRepository.save(payment);

            recordMissedEvent(saved);
        }
    }

    private void createMissedPayment(
            Rental rental,
            LocalDate paymentMonth,
            LocalDate dueDate
    ) {

        if (paymentRepository.existsByRentalIdAndPaymentMonth(
                rental.getId(),
                paymentMonth
        )) {
            return;
        }

        BigDecimal amount =
                rental.getMonthlyRent();

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        RentalPayment payment =
                new RentalPayment();

        payment.setRental(rental);
        payment.setTenant(rental.getTenant());
        payment.setPaymentMonth(paymentMonth);
        payment.setDueDate(dueDate);
        payment.setPaidDate(null);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.MISSED);

        RentalPayment saved =
                paymentRepository.save(payment);

        recordMissedEvent(saved);
    }

    private void recordMissedEvent(
            RentalPayment payment
    ) {

        User tenant =
                payment.getTenant();

        if (tenant == null) {
            return;
        }

        trustEngineService.recordEvent(
                tenant,
                TrustEventType.RENT_MISSED,
                "RENTAL_PAYMENT",
                payment.getId(),
                -20,
                "Monthly rent payment was missed"
        );
    }
}