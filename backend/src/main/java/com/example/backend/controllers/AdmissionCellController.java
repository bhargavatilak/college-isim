package com.example.backend.controllers;

import com.example.backend.model.AdmissionRegistration;
import com.example.backend.repository.AdmissionRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admission-cell")
public class AdmissionCellController {

    @Autowired
    private AdmissionRegistrationRepository admissionRegistrationRepository;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMISSION_CELL')")
    public ResponseEntity<?> createRegistration(@RequestBody AdmissionRegistration registration) {
        registration.setStatus("PENDING_REGISTRAR");
        AdmissionRegistration saved = admissionRegistrationRepository.save(registration);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('ADMISSION_CELL')")
    public ResponseEntity<List<AdmissionRegistration>> getAllRegistrations() {
        return ResponseEntity.ok(admissionRegistrationRepository.findAll());
    }
}
