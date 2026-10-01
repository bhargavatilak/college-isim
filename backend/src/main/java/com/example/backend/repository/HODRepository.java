package com.example.backend.repository;

import com.example.backend.model.HOD;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HODRepository extends JpaRepository<HOD, Long> {
    boolean existsByHodId(String hodId);
    boolean existsByEmail(String email);
}
