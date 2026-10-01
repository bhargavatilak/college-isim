package com.example.demo.controller;

import com.example.demo.dto.StudentDocumentDto;
import com.example.demo.entity.StudentDocument;
import com.example.demo.service.StudentDocumentService;
import org.springframework.core.io.PathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class StudentDocumentController {

    private final StudentDocumentService studentDocumentService;

    public StudentDocumentController(StudentDocumentService studentDocumentService) {
        this.studentDocumentService = studentDocumentService;
    }

    private StudentDocumentDto toDto(StudentDocument doc) {
        StudentDocumentDto dto = new StudentDocumentDto();
        dto.setId(doc.getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setOriginalFileName(doc.getOriginalFileName());
        dto.setStoredFileName(doc.getStoredFileName());
        dto.setFileSize(doc.getFileSize());
        dto.setMimeType(doc.getMimeType());
        dto.setUploadStatus(doc.getUploadStatus().name());
        dto.setVerificationStatus(doc.getVerificationStatus().name());
        dto.setUploadedAt(doc.getUploadedAt());
        dto.setVerifiedAt(doc.getVerifiedAt());
        dto.setRejectionReason(doc.getRejectionReason());
        dto.setVersion(doc.getVersion());
        return dto;
    }

    @PostMapping("/admissions/{applicationId}/documents")
    @PreAuthorize("hasAnyRole('ADMISSION_CELL','REGISTRAR','OFFICE_HELP_DESK')")
    public ResponseEntity<StudentDocumentDto> uploadDocument(
            @PathVariable Long applicationId,
            @RequestParam String admissionNumber,
            @RequestParam String documentType,
            @RequestParam String uploadedBy,
            @RequestParam("file") MultipartFile file) throws IOException {
        StudentDocument saved = studentDocumentService.uploadDocument(applicationId, admissionNumber, file, documentType, uploadedBy);
        return new ResponseEntity<>(toDto(saved), HttpStatus.CREATED);
    }

    @GetMapping("/admissions/{applicationId}/documents")
    @PreAuthorize("hasAnyRole('ADMISSION_CELL','REGISTRAR','OFFICE_HELP_DESK')")
    public List<StudentDocumentDto> listByApplication(@PathVariable Long applicationId) {
        return studentDocumentService.getDocumentsByApplicationId(applicationId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/documents/{documentId}/download")
    @PreAuthorize("hasAnyRole('ADMISSION_CELL','REGISTRAR','OFFICE_HELP_DESK')")
    public ResponseEntity<PathResource> downloadDocument(@PathVariable Long documentId) throws IOException {
        Path filePath = studentDocumentService.downloadDocument(documentId);
        PathResource resource = new PathResource(filePath);
        String mimeType = Files.probeContentType(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .contentType(MediaType.parseMediaType(mimeType != null ? mimeType : "application/octet-stream"))
                .body(resource);
    }

    @PostMapping("/documents/{documentId}/verify")
    @PreAuthorize("hasAnyRole('REGISTRAR')")
    public StudentDocumentDto verifyDocument(@PathVariable Long documentId,
                                            @RequestParam String verifiedBy) {
        StudentDocument doc = studentDocumentService.verifyDocument(documentId, verifiedBy);
        return toDto(doc);
    }

    @PostMapping("/documents/{documentId}/reject")
    @PreAuthorize("hasAnyRole('REGISTRAR')")
    public StudentDocumentDto rejectDocument(@PathVariable Long documentId,
                                            @RequestParam String reason,
                                            @RequestParam String rejectedBy) {
        StudentDocument doc = studentDocumentService.rejectDocument(documentId, reason, rejectedBy);
        return toDto(doc);
    }

    @PostMapping("/documents/{documentId}/replace")
    @PreAuthorize("hasAnyRole('ADMISSION_CELL','REGISTRAR','OFFICE_HELP_DESK')")
    public StudentDocumentDto replaceDocument(@PathVariable Long documentId,
                                             @RequestParam String uploadedBy,
                                             @RequestParam("file") MultipartFile file) throws IOException {
        StudentDocument doc = studentDocumentService.replaceDocument(documentId, file, uploadedBy);
        return toDto(doc);
    }

    @DeleteMapping("/documents/{documentId}")
    @PreAuthorize("hasAnyRole('OFFICE_HELP_DESK')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId,
                                               @RequestParam String requestedBy) {
        studentDocumentService.deleteDocument(documentId, requestedBy);
        return ResponseEntity.noContent().build();
    }
}
