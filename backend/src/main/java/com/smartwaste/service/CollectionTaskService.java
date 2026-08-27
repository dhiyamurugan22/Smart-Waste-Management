package com.smartwaste.service;

import com.smartwaste.model.CollectionTask;
import com.smartwaste.repository.CollectionTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CollectionTaskService {
    private final CollectionTaskRepository collectionTaskRepository;
    private final WasteBinService wasteBinService;
    private final ComplaintService complaintService;

    public List<CollectionTask> getAllTasks() {
        return collectionTaskRepository.findAll();
    }

    public List<CollectionTask> getTasksByDriver(String driverId) {
        return collectionTaskRepository.findByAssignedDriverId(driverId);
    }

    public Optional<CollectionTask> getTaskById(String id) {
        return collectionTaskRepository.findById(id);
    }

    public CollectionTask createTask(CollectionTask task) {
        if (task.getTaskCode() == null || task.getTaskCode().isEmpty()) {
            long count = collectionTaskRepository.count() + 1001;
            task.setTaskCode(String.format("TSK-%d", count));
        }
        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }
        if (task.getPriority() == null) {
            task.setPriority("MEDIUM");
        }
        task.setAssignedAt(LocalDateTime.now());
        
        // If linked to complaint, set complaint to ASSIGNED
        if (task.getComplaintId() != null && !task.getComplaintId().isEmpty()) {
            try {
                complaintService.updateStatus(task.getComplaintId(), "ASSIGNED", task.getAssignedDriverId(), task.getAssignedDriverName(), "Task dispatched: " + task.getTaskCode());
            } catch (Exception ignored) {}
        }
        
        return collectionTaskRepository.save(task);
    }

    public CollectionTask updateTaskStatus(String id, String status, String notes, Double wasteKg) {
        return collectionTaskRepository.findById(id).map(task -> {
            task.setStatus(status);
            if (notes != null) task.setCompletionNotes(notes);
            if (wasteKg != null) task.setWasteCollectedKg(wasteKg);
            
            if ("IN_PROGRESS".equalsIgnoreCase(status) && task.getStartedAt() == null) {
                task.setStartedAt(LocalDateTime.now());
                if (task.getComplaintId() != null) {
                    try {
                        complaintService.updateStatus(task.getComplaintId(), "IN_PROGRESS", task.getAssignedDriverId(), task.getAssignedDriverName(), "Driver is on the way");
                    } catch (Exception ignored) {}
                }
            } else if ("COMPLETED".equalsIgnoreCase(status)) {
                task.setCompletedAt(LocalDateTime.now());
                // Empty the linked bins
                if (task.getBinIds() != null) {
                    for (String binId : task.getBinIds()) {
                        try {
                            wasteBinService.markEmptied(binId);
                        } catch (Exception ignored) {}
                    }
                }
                // Resolve linked complaint
                if (task.getComplaintId() != null) {
                    try {
                        complaintService.updateStatus(task.getComplaintId(), "RESOLVED", task.getAssignedDriverId(), task.getAssignedDriverName(), "Waste collected successfully");
                    } catch (Exception ignored) {}
                }
            }
            return collectionTaskRepository.save(task);
        }).orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id));
    }
}
