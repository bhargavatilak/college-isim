package com.example.demo.controller;

import com.example.demo.entity.Document;
import com.example.demo.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/documents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REGISTRAR')")
public class RegistrarDocumentController {
    
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Document> verifyDocument(
            @PathVariable Long id,
            @RequestParam Document.DocumentStatus status) {
        return ResponseEntity.ok(documentService.verifyDocument(id, status));
    }
}
