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
@Document(collection = "waste_logs")
public class WasteLog {
    @Id
    private String id;
    
    private String binId;
    private String binCode;
    private String taskId;
    private String driverId;
    private double wasteWeightKg;
    private String wasteType; // "ORGANIC", "RECYCLABLE", "HAZARDOUS", "GENERAL"
    private String zone;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
