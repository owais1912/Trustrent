package com.trustrent.backend.entity;

import com.trustrent.backend.enums.PropertyStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "properties", indexes = {
    @Index(name = "idx_properties_landlord", columnList = "landlord_id"),
    @Index(name = "idx_properties_city", columnList = "city"),
    @Index(name = "idx_properties_status", columnList = "status"),
    @Index(name = "idx_properties_rent", columnList = "monthly_rent")
})
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "monthly_rent", nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "security_deposit", nullable = false, precision = 12, scale = 2)
    private BigDecimal securityDeposit;

    @Column(name = "maintenance_charge", precision = 12, scale = 2)
    private BigDecimal maintenanceCharge = BigDecimal.ZERO;

    @Column(name = "parking_charge", precision = 12, scale = 2)
    private BigDecimal parkingCharge = BigDecimal.ZERO;

    @Column(name = "water_charge", precision = 12, scale = 2)
    private BigDecimal waterCharge = BigDecimal.ZERO;

    @Column(name = "electricity_charge", precision = 12, scale = 2)
    private BigDecimal electricityCharge = BigDecimal.ZERO;

    @Column(name = "internet_charge", precision = 12, scale = 2)
    private BigDecimal internetCharge = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer bedrooms;

    @Column(nullable = false)
    private Integer bathrooms;

    @Column(name = "property_type", nullable = false, length = 50)
    private String propertyType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> amenities;

    @Column(columnDefinition = "text")
    private String rules;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PropertyStatus status;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyImage> images;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // -------------------------
    // Getters and Setters
    // -------------------------

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getLandlord() {
        return landlord;
    }

    public void setLandlord(User landlord) {
        this.landlord = landlord;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public BigDecimal getMaintenanceCharge() {
        return maintenanceCharge;
    }

    public void setMaintenanceCharge(BigDecimal maintenanceCharge) {
        this.maintenanceCharge = maintenanceCharge;
    }

    public BigDecimal getParkingCharge() {
        return parkingCharge;
    }

    public void setParkingCharge(BigDecimal parkingCharge) {
        this.parkingCharge = parkingCharge;
    }

    public BigDecimal getWaterCharge() {
        return waterCharge;
    }

    public void setWaterCharge(BigDecimal waterCharge) {
        this.waterCharge = waterCharge;
    }

    public BigDecimal getElectricityCharge() {
        return electricityCharge;
    }

    public void setElectricityCharge(BigDecimal electricityCharge) {
        this.electricityCharge = electricityCharge;
    }

    public BigDecimal getInternetCharge() {
        return internetCharge;
    }

    public void setInternetCharge(BigDecimal internetCharge) {
        this.internetCharge = internetCharge;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public Map<String, Object> getAmenities() {
        return amenities;
    }

    public void setAmenities(Map<String, Object> amenities) {
        this.amenities = amenities;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public PropertyStatus getStatus() {
        return status;
    }

    public void setStatus(PropertyStatus status) {
        this.status = status;
    }

    public List<PropertyImage> getImages() {
        return images;
    }

    public void setImages(List<PropertyImage> images) {
        this.images = images;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}