package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.payload.request.HODRequest;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.HODRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class HODService {

    @Autowired
    private HODRepository hodRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    public List<HOD> getAllHODs() {
        return hodRepository.findAll();
    }

    @Transactional
    public HOD createHOD(HODRequest request) {
        if (hodRepository.existsByHodId(request.getHodId())) {
            throw new RuntimeException("Error: HOD ID is already taken!");
        }

        if (hodRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        HOD hod = new HOD();
        hod.setFullName(request.getFullName());
        hod.setHodId(request.getHodId());
        hod.setEmail(request.getEmail());
        hod.setMobile(request.getMobile());
        hod.setQualification(request.getQualification());
        hod.setExperience(request.getExperience());
        hod.setJoiningDate(request.getJoiningDate());
        hod.setStatus(HODStatus.ACTIVE);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Error: Department not found."));
            hod.setDepartment(dept);
        }

        // Create user account for HOD
        User user = new User(request.getHodId(), 
                             request.getEmail(),
                             encoder.encode("password123")); // Default password

        Set<Role> roles = new HashSet<>();
        Role hodRole = roleRepository.findByName(ERole.ROLE_HOD)
                .orElseGet(() -> {
                    Role r = new Role(ERole.ROLE_HOD);
                    return roleRepository.save(r);
                });
        roles.add(hodRole);
        user.setRoles(roles);
        
        userRepository.save(user);
        hod.setUser(user);

        return hodRepository.save(hod);
    }

    @Transactional
    public HOD updateHOD(Long id, HODRequest request) {
        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: HOD not found."));

        if (!hod.getHodId().equals(request.getHodId()) && hodRepository.existsByHodId(request.getHodId())) {
            throw new RuntimeException("Error: HOD ID is already taken!");
        }

        if (!hod.getEmail().equals(request.getEmail()) && hodRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        hod.setFullName(request.getFullName());
        hod.setHodId(request.getHodId());
        hod.setEmail(request.getEmail());
        hod.setMobile(request.getMobile());
        hod.setQualification(request.getQualification());
        hod.setExperience(request.getExperience());
        hod.setJoiningDate(request.getJoiningDate());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Error: Department not found."));
            hod.setDepartment(dept);
        } else {
            hod.setDepartment(null);
        }

        return hodRepository.save(hod);
    }

    @Transactional
    public void updateHODStatus(Long id, HODStatus status) {
        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: HOD not found."));
        hod.setStatus(status);
        hodRepository.save(hod);
    }

    @Transactional
    public void deleteHOD(Long id) {
        HOD hod = hodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: HOD not found."));
        if (hod.getUser() != null) {
            userRepository.delete(hod.getUser());
        }
        hodRepository.delete(hod);
    }
}
