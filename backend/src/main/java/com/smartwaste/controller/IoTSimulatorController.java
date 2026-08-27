package com.smartwaste.controller;

import com.smartwaste.model.WasteBin;
import com.smartwaste.service.IoTSimulatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/iot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IoTSimulatorController {
    private final IoTSimulatorService ioTSimulatorService;

    @PostMapping("/simulate")
    public ResponseEntity<List<WasteBin>> simulateTick() {
        return ResponseEntity.ok(ioTSimulatorService.triggerManualSimulationTick());
    }
}
