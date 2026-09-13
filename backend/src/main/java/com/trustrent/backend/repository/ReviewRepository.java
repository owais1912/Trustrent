package com.trustrent.backend.repository;

import com.trustrent.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository
        extends JpaRepository<Review, UUID> {

    boolean existsByRentalIdAndReviewerIdAndReviewedUserId(
            UUID rentalId,
            UUID reviewerId,
            UUID reviewedUserId
    );

    List<Review> findByReviewerIdOrderByCreatedAtDesc(
            UUID reviewerId
    );

    List<Review> findByReviewedUserIdOrderByCreatedAtDesc(
            UUID reviewedUserId
    );

    List<Review> findByRentalIdOrderByCreatedAtDesc(
            UUID rentalId
    );
}