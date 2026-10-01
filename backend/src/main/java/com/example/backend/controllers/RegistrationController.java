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
@RequestMapping("/api/hod/registrations")
public class RegistrationController {

    @GetMapping
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> getRegistrations(@RequestParam(required = false) String status) {
        // Mock data for the HOD Semester Registration dashboard
        List<Map<String, String>> registrations = new ArrayList<>();
        
        Map<String, String> reg1 = new HashMap<>();
        reg1.put("referenceNo", "REG-2023-8472");
        reg1.put("student", "Aryan Sharma");
        reg1.put("semester", "Semester 5");
        reg1.put("status", "PENDING");
        reg1.put("date", "2023-10-12");
        
        Map<String, String> reg2 = new HashMap<>();
        reg2.put("referenceNo", "REG-2023-8473");
        reg2.put("student", "Priya Patel");
        reg2.put("semester", "Semester 5");
        reg2.put("status", "APPROVED");
        reg2.put("date", "2023-10-11");
        
        registrations.add(reg1);
        registrations.add(reg2);

        // Filter based on status
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            registrations.removeIf(r -> !r.get("status").equalsIgnoreCase(status));
        }

        return ResponseEntity.ok(registrations);
    }
}
