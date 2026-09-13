package com.trustrent.backend.entity;

import com.trustrent.backend.enums.TrustEventType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trust_events", indexes = {
    @Index(name = "idx_trust_events_user", columnList = "user_id, created_at DESC"),
    @Index(name = "idx_trust_events_type", columnList = "user_id, event_type"),
    @Index(name = "idx_trust_events_ref", columnList = "reference_type, reference_id")
})
public class TrustEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 50)
    private TrustEventType eventType;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private UUID referenceId;

    @Column(name = "score_change", nullable = false)
    private Integer scoreChange;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    // Setters
    public void setUser(User user) { this.user = user; }
    public void setEventType(TrustEventType eventType) { this.eventType = eventType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }
    public void setReferenceId(UUID referenceId) { this.referenceId = referenceId; }
    public void setScoreChange(Integer scoreChange) { this.scoreChange = scoreChange; }
    public void setDescription(String description) { this.description = description; }

    // Getters
    public UUID getId() { return id; }
    public User getUser() { return user; }
    public TrustEventType getEventType() { return eventType; }
    public String getReferenceType() { return referenceType; }
    public UUID getReferenceId() { return referenceId; }
    public Integer getScoreChange() { return scoreChange; }
    public String getDescription() { return description; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}