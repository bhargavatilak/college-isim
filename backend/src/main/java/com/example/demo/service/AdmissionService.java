package com.example.demo.service;

import com.example.demo.dto.RegistrarDashboardStats;
import com.example.demo.entity.AdmissionApplication;
import com.example.demo.entity.ApplicationStatus;
import com.example.demo.repository.AdmissionApplicationRepository;
import com.example.demo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final StudentRepository studentRepository;
    private final AdmissionApplicationRepository admissionApplicationRepository;

    public RegistrarDashboardStats getDashboardStats() {
        long totalStudents = studentRepository.count();
        long pendingAdmissions = admissionApplicationRepository.countByStatus(ApplicationStatus.PENDING);
        long newAdmissions = admissionApplicationRepository.countByStatus(ApplicationStatus.APPROVED);
        
        return new RegistrarDashboardStats(totalStudents, newAdmissions, pendingAdmissions);
    }

    public Page<AdmissionApplication> getApplications(Pageable pageable) {
        return admissionApplicationRepository.findAll(pageable);
    }

    public AdmissionApplication getApplicationById(Long id) {
        return admissionApplicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public AdmissionApplication updateApplicationStatus(Long id, ApplicationStatus status) {
        AdmissionApplication app = getApplicationById(id);
        app.setStatus(status);
        return admissionApplicationRepository.save(app);
    }
}
