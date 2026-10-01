package com.example.demo.controller;

import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.dto.StudentDto;
import com.example.demo.dto.VerifyRequest;
import com.example.demo.model.AcademicRecord;
import com.example.demo.model.Semester;
import com.example.demo.model.Student;
import com.example.demo.service.RegistrarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registrar")
@RequiredArgsConstructor
public class RegistrarController {

    private final RegistrarService registrarService;

    @GetMapping("/academic-records")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<AcademicRecord>> getAcademicRecords() {
        return ResponseEntity.ok(registrarService.getAllAcademicRecords());
    }

    @GetMapping("/academic-registration/semesters")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<Semester>> getSemesters() {
        return ResponseEntity.ok(registrarService.getAllSemesters());
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Page<Student>> getStudents(Pageable pageable) {
        return ResponseEntity.ok(registrarService.getAllStudents(pageable));
    }

    @PostMapping("/students")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Student> registerStudent(@RequestBody StudentDto dto) {
        return ResponseEntity.ok(registrarService.registerStudent(dto));
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(registrarService.getStudentById(id));
    }

    @PatchMapping("/students/{id}/status")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Student> updateStudentStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(registrarService.updateStudentStatus(id, request.getStatus()));
    }

    @GetMapping("/verification/pending")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<Student>> getPendingVerifications() {
        return ResponseEntity.ok(registrarService.getPendingVerifications());
    }

    @PatchMapping("/verification/{id}/verify")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<Student> verifyStudent(@PathVariable Long id, @RequestBody VerifyRequest request) {
        return ResponseEntity.ok(registrarService.verifyStudent(id, request.getVerificationStatus()));
    }

    @GetMapping("/university-affiliation")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<com.example.demo.model.UniversityAffiliation>> getUniversityAffiliations() {
        return ResponseEntity.ok(registrarService.getUniversityAffiliations());
    }

    @GetMapping("/convocation/eligible")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<AcademicRecord>> getEligibleForConvocation() {
        return ResponseEntity.ok(registrarService.getEligibleForConvocation());
    }

    private final com.example.demo.service.SequenceGeneratorService sequenceGeneratorService;

    @GetMapping("/students/generate-enrollment")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<java.util.Map<String, String>> generateEnrollment(
            @org.springframework.web.bind.annotation.RequestParam("year") int year,
            @org.springframework.web.bind.annotation.RequestParam("branch") String branch) {
        String enrollmentNumber = sequenceGeneratorService.generateNextEnrollmentNumber(year, branch);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("enrollmentNumber", enrollmentNumber);
        return ResponseEntity.ok(response);
    }
}
