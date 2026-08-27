package com.smartwaste.controller;

import com.smartwaste.model.WasteBin;
import com.smartwaste.service.WasteBinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bins")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WasteBinController {
    private final WasteBinService wasteBinService;

    @GetMapping
    public ResponseEntity<List<WasteBin>> getAllBins(@RequestParam(required = false) String zone) {
        if (zone != null && !zone.isEmpty()) {
            return ResponseEntity.ok(wasteBinService.getBinsByZone(zone));
        }
        return ResponseEntity.ok(wasteBinService.getAllBins());
    }

    @GetMapping("/critical")
    public ResponseEntity<List<WasteBin>> getCriticalBins() {
        return ResponseEntity.ok(wasteBinService.getCriticalBins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WasteBin> getBinById(@PathVariable String id) {
        return wasteBinService.getBinById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WasteBin> createBin(@RequestBody WasteBin bin) {
        return ResponseEntity.ok(wasteBinService.createBin(bin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WasteBin> updateBin(@PathVariable String id, @RequestBody WasteBin bin) {
        return ResponseEntity.ok(wasteBinService.updateBin(id, bin));
    }

    @PatchMapping("/{id}/telemetry")
    public ResponseEntity<WasteBin> updateTelemetry(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        double fill = ((Number) payload.getOrDefault("fillLevel", 50.0)).doubleValue();
        double temp = ((Number) payload.getOrDefault("temperature", 25.0)).doubleValue();
        int battery = ((Number) payload.getOrDefault("batteryLevel", 90)).intValue();
        return ResponseEntity.ok(wasteBinService.updateTelemetry(id, fill, temp, battery));
    }

    @PostMapping("/{id}/empty")
    public ResponseEntity<WasteBin> markEmptied(@PathVariable String id) {
        return ResponseEntity.ok(wasteBinService.markEmptied(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBin(@PathVariable String id) {
        wasteBinService.deleteBin(id);
        return ResponseEntity.noContent().build();
    }
}
