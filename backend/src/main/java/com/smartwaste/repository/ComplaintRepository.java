package com.smartwaste.repository;

import com.smartwaste.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    Optional<Complaint> findByComplaintCode(String complaintCode);
    List<Complaint> findByUserId(String userId);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByZone(String zone);
    List<Complaint> findByAssignedDriverId(String driverId);
}
