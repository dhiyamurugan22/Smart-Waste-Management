package com.smartwaste.service;

import com.smartwaste.model.WasteBin;
import com.smartwaste.repository.WasteBinRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class IoTSimulatorService {
    private final WasteBinRepository wasteBinRepository;
    private final Random random = new Random();

    // Triggered periodically every 30 seconds to simulate real-time waste accumulation
    @Scheduled(fixedRate = 30000)
    public void simulateWasteLevelFluctuations() {
        List<WasteBin> bins = wasteBinRepository.findAll();
        if (bins.isEmpty()) return;

        for (WasteBin bin : bins) {
            // Randomly increase fill level slightly (0% - 4%)
            double delta = (random.nextDouble() * 3.5);
            double newLevel = Math.min(100.0, bin.getCurrentFillLevel() + delta);
            bin.updateFillLevel(newLevel);
            
            // Random temperature fluctuation (22C - 38C)
            bin.setTemperature(Math.round((24.0 + random.nextDouble() * 12.0) * 10.0) / 10.0);
            // Battery drains very slowly
            bin.setBatteryLevel(Math.max(15, bin.getBatteryLevel() - (random.nextInt(100) < 5 ? 1 : 0)));
            wasteBinRepository.save(bin);
        }
    }

    public List<WasteBin> triggerManualSimulationTick() {
        simulateWasteLevelFluctuations();
        return wasteBinRepository.findAll();
    }
}
