package com.example.demo.controller;

import com.example.demo.dto.PromoteStudentRequest;
import com.example.demo.entity.StudentMovement;
import com.example.demo.service.RegistrarStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/status-movement")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REGISTRAR')")
public class RegistrarStatusController {

    private final RegistrarStatusService service;

    @GetMapping("/history")
    public ResponseEntity<List<StudentMovement>> getHistory() {
        return ResponseEntity.ok(service.getMovementHistory());
    }

    @PostMapping("/promote")
    public ResponseEntity<StudentMovement> promoteStudent(@Valid @RequestBody PromoteStudentRequest request) {
        return ResponseEntity.ok(service.promoteStudent(request));
    }
}
