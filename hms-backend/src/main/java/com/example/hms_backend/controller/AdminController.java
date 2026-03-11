package com.example.hms_backend.controller;

import com.example.hms_backend.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminController {

    private final AdminReportService reportService;

    @GetMapping("/appointments-per-doctor")
    public ResponseEntity<Map<String, Long>> getAppointmentsPerDoctor() {
        return ResponseEntity.ok(reportService.getAppointmentsPerDoctor());
    }

    @GetMapping("/revenue-per-department")
    public ResponseEntity<Map<String, Double>> getRevenuePerDepartment() {
        return ResponseEntity.ok(reportService.getRevenuePerDepartment());
    }
}
