package com.trustrent.backend.repository;

import com.trustrent.backend.entity.TrustScore;
import com.trustrent.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrustScoreRepository extends JpaRepository<TrustScore, UUID> {
    Optional<TrustScore> findByUser(User user);
}