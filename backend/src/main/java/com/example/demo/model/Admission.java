package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Admission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String courseApplied;
    private String status; // e.g. "PENDING", "ACCEPTED", "REJECTED"
    private LocalDate applicationDate;
}
