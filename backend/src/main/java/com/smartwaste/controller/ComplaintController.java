package com.smartwaste.controller;

import com.smartwaste.model.Complaint;
import com.smartwaste.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplaintController {
    private final ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints(@RequestParam(required = false) String userId) {
        if (userId != null && !userId.isEmpty()) {
            return ResponseEntity.ok(complaintService.getComplaintsByUser(userId));
        }
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable String id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Complaint> fileComplaint(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.fileComplaint(complaint));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String driverId = body.get("driverId");
        String driverName = body.get("driverName");
        String remarks = body.get("remarks");
        return ResponseEntity.ok(complaintService.updateStatus(id, status, driverId, driverName, remarks));
    }
}
