package com.example.appointment.controller;

import com.example.appointment.model.*;
import com.example.appointment.repository.UserRepository;
import com.example.appointment.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    record RegisterRequest(String name, String email, String password) {}
    record LoginRequest(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest r) {
        if (users.findByEmail(r.email()).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        User u = new User();
        u.setName(r.name());
        u.setEmail(r.email());
        u.setPassword(encoder.encode(r.password()));
        u.setRole(Role.PATIENT);
        users.save(u);
        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest r) {
        var opt = users.findByEmail(r.email());
        if (opt.isEmpty() || !encoder.matches(r.password(), opt.get().getPassword()))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        User u = opt.get();
        return ResponseEntity.ok(Map.of(
                "token", jwt.generateToken(u.getEmail(), u.getRole().name()),
                "role", u.getRole().name(),
                "name", u.getName()));
    }
}