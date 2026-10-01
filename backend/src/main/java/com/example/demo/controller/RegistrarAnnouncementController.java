package com.example.demo.controller;

import com.example.demo.model.Announcement;
import com.example.demo.service.RegistrarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegistrarAnnouncementController {

    private final RegistrarService registrarService;

    @GetMapping
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(registrarService.getAnnouncements());
    }
}
