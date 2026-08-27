package com.smartwaste.service;

import com.smartwaste.model.User;
import com.smartwaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getDrivers() {
        return userRepository.findByRole("DRIVER");
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CITIZEN");
        }
        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword() != null && u.getPassword().equals(password))
                .orElse(null);
    }
}
