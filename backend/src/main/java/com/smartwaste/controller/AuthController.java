package com.smartwaste.controller;

import com.smartwaste.model.User;
import com.smartwaste.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User created = userService.registerUser(user);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.authenticate(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }

    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getDrivers() {
        return ResponseEntity.ok(userService.getDrivers());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
