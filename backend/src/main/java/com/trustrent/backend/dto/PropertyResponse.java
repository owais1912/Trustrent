package com.trustrent.backend.dto;

import com.trustrent.backend.enums.PropertyStatus;

import java.math.BigDecimal;
import java.util.UUID;

public class PropertyResponse {

    private UUID id;
    private String title;
    private String description;
    private String location;
    private String city;
    private BigDecimal monthlyRent;
    private BigDecimal securityDeposit;
    private Integer bedrooms;
    private Integer bathrooms;
    private String propertyType;
    private PropertyStatus status;

    private UUID landlordId;
    private String landlordName;
    private String landlordEmail;
    private String landlordPhone;

    public PropertyResponse(
            UUID id,
            String title,
            String description,
            String location,
            String city,
            BigDecimal monthlyRent,
            BigDecimal securityDeposit,
            Integer bedrooms,
            Integer bathrooms,
            String propertyType,
            PropertyStatus status,
            UUID landlordId,
            String landlordName,
            String landlordEmail,
            String landlordPhone) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.city = city;
        this.monthlyRent = monthlyRent;
        this.securityDeposit = securityDeposit;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.propertyType = propertyType;
        this.status = status;
        this.landlordId = landlordId;
        this.landlordName = landlordName;
        this.landlordEmail = landlordEmail;
        this.landlordPhone = landlordPhone;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getCity() {
        return city;
    }

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public PropertyStatus getStatus() {
        return status;
    }

    public UUID getLandlordId() {
        return landlordId;
    }

    public String getLandlordName() {
        return landlordName;
    }

    public String getLandlordEmail() {
        return landlordEmail;
    }

    public String getLandlordPhone() {
        return landlordPhone;
    }
}