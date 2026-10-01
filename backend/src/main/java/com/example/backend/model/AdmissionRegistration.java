package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admission_registrations")
public class AdmissionRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String mobile;
    private String dateOfBirth;

    private String courseAppliedFor;

    private String marks10th;
    private String marks12th;

    private String competitiveExamName;
    private Double competitiveExamScore;

    private String status;

    public AdmissionRegistration() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCourseAppliedFor() {
        return courseAppliedFor;
    }

    public void setCourseAppliedFor(String courseAppliedFor) {
        this.courseAppliedFor = courseAppliedFor;
    }

    public String getMarks10th() {
        return marks10th;
    }

    public void setMarks10th(String marks10th) {
        this.marks10th = marks10th;
    }

    public String getMarks12th() {
        return marks12th;
    }

    public void setMarks12th(String marks12th) {
        this.marks12th = marks12th;
    }

    public String getCompetitiveExamName() {
        return competitiveExamName;
    }

    public void setCompetitiveExamName(String competitiveExamName) {
        this.competitiveExamName = competitiveExamName;
    }

    public Double getCompetitiveExamScore() {
        return competitiveExamScore;
    }

    public void setCompetitiveExamScore(Double competitiveExamScore) {
        this.competitiveExamScore = competitiveExamScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
