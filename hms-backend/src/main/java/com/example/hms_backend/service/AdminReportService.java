package com.example.hms_backend.service;

import com.example.hms_backend.entity.Appointment;
import com.example.hms_backend.entity.Department;
import com.example.hms_backend.repository.AppointmentRepository;
import com.example.hms_backend.repository.DepartmentRepository;
import com.example.hms_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReportService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public Map<String, Long> getAppointmentsPerDoctor() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .collect(Collectors.groupingBy(
                        app -> app.getDoctor().getName(),
                        Collectors.counting()
                ));
    }

    public Map<String, Double> getRevenuePerDepartment() {
        List<Appointment> appointments = appointmentRepository.findAll();
        Map<String, Double> revenueMap = new HashMap<>();

        for (Appointment appointment : appointments) {
            if (appointment.getStatus().name().equals("COMPLETED")) {
                Department dept = appointment.getDoctor().getDepartment();
                if (dept != null) {
                    revenueMap.put(dept.getName(), 
                        revenueMap.getOrDefault(dept.getName(), 0.0) + dept.getConsultationFee());
                }
            }
        }
        return revenueMap;
    }
}
