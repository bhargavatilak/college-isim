package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.service.RegistrarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegistrarNotificationController {

    private final RegistrarService registrarService;

    @GetMapping
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(registrarService.getNotifications());
    }
}
