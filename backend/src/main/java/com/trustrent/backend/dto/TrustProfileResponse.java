package com.trustrent.backend.dto;

import com.trustrent.backend.entity.TrustEvent;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class TrustProfileResponse {

    public UUID userId;
    public Integer overallScore;
    public Integer paymentScore;
    public Integer rentalHistoryScore;
    public Integer reviewScore;
    public Integer careScore;
    public Integer complianceScore;
    public Integer complaintScore;
    public OffsetDateTime lastCalculatedAt;
    public List<TrustEvent> recentEvents;

    public TrustProfileResponse(
            UUID userId,
            Integer overallScore,
            Integer paymentScore,
            Integer rentalHistoryScore,
            Integer reviewScore,
            Integer careScore,
            Integer complianceScore,
            Integer complaintScore,
            OffsetDateTime lastCalculatedAt,
            List<TrustEvent> recentEvents) {

        this.userId = userId;
        this.overallScore = overallScore;
        this.paymentScore = paymentScore;
        this.rentalHistoryScore = rentalHistoryScore;
        this.reviewScore = reviewScore;
        this.careScore = careScore;
        this.complianceScore = complianceScore;
        this.complaintScore = complaintScore;
        this.lastCalculatedAt = lastCalculatedAt;
        this.recentEvents = recentEvents;
    }
}