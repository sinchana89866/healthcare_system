package com.example.appointment.repository;

import com.example.appointment.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserEmail(String email);
}