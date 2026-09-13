package com.trustrent.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trust_scores")
public class TrustScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Min(0) @Max(1000)
    @Column(nullable = false)
    private Integer score = 500;

    @Min(0) @Max(1000)
    @Column(name = "payment_score", nullable = false)
    private Integer paymentScore = 500;

    @Min(0) @Max(1000)
    @Column(name = "rental_history_score", nullable = false)
    private Integer rentalHistoryScore = 500;

    @Min(0) @Max(1000)
    @Column(name = "review_score", nullable = false)
    private Integer reviewScore = 500;

    @Min(0) @Max(1000)
    @Column(name = "care_score", nullable = false)
    private Integer careScore = 500;

    @Min(0) @Max(1000)
    @Column(name = "compliance_score", nullable = false)
    private Integer complianceScore = 500;

    @Min(0) @Max(1000)
    @Column(name = "complaint_score", nullable = false)
    private Integer complaintScore = 500;

    @Column(name = "last_calculated_at", nullable = false)
    private OffsetDateTime lastCalculatedAt = OffsetDateTime.now();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Setters
    public void setUser(User user) { this.user = user; }
    public void setScore(Integer score) { this.score = score; }
    public void setPaymentScore(Integer paymentScore) { this.paymentScore = paymentScore; }
    public void setRentalHistoryScore(Integer rentalHistoryScore) { this.rentalHistoryScore = rentalHistoryScore; }
    public void setReviewScore(Integer reviewScore) { this.reviewScore = reviewScore; }
    public void setCareScore(Integer careScore) { this.careScore = careScore; }
    public void setComplianceScore(Integer complianceScore) { this.complianceScore = complianceScore; }
    public void setComplaintScore(Integer complaintScore) { this.complaintScore = complaintScore; }
    public void setLastCalculatedAt(OffsetDateTime lastCalculatedAt) { this.lastCalculatedAt = lastCalculatedAt; }
    // Getters
    public Integer getScore() { return score; }
    public Integer getPaymentScore() { return paymentScore; }
    public Integer getRentalHistoryScore() { return rentalHistoryScore; }
    public Integer getReviewScore() { return reviewScore; }
    public Integer getCareScore() { return careScore; }
    public Integer getComplianceScore() { return complianceScore; }
    public Integer getComplaintScore() { return complaintScore; }
    public OffsetDateTime getLastCalculatedAt() { return lastCalculatedAt; }
}