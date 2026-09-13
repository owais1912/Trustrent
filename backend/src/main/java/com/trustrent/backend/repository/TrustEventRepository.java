package com.trustrent.backend.repository;

import com.trustrent.backend.entity.TrustEvent;
import com.trustrent.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrustEventRepository extends JpaRepository<TrustEvent, UUID> {
    List<TrustEvent> findByUserOrderByCreatedAtDesc(User user);
}