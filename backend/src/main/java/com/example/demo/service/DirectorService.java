package com.example.demo.service;

import com.example.demo.dto.AttendanceOverviewDTO;
import com.example.demo.dto.ExamOverviewDTO;
import com.example.demo.model.AcademicYear;
import com.example.demo.model.Course;
import com.example.demo.model.Announcement;
import com.example.demo.model.Notification;
import com.example.demo.model.PolicyDocument;
import com.example.demo.repository.AcademicYearRepository;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.PolicyDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectorService {

    private final CourseRepository courseRepository;
    private final AcademicYearRepository academicYearRepository;
    private final PolicyDocumentRepository policyDocumentRepository;
    private final AnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }

    public AcademicYear createAcademicYear(AcademicYear academicYear) {
        return academicYearRepository.save(academicYear);
    }

    public AttendanceOverviewDTO getAttendanceOverview() {
        // Return mock overview data as requested
        return new AttendanceOverviewDTO(1500, 1420, 94.5);
    }

    public ExamOverviewDTO getExamOverview() {
        // Return mock overview data as requested
        return new ExamOverviewDTO(3, 1, 10, 85.0);
    }

    public List<PolicyDocument> getAllPolicies() {
        return policyDocumentRepository.findAll();
    }

    public PolicyDocument createPolicy(PolicyDocument policy) {
        return policyDocumentRepository.save(policy);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public com.example.demo.dto.FinanceOverviewDTO getFinanceOverview() {
        return new com.example.demo.dto.FinanceOverviewDTO(500000.0, 50000.0, 150L);
    }

    public com.example.demo.dto.LibraryOverviewDTO getLibraryOverview() {
        return new com.example.demo.dto.LibraryOverviewDTO(10000L, 2500L, 7500L);
    }

    public com.example.demo.dto.AdmissionOverviewDTO getAdmissionOverview() {
        return new com.example.demo.dto.AdmissionOverviewDTO(1200L, 800L, 400L);
    }
}
