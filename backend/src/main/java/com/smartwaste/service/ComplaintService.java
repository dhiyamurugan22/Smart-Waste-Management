package com.smartwaste.service;

import com.smartwaste.model.Complaint;
import com.smartwaste.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(String userId) {
        return complaintRepository.findByUserId(userId);
    }

    public Optional<Complaint> getComplaintById(String id) {
        return complaintRepository.findById(id);
    }

    public Complaint fileComplaint(Complaint complaint) {
        if (complaint.getComplaintCode() == null || complaint.getComplaintCode().isEmpty()) {
            long count = complaintRepository.count() + 101;
            complaint.setComplaintCode(String.format("CMP-%d", count));
        }
        if (complaint.getStatus() == null || complaint.getStatus().isEmpty()) {
            complaint.setStatus("PENDING");
        }
        if (complaint.getPriority() == null || complaint.getPriority().isEmpty()) {
            complaint.setPriority("MEDIUM");
        }
        complaint.setCreatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public Complaint updateStatus(String id, String status, String driverId, String driverName, String remarks) {
        return complaintRepository.findById(id).map(complaint -> {
            complaint.setStatus(status);
            if (driverId != null) complaint.setAssignedDriverId(driverId);
            if (driverName != null) complaint.setAssignedDriverName(driverName);
            if (remarks != null) complaint.setAuthorityRemarks(remarks);
            if ("RESOLVED".equalsIgnoreCase(status)) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
            return complaintRepository.save(complaint);
        }).orElseThrow(() -> new IllegalArgumentException("Complaint not found with id: " + id));
    }
}
