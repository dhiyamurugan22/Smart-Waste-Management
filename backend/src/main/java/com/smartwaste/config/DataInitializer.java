package com.smartwaste.config;

import com.smartwaste.model.CollectionTask;
import com.smartwaste.model.WasteBin;
import com.smartwaste.repository.CollectionTaskRepository;
import com.smartwaste.repository.WasteBinRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final WasteBinRepository wasteBinRepository;
    private final CollectionTaskRepository collectionTaskRepository;

    @Override
    public void run(String... args) {
        seedWasteBins();
        seedCollectionTasks();
        log.info("Smart Waste Management sample data initialized successfully.");
    }

    private void seedWasteBins() {
        if (wasteBinRepository.count() == 0) {
            WasteBin b1 = WasteBin.builder()
                    .binCode("BIN-101")
                    .locationName("City Center Mall - Main Entrance")
                    .latitude(13.0827)
                    .longitude(80.2707)
                    .zone("Central Zone")
                    .binType("GENERAL")
                    .capacityLiters(500)
                    .temperature(27.4)
                    .batteryLevel(94)
                    .build();
            b1.updateFillLevel(92.0); // Overflowing/Critical

            WasteBin b2 = WasteBin.builder()
                    .binCode("BIN-102")
                    .locationName("Tech Park Gate 2 - Cafeteria")
                    .latitude(13.0850)
                    .longitude(80.2750)
                    .zone("North Zone")
                    .binType("RECYCLABLE")
                    .capacityLiters(1100)
                    .temperature(25.1)
                    .batteryLevel(88)
                    .build();
            b2.updateFillLevel(84.0); // Full

            WasteBin b3 = WasteBin.builder()
                    .binCode("BIN-103")
                    .locationName("Gandhi Road Market Square")
                    .latitude(13.0780)
                    .longitude(80.2650)
                    .zone("Central Zone")
                    .binType("ORGANIC")
                    .capacityLiters(500)
                    .temperature(31.2)
                    .batteryLevel(79)
                    .build();
            b3.updateFillLevel(97.0); // Overflowing

            WasteBin b4 = WasteBin.builder()
                    .binCode("BIN-104")
                    .locationName("Residential Colony Park 4")
                    .latitude(13.0910)
                    .longitude(80.2800)
                    .zone("North Zone")
                    .binType("GENERAL")
                    .capacityLiters(240)
                    .temperature(24.0)
                    .batteryLevel(98)
                    .build();
            b4.updateFillLevel(35.0); // Medium

            WasteBin b5 = WasteBin.builder()
                    .binCode("BIN-105")
                    .locationName("Metro Station East Gate")
                    .latitude(13.0750)
                    .longitude(80.2600)
                    .zone("South Zone")
                    .binType("RECYCLABLE")
                    .capacityLiters(500)
                    .temperature(26.8)
                    .batteryLevel(91)
                    .build();
            b5.updateFillLevel(18.0); // Low

            wasteBinRepository.saveAll(List.of(b1, b2, b3, b4, b5));
        }
    }

    private void seedCollectionTasks() {
        if (collectionTaskRepository.count() == 0) {
            collectionTaskRepository.saveAll(List.of(
                    CollectionTask.builder()
                            .taskCode("TSK-1001")
                            .title("High Priority North Zone Pickup")
                            .description("Clear BIN-102 Tech Park and surrounding bins")
                            .assignedDriverName("Rajesh Kumar (Driver 1)")
                            .driverPhone("+91 94567 89012")
                            .vehicleNumber("TN-09-WM-4421")
                            .targetZone("North Zone")
                            .status("IN_PROGRESS")
                            .priority("HIGH")
                            .estimatedDistanceKm(6.4)
                            .estimatedDurationMinutes(35)
                            .assignedAt(LocalDateTime.now().minusHours(2))
                            .startedAt(LocalDateTime.now().minusMinutes(40))
                            .build(),
                    CollectionTask.builder()
                            .taskCode("TSK-1002")
                            .title("Central Zone Market Route")
                            .description("Empty BIN-101 and BIN-103 overflowing bins")
                            .assignedDriverName("Suresh Babu (Driver 2)")
                            .driverPhone("+91 98111 22334")
                            .vehicleNumber("TN-09-WM-8890")
                            .targetZone("Central Zone")
                            .status("PENDING")
                            .priority("EMERGENCY")
                            .estimatedDistanceKm(4.8)
                            .estimatedDurationMinutes(25)
                            .assignedAt(LocalDateTime.now().minusHours(1))
                            .build()
            ));
        }
    }
}
