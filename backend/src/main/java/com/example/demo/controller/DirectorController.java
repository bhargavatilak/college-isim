package com.example.demo.controller;

import com.example.demo.dto.AttendanceOverviewDTO;
import com.example.demo.dto.ExamOverviewDTO;
import com.example.demo.model.AcademicYear;
import com.example.demo.model.Announcement;
import com.example.demo.model.Course;
import com.example.demo.model.Notification;
import com.example.demo.model.PolicyDocument;
import com.example.demo.service.DirectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/director")
@RequiredArgsConstructor
public class DirectorController {

    private final DirectorService directorService;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        return ResponseEntity.ok(directorService.getAllCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(directorService.createCourse(course));
    }

    @GetMapping("/academic-years")
    public ResponseEntity<List<AcademicYear>> getAcademicYears() {
        return ResponseEntity.ok(directorService.getAllAcademicYears());
    }

    @PostMapping("/academic-years")
    public ResponseEntity<AcademicYear> createAcademicYear(@RequestBody AcademicYear academicYear) {
        return ResponseEntity.ok(directorService.createAcademicYear(academicYear));
    }

    @GetMapping("/attendance-overview")
    public ResponseEntity<AttendanceOverviewDTO> getAttendanceOverview() {
        return ResponseEntity.ok(directorService.getAttendanceOverview());
    }

    @GetMapping("/examination-overview")
    public ResponseEntity<ExamOverviewDTO> getExaminationOverview() {
        return ResponseEntity.ok(directorService.getExamOverview());
    }

    @GetMapping("/policies")
    public ResponseEntity<List<PolicyDocument>> getPolicies() {
        return ResponseEntity.ok(directorService.getAllPolicies());
    }

    @PostMapping("/policies")
    public ResponseEntity<PolicyDocument> createPolicy(@RequestBody PolicyDocument policy) {
        return ResponseEntity.ok(directorService.createPolicy(policy));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(directorService.getAllAnnouncements());
    }

    @PostMapping("/announcements")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(directorService.createAnnouncement(announcement));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(directorService.getAllNotifications());
    }

    @PostMapping("/notifications")
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(directorService.createNotification(notification));
    }

    @GetMapping("/finance-overview")
    public ResponseEntity<com.example.demo.dto.FinanceOverviewDTO> getFinanceOverview() {
        return ResponseEntity.ok(directorService.getFinanceOverview());
    }

    @GetMapping("/library-overview")
    public ResponseEntity<com.example.demo.dto.LibraryOverviewDTO> getLibraryOverview() {
        return ResponseEntity.ok(directorService.getLibraryOverview());
    }

    @GetMapping("/admission-overview")
    public ResponseEntity<com.example.demo.dto.AdmissionOverviewDTO> getAdmissionOverview() {
        return ResponseEntity.ok(directorService.getAdmissionOverview());
    }
}
