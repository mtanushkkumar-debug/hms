package com.example.hms_backend.controller;

import com.example.hms_backend.entity.DoctorAvailability;
import com.example.hms_backend.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    @PostMapping
    public ResponseEntity<DoctorAvailability> addAvailability(@RequestBody DoctorAvailability availability) {
        return ResponseEntity.ok(availabilityService.addAvailability(availability));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAvailability>> getAvailabilityByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityByDoctor(doctorId));
    }

    @GetMapping("/doctor/{doctorId}/upcoming")
    public ResponseEntity<List<DoctorAvailability>> getUpcomingAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(availabilityService.getDoctorUpcomingAvailability(doctorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }
}
