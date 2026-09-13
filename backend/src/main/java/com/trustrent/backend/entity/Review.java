package com.trustrent.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_review_rental_reviewer_reviewed",
        columnNames = {"rental_id", "reviewer_id", "reviewed_user_id"}
    ),
    indexes = {
        @Index(
            name = "idx_reviews_reviewed",
            columnList = "reviewed_user_id, created_at DESC"
        ),
        @Index(
            name = "idx_reviews_reviewer",
            columnList = "reviewer_id"
        ),
        @Index(
            name = "idx_reviews_rental",
            columnList = "rental_id"
        )
    }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id", nullable = false)
    private Rental rental;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    private User reviewedUser;

    @Min(1)
    @Max(5)
    @Column(name = "maintenance_rating")
    private Integer maintenanceRating;

    @Min(1)
    @Max(5)
    @Column(name = "responsiveness_rating")
    private Integer responsivenessRating;

    @Min(1)
    @Max(5)
    @Column(name = "communication_rating")
    private Integer communicationRating;

    @Min(1)
    @Max(5)
    @Column(name = "property_care_rating")
    private Integer propertyCareRating;

    @Min(1)
    @Max(5)
    @Column(name = "rule_compliance_rating")
    private Integer ruleComplianceRating;

    @Min(1)
    @Max(5)
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    @Column(columnDefinition = "text")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public Rental getRental() {
        return rental;
    }

    public void setRental(Rental rental) {
        this.rental = rental;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public User getReviewedUser() {
        return reviewedUser;
    }

    public void setReviewedUser(User reviewedUser) {
        this.reviewedUser = reviewedUser;
    }

    public Integer getMaintenanceRating() {
        return maintenanceRating;
    }

    public void setMaintenanceRating(Integer maintenanceRating) {
        this.maintenanceRating = maintenanceRating;
    }

    public Integer getResponsivenessRating() {
        return responsivenessRating;
    }

    public void setResponsivenessRating(Integer responsivenessRating) {
        this.responsivenessRating = responsivenessRating;
    }

    public Integer getCommunicationRating() {
        return communicationRating;
    }

    public void setCommunicationRating(Integer communicationRating) {
        this.communicationRating = communicationRating;
    }

    public Integer getPropertyCareRating() {
        return propertyCareRating;
    }

    public void setPropertyCareRating(Integer propertyCareRating) {
        this.propertyCareRating = propertyCareRating;
    }

    public Integer getRuleComplianceRating() {
        return ruleComplianceRating;
    }

    public void setRuleComplianceRating(Integer ruleComplianceRating) {
        this.ruleComplianceRating = ruleComplianceRating;
    }

    public Integer getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}