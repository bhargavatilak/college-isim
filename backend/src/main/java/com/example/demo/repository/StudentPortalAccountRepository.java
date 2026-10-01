package com.example.demo.repository;
import com.example.demo.entity.StudentPortalAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface StudentPortalAccountRepository extends JpaRepository<StudentPortalAccount, UUID> {
    // Add default methods here as needed
}
