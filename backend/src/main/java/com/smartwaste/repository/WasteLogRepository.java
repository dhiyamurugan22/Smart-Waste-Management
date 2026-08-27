package com.smartwaste.repository;

import com.smartwaste.model.WasteLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WasteLogRepository extends MongoRepository<WasteLog, String> {
    List<WasteLog> findByBinId(String binId);
    List<WasteLog> findByZone(String zone);
    List<WasteLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
