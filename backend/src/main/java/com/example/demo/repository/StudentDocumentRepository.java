package com.example.demo.repository;

import com.example.demo.entity.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {
    List<StudentDocument> findByApplicationId(Long applicationId);
    List<StudentDocument> findByAdmissionNumber(String admissionNumber);
}
