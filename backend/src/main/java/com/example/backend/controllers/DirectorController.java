package com.example.backend.controllers;

import com.example.backend.model.Department;
import com.example.backend.model.DepartmentStatus;
import com.example.backend.payload.request.DepartmentRequest;
import com.example.backend.service.DepartmentService;
import com.example.backend.model.HOD;
import com.example.backend.model.HODStatus;
import com.example.backend.payload.request.HODRequest;
import com.example.backend.service.HODService;
import com.example.backend.model.Faculty;
import com.example.backend.service.FacultyService;
import com.example.backend.model.Student;
import com.example.backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/director")
public class DirectorController {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private HODService hodService;

    @Autowired
    private FacultyService facultyService;

    @Autowired
    private StudentService studentService;

    // --- Dashboard ---

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> getDashboardStats() {
        // Mocked stats for now
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDepartments", 12);
        stats.put("totalFaculty", 145);
        stats.put("totalStudents", 3200);
        stats.put("activeCourses", 48);
        return ResponseEntity.ok(stats);
    }

    // --- Departments ---

    @GetMapping("/departments")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping("/departments")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        Department department = departmentService.createDepartment(request);
        return ResponseEntity.ok(department);
    }

    @PutMapping("/departments/{id}")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        Department department = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(department);
    }

    @PatchMapping("/departments/{id}/status")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<Department> updateDepartmentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String statusStr = statusMap.get("status");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        DepartmentStatus status = DepartmentStatus.valueOf(statusStr.toUpperCase());
        Department department = departmentService.updateDepartmentStatus(id, status);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/departments/{id}")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().body(Map.of("message", "Department deleted successfully"));
    }

    // --- HODs ---

    @GetMapping("/hods")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<List<HOD>> getAllHODs() {
        return ResponseEntity.ok(hodService.getAllHODs());
    }

    @PostMapping("/hods")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<HOD> createHOD(@Valid @RequestBody HODRequest request) {
        HOD hod = hodService.createHOD(request);
        return ResponseEntity.ok(hod);
    }

    @PutMapping("/hods/{id}")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<HOD> updateHOD(@PathVariable Long id, @Valid @RequestBody HODRequest request) {
        HOD hod = hodService.updateHOD(id, request);
        return ResponseEntity.ok(hod);
    }

    @PatchMapping("/hods/{id}/status")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> updateHODStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String statusStr = statusMap.get("status");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        HODStatus status = HODStatus.valueOf(statusStr.toUpperCase());
        hodService.updateHODStatus(id, status);
        return ResponseEntity.ok().body(Map.of("message", "HOD status updated successfully"));
    }

    @DeleteMapping("/hods/{id}")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> deleteHOD(@PathVariable Long id) {
        hodService.deleteHOD(id);
        return ResponseEntity.ok().body(Map.of("message", "HOD deleted successfully"));
    }

    // --- Faculty ---

    @GetMapping("/faculty")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    // --- Students ---

    @GetMapping("/students")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
    // --- Reports ---

    @GetMapping("/reports")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> getReports() {
        Map<String, Object> reports = new HashMap<>();
        reports.put("studentPerformance", "85% average");
        reports.put("attendanceRate", "92%");
        reports.put("financialOverview", "On Budget");
        return ResponseEntity.ok(reports);
    }

    // --- Settings ---

    @GetMapping("/settings")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> getSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("academicYear", "2026-2027");
        settings.put("semester", "Fall");
        settings.put("registrationOpen", true);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> settingsRequest) {
        // Mock update
        return ResponseEntity.ok(settingsRequest);
    }

    // --- AI Assistant ---

    @PostMapping("/ai/ask")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> askAI(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        Map<String, String> response = new HashMap<>();
        response.put("query", prompt);
        response.put("response", "This is a mock AI response for: " + prompt);
        return ResponseEntity.ok(response);
    }
}
