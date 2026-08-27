package com.smartwaste.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;
    
    private String complaintCode; // e.g. "CMP-2026-001"
    private String userId;
    private String citizenName;
    private String citizenPhone;
    private String citizenEmail;
    
    private String title;
    private String category; // "OVERFLOWING_BIN", "UNCOLLECTED_WASTE", "ILLEGAL_DUMPING", "DAMAGED_BIN", "OTHER"
    private String description;
    
    private String locationAddress;
    private double latitude;
    private double longitude;
    private String zone;
    
    private String imageUrl;
    private String priority; // "LOW", "MEDIUM", "HIGH", "CRITICAL"
    private String status; // "PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"
    
    private String assignedDriverId;
    private String assignedDriverName;
    private String authorityRemarks;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}
