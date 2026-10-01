package com.example.backend.controller;

import com.example.backend.model.HelpDeskRequest;
import com.example.backend.repository.HelpDeskRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/helpdesk")
public class HelpDeskController {

    @Autowired
    private HelpDeskRequestRepository repository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('OFFICE_HELP_DESK')")
    public ResponseEntity<?> getDashboardStats() {
        long total = repository.count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", total);
        stats.put("pendingRequests", 5);
        stats.put("resolvedRequests", total > 5 ? total - 5 : 0);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/requests")
    @PreAuthorize("hasRole('OFFICE_HELP_DESK')")
    public ResponseEntity<?> getRequests(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        Page<HelpDeskRequest> requests = repository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requests")
    @PreAuthorize("hasRole('OFFICE_HELP_DESK')")
    public ResponseEntity<?> createRequest(@RequestBody HelpDeskRequest request) {
        request.setCreatedDate(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        HelpDeskRequest saved = repository.save(request);
        return ResponseEntity.ok(saved);
    }
}
