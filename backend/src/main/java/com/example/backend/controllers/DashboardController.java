package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/director/stats")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> getDirectorStats() {
        // Return dummy data for now; later we connect to Repositories
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", 3250);
        stats.put("totalFaculty", 145);
        stats.put("totalHods", 12);
        stats.put("totalDepartments", 8);
        stats.put("totalCourses", 24);
        stats.put("todaysAttendance", 87.5);
        stats.put("pendingFees", "₹45,00,000");
        stats.put("feeCollection", "₹1,20,00,000");
        stats.put("upcomingExams", 5);
        stats.put("registeredStudents", 3100);
        stats.put("pendingComplaints", 18);
        stats.put("libraryBooks", 45000);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/hod/stats")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> getHodStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", 450);
        stats.put("totalFaculty", 25);
        stats.put("attendance", 82.3);
        stats.put("pendingComplaints", 3);
        return ResponseEntity.ok(stats);
    }
}
