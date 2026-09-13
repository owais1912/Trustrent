package com.trustrent.backend.service;

import com.trustrent.backend.entity.TrustEvent;
import com.trustrent.backend.entity.TrustScore;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.enums.TrustEventType;
import com.trustrent.backend.repository.TrustEventRepository;
import com.trustrent.backend.repository.TrustScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class TrustEngineService {

    private final TrustScoreRepository trustScoreRepository;
    private final TrustEventRepository trustEventRepository;

    public TrustEngineService(TrustScoreRepository trustScoreRepository, TrustEventRepository trustEventRepository) {
        this.trustScoreRepository = trustScoreRepository;
        this.trustEventRepository = trustEventRepository;
    }

    @Transactional
    public void recordEvent(User user, TrustEventType eventType, String referenceType, java.util.UUID referenceId, int scoreChange, String description) {
        // 1. Record immutable trust event
        TrustEvent event = new TrustEvent();
        event.setUser(user);
        event.setEventType(eventType);
        event.setReferenceType(referenceType);
        event.setReferenceId(referenceId);
        event.setScoreChange(scoreChange);
        event.setDescription(description);
        trustEventRepository.save(event);

        // 2. Update category and overall score (Bounded between 0 and 1000)
        TrustScore trustScore = trustScoreRepository.findByUser(user)
                .orElseGet(() -> {
                    TrustScore newScore = new TrustScore();
                    newScore.setUser(user);
                    return newScore;
                });

        int updatedOverall = Math.max(0, Math.min(1000, trustScore.getScore() + scoreChange));
        trustScore.setScore(updatedOverall);

        // Map specific event categories
        switch (eventType) {
            case RENT_PAID_EARLY:
            case RENT_PAID_ON_TIME:
            case RENT_PAID_LATE:
            case RENT_MISSED:
                trustScore.setPaymentScore(Math.max(0, Math.min(1000, trustScore.getPaymentScore() + scoreChange)));
                break;
            case POSITIVE_REVIEW:
            case NEGATIVE_REVIEW:
                trustScore.setReviewScore(Math.max(0, Math.min(1000, trustScore.getReviewScore() + scoreChange)));
                break;
            default:
                break;
        }

        trustScore.setLastCalculatedAt(OffsetDateTime.now());
        trustScoreRepository.save(trustScore);
    }
}