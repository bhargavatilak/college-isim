package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.StudentPortalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/portal")
public class StudentPortalController {
    
    @Autowired
    private StudentPortalService portalService;

    @GetMapping("/accounts")
    public List<StudentPortalAccount> getAllAccounts() {
        return portalService.getAllAccounts();
    }
    
    @PostMapping("/accounts")
    public StudentPortalAccount createAccount(@RequestBody StudentPortalAccount account) {
        return portalService.createAccount(account);
    }

    @GetMapping("/requests/pending")
    public List<StudentRequest> getPendingRequests() {
        return portalService.getPendingRequests();
    }
    
    @PostMapping("/requests/{id}/approve")
    public ResponseEntity<StudentRequest> approveRequest(@PathVariable UUID id) {
        return ResponseEntity.ok(portalService.approveRequest(id));
    }
    
    @PostMapping("/notifications")
    public StudentNotification sendNotification(@RequestBody StudentNotification notification) {
        return portalService.sendNotification(notification);
    }
}
