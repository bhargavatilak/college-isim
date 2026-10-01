package com.example.backend.repository;

import com.example.backend.model.AdmissionRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdmissionRegistrationRepository extends JpaRepository<AdmissionRegistration, Long> {
}
