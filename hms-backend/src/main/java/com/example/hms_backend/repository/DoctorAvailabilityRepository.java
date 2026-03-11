package com.example.hms_backend.repository;

import com.example.hms_backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorId(Long doctorId);
    List<DoctorAvailability> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    
    @Query("SELECT da FROM DoctorAvailability da WHERE da.doctor.id = :doctorId AND da.date >= :startDate")
    List<DoctorAvailability> findUpcomingAvailability(@Param("doctorId") Long doctorId, @Param("startDate") LocalDate startDate);
}
