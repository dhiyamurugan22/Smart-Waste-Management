package com.smartwaste.controller;

import com.smartwaste.model.CollectionTask;
import com.smartwaste.service.CollectionTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CollectionTaskController {
    private final CollectionTaskService collectionTaskService;

    @GetMapping
    public ResponseEntity<List<CollectionTask>> getAllTasks(@RequestParam(required = false) String driverId) {
        if (driverId != null && !driverId.isEmpty()) {
            return ResponseEntity.ok(collectionTaskService.getTasksByDriver(driverId));
        }
        return ResponseEntity.ok(collectionTaskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionTask> getTaskById(@PathVariable String id) {
        return collectionTaskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CollectionTask> createTask(@RequestBody CollectionTask task) {
        return ResponseEntity.ok(collectionTaskService.createTask(task));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CollectionTask> updateTaskStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        String status = (String) body.get("status");
        String notes = (String) body.get("notes");
        Double wasteKg = body.get("wasteKg") != null ? ((Number) body.get("wasteKg")).doubleValue() : null;
        return ResponseEntity.ok(collectionTaskService.updateTaskStatus(id, status, notes, wasteKg));
    }
}
