package com.example.demo.controller;

import com.example.demo.dto.CertificateRequestDto;
import com.example.demo.entity.CertificateRequest;
import com.example.demo.service.RegistrarCertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/certificates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REGISTRAR')")
public class RegistrarCertificateController {

    private final RegistrarCertificateService service;

    @GetMapping
    public ResponseEntity<List<CertificateRequest>> getAllCertificates() {
        return ResponseEntity.ok(service.getAllCertificates());
    }

    @PostMapping("/request")
    public ResponseEntity<CertificateRequest> requestCertificate(@Valid @RequestBody CertificateRequestDto request) {
        return ResponseEntity.ok(service.requestCertificate(request));
    }
}
