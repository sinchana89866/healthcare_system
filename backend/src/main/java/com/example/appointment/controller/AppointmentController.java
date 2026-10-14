package com.example.appointment.controller;

import com.example.appointment.model.*;
import com.example.appointment.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentRepository appointments;
    private final SlotRepository slots;
    private final UserRepository users;

    public AppointmentController(AppointmentRepository appointments, SlotRepository slots, UserRepository users) {
        this.appointments = appointments;
        this.slots = slots;
        this.users = users;
    }

    record BookRequest(Long slotId) {}

    @PostMapping
    public ResponseEntity<?> book(@RequestBody BookRequest r, Authentication auth) {
        Slot slot = slots.findById(r.slotId()).orElseThrow();
        if (slot.isBooked())
            return ResponseEntity.badRequest().body(Map.of("error", "Slot already booked"));
        slot.setBooked(true);
        slots.save(slot);
        Appointment a = new Appointment();
        a.setPatient(users.findByEmail(auth.getName()).orElseThrow());
        a.setSlot(slot);
        return ResponseEntity.ok(appointments.save(a));
    }

    @GetMapping("/my")
    public List<Appointment> mine(Authentication auth) {
        return appointments.findByPatientEmail(auth.getName());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Authentication auth) {
        Appointment a = appointments.findById(id).orElseThrow();
        if (!a.getPatient().getEmail().equals(auth.getName()))
            return ResponseEntity.status(403).body(Map.of("error", "Not your appointment"));
        a.setStatus(AppointmentStatus.CANCELLED);
        a.getSlot().setBooked(false);
        slots.save(a.getSlot());
        return ResponseEntity.ok(appointments.save(a));
    }
}