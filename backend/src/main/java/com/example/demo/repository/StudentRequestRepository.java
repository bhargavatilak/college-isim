package com.example.demo.repository;
import com.example.demo.entity.StudentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface StudentRequestRepository extends JpaRepository<StudentRequest, UUID> {
    // Add default methods here as needed
}
