package com.example.hms_backend.service;

import com.example.hms_backend.entity.DoctorAvailability;
import com.example.hms_backend.repository.DoctorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;

    public DoctorAvailability addAvailability(DoctorAvailability availability) {
        return availabilityRepository.save(availability);
    }

    public List<DoctorAvailability> getAvailabilityByDoctor(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId);
    }

    public List<DoctorAvailability> getDoctorUpcomingAvailability(Long doctorId) {
        return availabilityRepository.findUpcomingAvailability(doctorId, LocalDate.now());
    }

    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
}
