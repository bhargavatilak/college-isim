package com.example.demo.controller;

import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrar/departments")
@PreAuthorize("hasAnyRole('REGISTRAR', 'DIRECTOR')")
public class RegistrarDepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> editDepartment(@PathVariable Long id, @RequestBody Department departmentDetails) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        department.setName(departmentDetails.getName());
        department.setCode(departmentDetails.getCode());
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Department> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        department.setActive(payload.get("active"));
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @PatchMapping("/{id}/hod")
    public ResponseEntity<Department> assignHod(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        department.setHod(payload.get("hod"));
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartment(@PathVariable Long id) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        return ResponseEntity.ok(department);
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<String>> getDepartmentHistory(@PathVariable Long id) {
        // Mock history for now
        return ResponseEntity.ok(List.of("Created department", "Updated HOD"));
    }
}
