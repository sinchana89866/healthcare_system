package com.example.appointment.repository;

import com.example.appointment.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByDoctorIdAndBookedFalse(Long doctorId);
}