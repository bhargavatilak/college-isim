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
@RequestMapping("/api/hod/coordinators")
public class CoordinatorController {

    @GetMapping
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> getCoordinators() {
        List<Map<String, Object>> coordinators = new ArrayList<>();
        
        Map<String, Object> coord1 = new HashMap<>();
        coord1.put("id", 1);
        coord1.put("name", "Dr. Alan Turing");
        coord1.put("section", "Year 2 - Section A");
        coord1.put("contact", "alan@glb.edu");
        
        Map<String, Object> coord2 = new HashMap<>();
        coord2.put("id", 2);
        coord2.put("name", "Dr. Grace Hopper");
        coord2.put("section", "Year 2 - Section B");
        coord2.put("contact", "grace@glb.edu");

        coordinators.add(coord1);
        coordinators.add(coord2);
        
        return ResponseEntity.ok(coordinators);
    }
}
