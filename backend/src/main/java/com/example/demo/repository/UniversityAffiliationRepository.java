package com.example.demo.repository;

import com.example.demo.model.UniversityAffiliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityAffiliationRepository extends JpaRepository<UniversityAffiliation, Long> {
}
