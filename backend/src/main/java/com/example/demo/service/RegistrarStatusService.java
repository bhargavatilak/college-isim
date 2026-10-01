package com.example.demo.service;

import com.example.demo.dto.PromoteStudentRequest;
import com.example.demo.entity.StudentMovement;
import com.example.demo.repository.StudentMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrarStatusService {

    private final StudentMovementRepository repository;

    public List<StudentMovement> getMovementHistory() {
        return repository.findAll();
    }

    public StudentMovement promoteStudent(PromoteStudentRequest request) {
        StudentMovement movement = new StudentMovement();
        movement.setStudentId(request.getStudentId());
        movement.setFromYear(request.getFromYear());
        movement.setToYear(request.getToYear());
        movement.setStatus(request.getStatus());
        movement.setMovementDate(LocalDateTime.now());
        return repository.save(movement);
    }
}
