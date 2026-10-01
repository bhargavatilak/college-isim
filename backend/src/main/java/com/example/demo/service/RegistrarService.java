package com.example.demo.service;

import com.example.demo.model.AcademicRecord;
import com.example.demo.model.Semester;
import com.example.demo.model.Student;
import com.example.demo.dto.StudentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import com.example.demo.model.Announcement;
import com.example.demo.model.Notification;

public interface RegistrarService {
    List<AcademicRecord> getAllAcademicRecords();
    List<Semester> getAllSemesters();
    
    Page<Student> getAllStudents(Pageable pageable);
    Student registerStudent(StudentDto dto);
    Student getStudentById(Long id);
    Student updateStudentStatus(Long id, String status);
    List<Student> getPendingVerifications();
    Student verifyStudent(Long id, String verificationStatus);
    
    List<Announcement> getAnnouncements();
    List<Notification> getNotifications();
    Map<String, Object> getSettings();

    List<com.example.demo.model.UniversityAffiliation> getUniversityAffiliations();
    List<AcademicRecord> getEligibleForConvocation();
}
