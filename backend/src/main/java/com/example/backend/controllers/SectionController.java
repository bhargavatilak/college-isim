package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/hod/sections")
public class SectionController {

    private List<Map<String, Object>> sections = new ArrayList<>();

    public SectionController() {
        // Mock data
        Map<String, Object> sec1 = new HashMap<>();
        sec1.put("id", 1);
        sec1.put("year", 2);
        sec1.put("name", "A");
        sec1.put("coordinator", "Dr. Alan Turing");
        sec1.put("studentCount", 65);

        Map<String, Object> sec2 = new HashMap<>();
        sec2.put("id", 2);
        sec2.put("year", 2);
        sec2.put("name", "B");
        sec2.put("coordinator", "Dr. Grace Hopper");
        sec2.put("studentCount", 62);

        sections.add(sec1);
        sections.add(sec2);
    }

    @GetMapping
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> getSections() {
        return ResponseEntity.ok(sections);
    }

    @PostMapping
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> createSection(@RequestBody Map<String, Object> newSection) {
        newSection.put("id", sections.size() + 1);
        newSection.put("studentCount", 0); // initial count
        sections.add(newSection);
        return ResponseEntity.ok(newSection);
    }
}
