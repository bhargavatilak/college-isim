package com.example.demo.service.audit;

import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    public void logAction(String user, String role, String action, String details) {
        // Simple audit log implementation - in real scenario, persist to DB or external system
        System.out.println("AUDIT - User: " + user + ", Role: " + role + ", Action: " + action + ", Details: " + details);
    }
}
