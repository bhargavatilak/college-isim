package com.example.demo.repository;

import com.example.demo.entity.StudentMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentMovementRepository extends JpaRepository<StudentMovement, Long> {
    List<StudentMovement> findByStudentId(Long studentId);
}
