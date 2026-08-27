package com.smartwaste.service;

import com.smartwaste.model.WasteBin;
import com.smartwaste.repository.WasteBinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WasteBinService {
    private final WasteBinRepository wasteBinRepository;

    public List<WasteBin> getAllBins() {
        return wasteBinRepository.findAll();
    }

    public Optional<WasteBin> getBinById(String id) {
        return wasteBinRepository.findById(id);
    }

    public List<WasteBin> getCriticalBins() {
        return wasteBinRepository.findByCurrentFillLevelGreaterThanEqual(80.0);
    }

    public List<WasteBin> getBinsByZone(String zone) {
        return wasteBinRepository.findByZone(zone);
    }

    public WasteBin createBin(WasteBin bin) {
        if (bin.getBinCode() == null || bin.getBinCode().isEmpty()) {
            long count = wasteBinRepository.count() + 1;
            bin.setBinCode(String.format("BIN-%03d", count));
        }
        if (bin.getStatus() == null) {
            bin.updateFillLevel(bin.getCurrentFillLevel());
        }
        if (bin.getBatteryLevel() == 0) {
            bin.setBatteryLevel(95);
        }
        if (bin.getTemperature() == 0) {
            bin.setTemperature(26.5);
        }
        return wasteBinRepository.save(bin);
    }

    public WasteBin updateBin(String id, WasteBin binDetails) {
        return wasteBinRepository.findById(id).map(bin -> {
            bin.setLocationName(binDetails.getLocationName());
            bin.setLatitude(binDetails.getLatitude());
            bin.setLongitude(binDetails.getLongitude());
            bin.setZone(binDetails.getZone());
            bin.setBinType(binDetails.getBinType());
            bin.setCapacityLiters(binDetails.getCapacityLiters());
            bin.updateFillLevel(binDetails.getCurrentFillLevel());
            bin.setTemperature(binDetails.getTemperature());
            bin.setBatteryLevel(binDetails.getBatteryLevel());
            bin.setRequiresMaintenance(binDetails.isRequiresMaintenance());
            return wasteBinRepository.save(bin);
        }).orElseThrow(() -> new IllegalArgumentException("Bin not found with id: " + id));
    }

    public WasteBin updateTelemetry(String id, double fillLevel, double temperature, int battery) {
        return wasteBinRepository.findById(id).map(bin -> {
            bin.updateFillLevel(fillLevel);
            bin.setTemperature(temperature);
            bin.setBatteryLevel(battery);
            bin.setLastSensorUpdateAt(LocalDateTime.now());
            return wasteBinRepository.save(bin);
        }).orElseThrow(() -> new IllegalArgumentException("Bin not found with id: " + id));
    }

    public WasteBin markEmptied(String id) {
        return wasteBinRepository.findById(id).map(bin -> {
            bin.updateFillLevel(0.0);
            bin.setLastCollectedAt(LocalDateTime.now());
            bin.setRequiresMaintenance(false);
            return wasteBinRepository.save(bin);
        }).orElseThrow(() -> new IllegalArgumentException("Bin not found with id: " + id));
    }

    public void deleteBin(String id) {
        wasteBinRepository.deleteById(id);
    }
}
