package com.example.appointment.repository;

import com.example.appointment.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String email);
    List<Appointment> findBySlotDoctor(Doctor doctor);
}