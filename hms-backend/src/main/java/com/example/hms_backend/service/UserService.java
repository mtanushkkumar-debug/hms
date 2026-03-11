package com.example.hms_backend.service;

import com.example.hms_backend.entity.Role;
import com.example.hms_backend.entity.User;
import com.example.hms_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getDoctors() {
        return userRepository.findByRole(Role.DOCTOR);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
