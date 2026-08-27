package com.smartwaste.repository;

import com.smartwaste.model.CollectionTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionTaskRepository extends MongoRepository<CollectionTask, String> {
    Optional<CollectionTask> findByTaskCode(String taskCode);
    List<CollectionTask> findByAssignedDriverId(String driverId);
    List<CollectionTask> findByStatus(String status);
    List<CollectionTask> findByTargetZone(String zone);
}
