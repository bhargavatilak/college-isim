package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentPortalService {
    @Autowired private StudentPortalAccountRepository accountRepo;
    @Autowired private StudentRequestRepository requestRepo;
    @Autowired private StudentNotificationRepository notificationRepo;

    public List<StudentPortalAccount> getAllAccounts() {
        return accountRepo.findAll();
    }
    
    public Optional<StudentPortalAccount> getAccountById(UUID id) {
        return accountRepo.findById(id);
    }
    
    public StudentPortalAccount createAccount(StudentPortalAccount account) {
        return accountRepo.save(account);
    }

    public List<StudentRequest> getPendingRequests() {
        // Assume default find all, can be expanded
        return requestRepo.findAll();
    }

    public StudentRequest approveRequest(UUID requestId) {
        StudentRequest req = requestRepo.findById(requestId).orElseThrow();
        req.setStatus("APPROVED");
        return requestRepo.save(req);
    }

    public StudentNotification sendNotification(StudentNotification notif) {
        return notificationRepo.save(notif);
    }
}
