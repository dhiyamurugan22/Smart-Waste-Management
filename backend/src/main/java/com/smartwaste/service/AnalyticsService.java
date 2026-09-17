package com.smartwaste.service;

import com.smartwaste.model.WasteBin;
import com.smartwaste.repository.CollectionTaskRepository;
import com.smartwaste.repository.WasteBinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final WasteBinRepository wasteBinRepository;
    private final CollectionTaskRepository collectionTaskRepository;

    public Map<String, Object> getOverviewMetrics() {
        List<WasteBin> bins = wasteBinRepository.findAll();
        long totalBins = bins.size();
        long criticalBins = bins.stream().filter(b -> b.getCurrentFillLevel() >= 80.0).count();
        long overflowingBins = bins.stream().filter(b -> "OVERFLOWING".equalsIgnoreCase(b.getStatus())).count();
        
        long activeTasks = collectionTaskRepository.findByStatus("IN_PROGRESS").size() + 
                           collectionTaskRepository.findByStatus("PENDING").size();
        long completedTasks = collectionTaskRepository.findByStatus("COMPLETED").size();

        double avgFillLevel = bins.isEmpty() ? 0.0 : 
                bins.stream().mapToDouble(WasteBin::getCurrentFillLevel).average().orElse(0.0);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalBins", totalBins);
        metrics.put("criticalBins", criticalBins);
        metrics.put("overflowingBins", overflowingBins);
        metrics.put("averageFillLevel", Math.round(avgFillLevel * 10.0) / 10.0);
        metrics.put("activeTasks", activeTasks);
        metrics.put("completedTasks", completedTasks);
        
        // Environmental impact calculations
        double totalWasteCollectedTons = (completedTasks * 350.0) / 1000.0;
        metrics.put("totalWasteCollectedTons", totalWasteCollectedTons);
        metrics.put("co2OffsetKg", Math.round(totalWasteCollectedTons * 620.0));
        metrics.put("treesSavedEquivalent", Math.round(totalWasteCollectedTons * 17.0));
        metrics.put("efficiencyRatingPercent", totalBins == 0 ? 98 : Math.max(90, 100 - (int) (criticalBins * 5)));

        return metrics;
    }
}
