package com.example.demo.repository;
import com.example.demo.entity.StudentCorrection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface StudentCorrectionRepository extends JpaRepository<StudentCorrection, UUID> {
    // Add default methods here as needed
}
