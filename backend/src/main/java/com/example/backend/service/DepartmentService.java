package com.example.backend.service;

import com.example.backend.model.Department;
import com.example.backend.model.DepartmentStatus;
import com.example.backend.payload.request.DepartmentRequest;
import com.example.backend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Department is not found."));
    }

    public Department createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Error: Department name is already taken!");
        }

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Error: Department code is already taken!");
        }

        Department department = new Department();
        department.setName(request.getName());
        department.setCode(request.getCode());
        department.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            department.setStatus(request.getStatus());
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, DepartmentRequest request) {
        Department department = getDepartmentById(id);

        if (!department.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Error: Department name is already taken!");
        }

        if (!department.getCode().equals(request.getCode()) && departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Error: Department code is already taken!");
        }

        department.setName(request.getName());
        department.setCode(request.getCode());
        department.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            department.setStatus(request.getStatus());
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartmentStatus(Long id, DepartmentStatus status) {
        Department department = getDepartmentById(id);
        department.setStatus(status);
        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
