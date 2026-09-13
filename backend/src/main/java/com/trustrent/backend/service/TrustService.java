package com.trustrent.backend.service;

import com.trustrent.backend.dto.TrustProfileResponse;
import com.trustrent.backend.entity.TrustScore;
import com.trustrent.backend.entity.TrustEvent;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.repository.TrustScoreRepository;
import com.trustrent.backend.repository.TrustEventRepository;
import com.trustrent.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrustService {

    private final TrustScoreRepository trustScoreRepository;
    private final TrustEventRepository trustEventRepository;
    private final UserRepository userRepository;

    public TrustService(
            TrustScoreRepository trustScoreRepository,
            TrustEventRepository trustEventRepository,
            UserRepository userRepository) {

        this.trustScoreRepository = trustScoreRepository;
        this.trustEventRepository = trustEventRepository;
        this.userRepository = userRepository;
    }

    public TrustProfileResponse getTrustProfileByEmail(String email) {

        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));

        TrustScore score = trustScoreRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Trust score not initialized"));

        List<TrustEvent> events =
                trustEventRepository.findByUserOrderByCreatedAtDesc(user);

        return new TrustProfileResponse(
                user.getId(),
                score.getScore(),
                score.getPaymentScore(),
                score.getRentalHistoryScore(),
                score.getReviewScore(),
                score.getCareScore(),
                score.getComplianceScore(),
                score.getComplaintScore(),
                score.getLastCalculatedAt(),
                events
        );
    }
}