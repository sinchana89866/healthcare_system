package com.example.appointment.controller;

import com.example.appointment.model.*;
import com.example.appointment.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository users;
    private final DoctorRepository doctors;
    private final AppointmentRepository appointments;
    private final PasswordEncoder encoder;

    public AdminController(UserRepository users, DoctorRepository doctors,
                           AppointmentRepository appointments, PasswordEncoder encoder) {
        this.users = users;
        this.doctors = doctors;
        this.appointments = appointments;
        this.encoder = encoder;
    }

    record DoctorRequest(String name, String email, String password, String specialization) {}

    @PostMapping("/doctors")
    public ResponseEntity<?> addDoctor(@RequestBody DoctorRequest r) {
        if (users.findByEmail(r.email()).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        User u = new User();
        u.setName(r.name());
        u.setEmail(r.email());
        u.setPassword(encoder.encode(r.password()));
        u.setRole(Role.DOCTOR);
        users.save(u);
        Doctor d = new Doctor();
        d.setName(r.name());
        d.setSpecialization(r.specialization());
        d.setUser(u);
        return ResponseEntity.ok(doctors.save(d));
    }

    @GetMapping("/patients")
    public List<User> patients() { return users.findByRole(Role.PATIENT); }

    @GetMapping("/appointments")
    public List<Appointment> allAppointments() { return appointments.findAll(); }
}