package com.example.appointment.controller;

import com.example.appointment.model.*;
import com.example.appointment.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class DoctorController {
    private final DoctorRepository doctors;
    private final SlotRepository slots;
    private final AppointmentRepository appointments;

    public DoctorController(DoctorRepository doctors, SlotRepository slots, AppointmentRepository appointments) {
        this.doctors = doctors;
        this.slots = slots;
        this.appointments = appointments;
    }

    record SlotRequest(LocalDate date, LocalTime startTime) {}

    @GetMapping("/doctors")
    public List<Doctor> allDoctors() { return doctors.findAll(); }

    @GetMapping("/doctors/{id}/slots")
    public List<Slot> availableSlots(@PathVariable Long id) {
        return slots.findByDoctorIdAndBookedFalse(id);
    }

    @PostMapping("/doctor/slots")
    public Slot addSlot(@RequestBody SlotRequest r, Authentication auth) {
        Doctor d = doctors.findByUserEmail(auth.getName()).orElseThrow();
        Slot s = new Slot();
        s.setDoctor(d);
        s.setDate(r.date());
        s.setStartTime(r.startTime());
        return slots.save(s);
    }

    @GetMapping("/doctor/appointments")
    public List<Appointment> myAppointments(Authentication auth) {
        Doctor d = doctors.findByUserEmail(auth.getName()).orElseThrow();
        return appointments.findBySlotDoctor(d);
    }

    @PutMapping("/doctor/appointments/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Appointment a = appointments.findById(id).orElseThrow();
        a.setStatus(AppointmentStatus.valueOf(body.get("status")));
        return ResponseEntity.ok(appointments.save(a));
    }
}