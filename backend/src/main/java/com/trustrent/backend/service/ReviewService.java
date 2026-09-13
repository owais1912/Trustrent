package com.trustrent.backend.service;

import com.trustrent.backend.dto.ReviewRequest;
import com.trustrent.backend.entity.Rental;
import com.trustrent.backend.entity.Review;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.RentalStatus;
import com.trustrent.backend.enums.TrustEventType;
import com.trustrent.backend.repository.RentalRepository;
import com.trustrent.backend.repository.ReviewRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final TrustEngineService trustEngineService;

    public ReviewService(
            ReviewRepository reviewRepository,
            RentalRepository rentalRepository,
            UserRepository userRepository,
            TrustEngineService trustEngineService
    ) {
        this.reviewRepository = reviewRepository;
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.trustEngineService = trustEngineService;
    }

    public Review createReview(String email, ReviewRequest request) {

        User reviewer = findUserByEmail(email);

        Rental rental = rentalRepository.findById(request.rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (rental.getStatus() == RentalStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled rentals cannot be reviewed"
            );
        }

        boolean isTenant =
                rental.getTenant() != null &&
                rental.getTenant().getId().equals(reviewer.getId());

        boolean isLandlord =
                rental.getLandlord() != null &&
                rental.getLandlord().getId().equals(reviewer.getId());

        if (!isTenant && !isLandlord) {
            throw new RuntimeException(
                    "You are not authorized to review this rental"
            );
        }

        User reviewedUser;

        if (isTenant) {
            reviewedUser = rental.getLandlord();
        } else {
            reviewedUser = rental.getTenant();
        }

        if (reviewedUser == null) {
            throw new RuntimeException(
                    "The user being reviewed could not be found"
            );
        }

        boolean alreadyReviewed =
                reviewRepository
                        .existsByRentalIdAndReviewerIdAndReviewedUserId(
                                rental.getId(),
                                reviewer.getId(),
                                reviewedUser.getId()
                        );

        if (alreadyReviewed) {
            throw new RuntimeException(
                    "You have already reviewed this user for this rental"
            );
        }

        Review review = new Review();

        review.setRental(rental);
        review.setReviewer(reviewer);
        review.setReviewedUser(reviewedUser);

        review.setMaintenanceRating(
                request.maintenanceRating
        );

        review.setResponsivenessRating(
                request.responsivenessRating
        );

        review.setCommunicationRating(
                request.communicationRating
        );

        review.setPropertyCareRating(
                request.propertyCareRating
        );

        review.setRuleComplianceRating(
                request.ruleComplianceRating
        );

        review.setOverallRating(
                request.overallRating
        );

        review.setComment(
                request.comment == null
                        ? null
                        : request.comment.trim()
        );

        Review saved = reviewRepository.save(review);

        recordTrustEvent(
                reviewedUser,
                saved,
                request.overallRating
        );

        return saved;
    }

    private void recordTrustEvent(
            User reviewedUser,
            Review review,
            int rating
    ) {

        if (rating >= 4) {

            trustEngineService.recordEvent(
                    reviewedUser,
                    TrustEventType.POSITIVE_REVIEW,
                    "REVIEW",
                    review.getId(),
                    10,
                    "Received a positive rental review"
            );

        } else if (rating <= 2) {

            trustEngineService.recordEvent(
                    reviewedUser,
                    TrustEventType.NEGATIVE_REVIEW,
                    "REVIEW",
                    review.getId(),
                    -10,
                    "Received a negative rental review"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<Review> getMyReviews(String email) {

        User reviewer = findUserByEmail(email);

        return reviewRepository
                .findByReviewerIdOrderByCreatedAtDesc(
                        reviewer.getId()
                );
    }

    @Transactional(readOnly = true)
    public List<Review> getReceivedReviews(String email) {

        User user = findUserByEmail(email);

        return reviewRepository
                .findByReviewedUserIdOrderByCreatedAtDesc(
                        user.getId()
                );
    }

    @Transactional(readOnly = true)
    public List<Review> getRentalReviews(
            String email,
            UUID rentalId
    ) {

        User user = findUserByEmail(email);

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        boolean isTenant =
                rental.getTenant() != null &&
                rental.getTenant().getId().equals(user.getId());

        boolean isLandlord =
                rental.getLandlord() != null &&
                rental.getLandlord().getId().equals(user.getId());

        if (!isTenant && !isLandlord) {
            throw new RuntimeException(
                    "You are not authorized to view these reviews"
            );
        }

        return reviewRepository
                .findByRentalIdOrderByCreatedAtDesc(
                        rentalId
                );
    }

    private User findUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );
    }
}