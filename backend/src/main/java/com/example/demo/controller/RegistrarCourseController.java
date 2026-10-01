package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Department;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrar/courses")
@PreAuthorize("hasAnyRole('REGISTRAR', 'DIRECTOR')")
public class RegistrarCourseController {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        if (course.getDepartment() != null && course.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(course.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            course.setDepartment(department);
        }
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> editCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setName(courseDetails.getName());
        course.setDuration(courseDetails.getDuration());
        course.setDegreeType(courseDetails.getDegreeType());
        course.setIntake(courseDetails.getIntake());
        course.setPattern(courseDetails.getPattern());
        
        if (courseDetails.getDepartment() != null && courseDetails.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(courseDetails.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            course.setDepartment(department);
        }
        
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Course> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setActive(payload.get("active"));
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        return ResponseEntity.ok(course);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<String>> getCourseHistory(@PathVariable Long id) {
        // Mock history for now
        return ResponseEntity.ok(List.of("Created course", "Updated course details"));
    }
}
