package com.example.hms_backend.service;

import com.example.hms_backend.entity.Appointment;
import com.example.hms_backend.entity.AppointmentStatus;
import com.example.hms_backend.entity.DoctorAvailability;
import com.example.hms_backend.repository.AppointmentRepository;
import com.example.hms_backend.repository.DoctorAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    public Appointment bookAppointment(Appointment appointment) {
        // 1. Check if doctor is available on that day and time
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndDate(
                appointment.getDoctor().getId(), appointment.getAppointmentDate());
                
        boolean isDoctorAvailable = availabilities.stream().anyMatch(avail -> 
            !appointment.getStartTime().isBefore(avail.getStartTime()) &&
            !appointment.getEndTime().isAfter(avail.getEndTime())
        );

        if (!isDoctorAvailable) {
            throw new RuntimeException("Doctor is not available at this time.");
        }

        // 2. Prevent overlapping appointments for doctor
        boolean doctorConflict = appointmentRepository.existsOverlappingAppointmentForDoctor(
                appointment.getDoctor().getId(),
                appointment.getAppointmentDate(),
                appointment.getStartTime(),
                appointment.getEndTime()
        );

        if (doctorConflict) {
            throw new RuntimeException("Doctor already has an appointment during this time slot.");
        }

        // 3. Prevent patient double booking
        boolean patientConflict = appointmentRepository.existsOverlappingAppointmentForPatient(
                appointment.getPatient().getId(),
                appointment.getAppointmentDate(),
                appointment.getStartTime(),
                appointment.getEndTime()
        );

        if (patientConflict) {
            throw new RuntimeException("You already have an appointment booked during this time slot.");
        }

        appointment.setStatus(AppointmentStatus.BOOKED);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
