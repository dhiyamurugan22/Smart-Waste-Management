package com.smartwaste.repository;

import com.smartwaste.model.WasteBin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WasteBinRepository extends MongoRepository<WasteBin, String> {
    Optional<WasteBin> findByBinCode(String binCode);
    List<WasteBin> findByStatus(String status);
    List<WasteBin> findByZone(String zone);
    List<WasteBin> findByCurrentFillLevelGreaterThanEqual(double fillLevel);
}
