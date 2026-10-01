package com.example.demo.repository;
import com.example.demo.entity.StudentPortalPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface StudentPortalPermissionRepository extends JpaRepository<StudentPortalPermission, UUID> {
    // Add default methods here as needed
}
