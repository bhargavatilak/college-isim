package com.example.demo.service.impl;

import com.example.demo.dto.StudentDto;
import com.example.demo.model.AcademicRecord;
import com.example.demo.model.Semester;
import com.example.demo.model.Student;
import com.example.demo.repository.AcademicRecordRepository;
import com.example.demo.repository.SemesterRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.service.RegistrarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.example.demo.model.Announcement;
import com.example.demo.model.Notification;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UniversityAffiliationRepository;
import com.example.demo.model.UniversityAffiliation;

@Service
@RequiredArgsConstructor
public class RegistrarServiceImpl implements RegistrarService {

    private final AcademicRecordRepository academicRecordRepository;
    private final SemesterRepository semesterRepository;
    private final StudentRepository studentRepository;
    private final AnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;
    private final UniversityAffiliationRepository universityAffiliationRepository;

    @Override
    public List<AcademicRecord> getAllAcademicRecords() {
        return academicRecordRepository.findAll();
    }

    @Override
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    @Override
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Override
    public Student registerStudent(StudentDto dto) {
        Student student = new Student();
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setStatus("ACTIVE");
        student.setVerificationStatus("PENDING");
        return studentRepository.save(student);
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Override
    public Student updateStudentStatus(Long id, String status) {
        Student student = getStudentById(id);
        student.setStatus(status);
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getPendingVerifications() {
        return studentRepository.findByVerificationStatus("PENDING");
    }

    @Override
    public Student verifyStudent(Long id, String verificationStatus) {
        Student student = getStudentById(id);
        student.setVerificationStatus(verificationStatus);
        return studentRepository.save(student);
    }

    @Override
    public List<Announcement> getAnnouncements() {
        return announcementRepository.findAll();
    }

    @Override
    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Map<String, Object> getSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("notificationPreferences", "EMAIL_ONLY");
        settings.put("theme", "LIGHT");
        settings.put("language", "en");
        return settings;
    }

    @Override
    public List<UniversityAffiliation> getUniversityAffiliations() {
        return universityAffiliationRepository.findAll();
    }

    @Override
    public List<AcademicRecord> getEligibleForConvocation() {
        // e.g. return records where status is "GRADUATED"
        return academicRecordRepository.findAll().stream()
                .filter(record -> "GRADUATED".equalsIgnoreCase(record.getStatus()))
                .toList();
    }
}
