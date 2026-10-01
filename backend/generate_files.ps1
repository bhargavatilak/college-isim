$basePath = "C:\Users\Dell\Downloads\isim\college-isim\backend\src\main\java\com\example\demo"
$entityPath = "$basePath\entity"
$repoPath = "$basePath\repository"
$servicePath = "$basePath\service"
$controllerPath = "$basePath\controller"

New-Item -ItemType Directory -Force -Path $entityPath
New-Item -ItemType Directory -Force -Path $repoPath
New-Item -ItemType Directory -Force -Path $servicePath
New-Item -ItemType Directory -Force -Path $controllerPath

$entities = @{
    "StudentPortalAccount" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_portal_accounts`")
public class StudentPortalAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"student_id`", unique = true, nullable = false, length = 50)
    private String studentId;
    
    @Column(name = `"password_hash`", nullable = false, length = 255)
    private String passwordHash;
    
    @Column(length = 20)
    private String status = `"ACTIVE`";
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = `"updated_at`")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
"@;

    "StudentPortalPermission" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_portal_permissions`")
public class StudentPortalPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"account_id`")
    private UUID accountId;
    
    @Column(nullable = false, length = 50)
    private String permission;
    
    @Column(name = `"granted_at`")
    private LocalDateTime grantedAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
    public LocalDateTime getGrantedAt() { return grantedAt; }
    public void setGrantedAt(LocalDateTime grantedAt) { this.grantedAt = grantedAt; }
}
"@;

    "StudentRequest" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_requests`")
public class StudentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"student_id`", nullable = false, length = 50)
    private String studentId;
    
    @Column(name = `"request_type`", nullable = false, length = 100)
    private String requestType;
    
    @Column(length = 20)
    private String status = `"PENDING`";
    
    @Column(columnDefinition = `"TEXT`")
    private String details;
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = `"updated_at`")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
"@;

    "StudentNotification" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_notifications`")
public class StudentNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"student_id`", nullable = false, length = 50)
    private String studentId;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = `"TEXT`", nullable = false)
    private String message;
    
    @Column(name = `"is_read`")
    private Boolean isRead = false;
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
"@;

    "StudentActivityLog" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_activity_logs`")
public class StudentActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"student_id`", nullable = false, length = 50)
    private String studentId;
    
    @Column(nullable = false, length = 255)
    private String action;
    
    @Column(name = `"ip_address`", length = 45)
    private String ipAddress;
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
"@;

    "AuditLog" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"audit_logs`")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"user_id`", nullable = false, length = 50)
    private String userId;
    
    @Column(nullable = false, length = 255)
    private String action;
    
    @Column(columnDefinition = `"TEXT`")
    private String details;
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
"@;

    "StudentCorrection" = @"
package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = `"student_corrections`")
public class StudentCorrection {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = `"student_id`", nullable = false, length = 50)
    private String studentId;
    
    @Column(name = `"field_name`", nullable = false, length = 100)
    private String fieldName;
    
    @Column(name = `"old_value`", columnDefinition = `"TEXT`")
    private String oldValue;
    
    @Column(name = `"new_value`", columnDefinition = `"TEXT`")
    private String newValue;
    
    @Column(length = 20)
    private String status = `"PENDING`";
    
    @Column(name = `"created_at`")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
"@;
}

foreach ($key in $entities.Keys) {
    Set-Content -Path "$entityPath\$key.java" -Value $entities[$key]
}

$repositories = @(
    "StudentPortalAccount", "StudentPortalPermission", "StudentRequest", 
    "StudentNotification", "StudentActivityLog", "AuditLog", "StudentCorrection"
)

foreach ($repo in $repositories) {
    $content = @"
package com.example.demo.repository;
import com.example.demo.entity.$repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ${repo}Repository extends JpaRepository<$repo, UUID> {
    // Add default methods here as needed
}
"@
    Set-Content -Path "$repoPath\${repo}Repository.java" -Value $content
}

$serviceContent = @"
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
"@

Set-Content -Path "$servicePath\StudentPortalService.java" -Value $serviceContent

$controllerContent = @"
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
"@

Set-Content -Path "$controllerPath\StudentPortalController.java" -Value $controllerContent

Write-Host "Files created successfully."
