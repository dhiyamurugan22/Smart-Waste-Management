package com.smartwaste.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "waste_bins")
public class WasteBin {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String binCode; // e.g. "BIN-001"
    
    private String locationName;
    private double latitude;
    private double longitude;
    private String zone; // e.g. "North Zone", "South Zone"
    
    private String binType; // "ORGANIC", "RECYCLABLE", "HAZARDOUS", "GENERAL"
    private int capacityLiters; // e.g. 240, 500, 1100
    private double currentFillLevel; // percentage 0 to 100
    private String status; // "EMPTY", "LOW", "MEDIUM", "FULL", "OVERFLOWING"
    
    private double temperature; // in Celsius (IoT sensor)
    private int batteryLevel; // IoT sensor battery %
    private boolean requiresMaintenance;
    
    private LocalDateTime lastCollectedAt;
    private LocalDateTime lastSensorUpdateAt;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public void updateFillLevel(double fill) {
        this.currentFillLevel = Math.max(0.0, Math.min(100.0, fill));
        this.lastSensorUpdateAt = LocalDateTime.now();
        if (this.currentFillLevel >= 95.0) {
            this.status = "OVERFLOWING";
        } else if (this.currentFillLevel >= 80.0) {
            this.status = "FULL";
        } else if (this.currentFillLevel >= 40.0) {
            this.status = "MEDIUM";
        } else if (this.currentFillLevel >= 15.0) {
            this.status = "LOW";
        } else {
            this.status = "EMPTY";
        }
    }
}
