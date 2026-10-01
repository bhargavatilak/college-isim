package com.example.demo.controller;

import com.example.demo.dto.RegistrarDashboardStats;
import com.example.demo.entity.AdmissionApplication;
import com.example.demo.entity.ApplicationStatus;
import com.example.demo.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrar")
@RequiredArgsConstructor
public class RegistrarAdmissionController {

    private final AdmissionService admissionService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('REGISTRAR')")
    public RegistrarDashboardStats getDashboardStats() {
        return admissionService.getDashboardStats();
    }

    @GetMapping("/admissions/applications")
    @PreAuthorize("hasRole('REGISTRAR')")
    public Page<AdmissionApplication> getApplications(Pageable pageable) {
        return admissionService.getApplications(pageable);
    }

    @GetMapping("/admissions/applications/{id}")
    @PreAuthorize("hasRole('REGISTRAR')")
    public AdmissionApplication getApplicationById(@PathVariable Long id) {
        return admissionService.getApplicationById(id);
    }

    @PatchMapping("/admissions/applications/{id}/approve")
    @PreAuthorize("hasRole('REGISTRAR')")
    public AdmissionApplication approveApplication(@PathVariable Long id) {
        return admissionService.updateApplicationStatus(id, ApplicationStatus.APPROVED);
    }

    @PatchMapping("/admissions/applications/{id}/reject")
    @PreAuthorize("hasRole('REGISTRAR')")
    public AdmissionApplication rejectApplication(@PathVariable Long id) {
        return admissionService.updateApplicationStatus(id, ApplicationStatus.REJECTED);
    }
}
