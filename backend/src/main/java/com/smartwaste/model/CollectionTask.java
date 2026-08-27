package com.smartwaste.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "collection_tasks")
public class CollectionTask {
    @Id
    private String id;
    
    private String taskCode; // e.g. "TSK-1001"
    private String title;
    private String description;
    
    private String complaintId;
    private List<String> binIds;
    
    private String assignedDriverId;
    private String assignedDriverName;
    private String driverPhone;
    private String vehicleNumber;
    
    private String targetZone;
    private String startLocation;
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"
    private String priority; // "LOW", "MEDIUM", "HIGH", "EMERGENCY"
    
    private double estimatedDistanceKm;
    private int estimatedDurationMinutes;
    private double wasteCollectedKg;
    
    @Builder.Default
    private LocalDateTime assignedAt = LocalDateTime.now();
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String completionNotes;
}
