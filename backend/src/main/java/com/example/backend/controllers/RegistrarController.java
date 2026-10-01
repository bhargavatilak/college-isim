package com.example.backend.controllers;

import com.example.backend.model.AdmissionRegistration;
import com.example.backend.repository.AdmissionRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/registrar")
public class RegistrarController {

    @Autowired
    private AdmissionRegistrationRepository admissionRegistrationRepository;

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<AdmissionRegistration>> getAllRegistrations() {
        return ResponseEntity.ok(admissionRegistrationRepository.findAll());
    }

    @PatchMapping("/registrations/{id}/approve")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<?> approveRegistration(@PathVariable Long id) {
        Optional<AdmissionRegistration> registrationOpt = admissionRegistrationRepository.findById(id);
        if (registrationOpt.isPresent()) {
            AdmissionRegistration registration = registrationOpt.get();
            registration.setStatus("APPROVED");
            admissionRegistrationRepository.save(registration);
            return ResponseEntity.ok(registration);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/registrations/{id}/reject")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<?> rejectRegistration(@PathVariable Long id) {
        Optional<AdmissionRegistration> registrationOpt = admissionRegistrationRepository.findById(id);
        if (registrationOpt.isPresent()) {
            AdmissionRegistration registration = registrationOpt.get();
            registration.setStatus("REJECTED");
            admissionRegistrationRepository.save(registration);
            return ResponseEntity.ok(registration);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
