package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SequenceGeneratorService {

    private final StudentRepository studentRepository;

    public SequenceGeneratorService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized String generateNextEnrollmentNumber(int year, String branch) {
        String yearStr = String.valueOf(year);
        String yy = yearStr.length() > 2 ? yearStr.substring(yearStr.length() - 2) : yearStr;
        String prefix = yy + branch.toUpperCase();

        Student highestStudent = studentRepository.findTopByEnrollmentNumberStartingWithOrderByEnrollmentNumberDesc(prefix);

        int nextNumber = 1;
        if (highestStudent != null && highestStudent.getEnrollmentNumber() != null) {
            String currentMax = highestStudent.getEnrollmentNumber();
            String numberPart = currentMax.substring(prefix.length());
            try {
                nextNumber = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                // fallback to 1 if something is wrong
            }
        }

        return prefix + String.format("%03d", nextNumber);
    }
}
