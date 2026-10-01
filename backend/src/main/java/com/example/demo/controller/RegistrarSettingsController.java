package com.example.demo.controller;

import com.example.demo.service.RegistrarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/registrar/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegistrarSettingsController {

    private final RegistrarService registrarService;

    @GetMapping
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(registrarService.getSettings());
    }
}
