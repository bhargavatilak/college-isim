package com.example.demo.service;

import com.example.demo.dto.CertificateRequestDto;
import com.example.demo.entity.CertificateRequest;
import com.example.demo.repository.CertificateRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrarCertificateService {

    private final CertificateRequestRepository repository;

    public List<CertificateRequest> getAllCertificates() {
        return repository.findAll();
    }

    public CertificateRequest requestCertificate(CertificateRequestDto dto) {
        CertificateRequest request = new CertificateRequest();
        request.setStudentId(dto.getStudentId());
        request.setCertificateType(dto.getCertificateType());
        request.setStatus("PENDING");
        request.setRequestedDate(LocalDateTime.now());
        return repository.save(request);
    }
}
