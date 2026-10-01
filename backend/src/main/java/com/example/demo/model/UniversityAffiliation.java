package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "university_affiliations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UniversityAffiliation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String universityName;

    @Column(nullable = false)
    private String affiliationCode;

    @Column(nullable = false)
    private String programName;

    private LocalDate validUntil;
    
    @Column(nullable = false)
    private String status;
}
