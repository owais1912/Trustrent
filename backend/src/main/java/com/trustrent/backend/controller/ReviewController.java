package com.trustrent.backend.controller;

import com.trustrent.backend.dto.ReviewRequest;
import com.trustrent.backend.entity.Review;
import com.trustrent.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('TENANT','LANDLORD')")
    public Review createReview(
            Authentication authentication,
            @Valid @RequestBody ReviewRequest request
    ) {

        return reviewService.createReview(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('TENANT','LANDLORD')")
    public List<Review> getMyReviews(
            Authentication authentication
    ) {

        return reviewService.getMyReviews(
                authentication.getName()
        );
    }

    @GetMapping("/received")
    @PreAuthorize("hasAnyRole('TENANT','LANDLORD')")
    public List<Review> getReceivedReviews(
            Authentication authentication
    ) {

        return reviewService.getReceivedReviews(
                authentication.getName()
        );
    }

    @GetMapping("/rental/{rentalId}")
    @PreAuthorize("hasAnyRole('TENANT','LANDLORD')")
    public List<Review> getRentalReviews(
            Authentication authentication,
            @PathVariable UUID rentalId
    ) {

        return reviewService.getRentalReviews(
                authentication.getName(),
                rentalId
        );
    }
}