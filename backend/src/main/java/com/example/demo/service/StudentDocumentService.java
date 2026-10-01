package com.example.demo.service;

import com.example.demo.entity.StudentDocument;
import com.example.demo.entity.UploadStatus;
import com.example.demo.entity.VerificationStatus;
import com.example.demo.repository.StudentDocumentRepository;
import com.example.demo.service.audit.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentDocumentService {

    private final StudentDocumentRepository studentDocumentRepository;
    private final AuditLogService auditLogService;

    @Value("${document.storage.path:uploads/documents}")
    private String storageDir;

    @Value("${document.maxFileSize:10485760}") // 10 MB default
    private long maxFileSize;

    private static final List<String> ALLOWED_TYPES = List.of("application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp");

    public StudentDocument uploadDocument(Long applicationId, String admissionNumber, MultipartFile file, String documentType, String uploadedBy) throws IOException {
        validateFile(file);
        Path storagePath = ensureStoragePath();
        String originalFileName = file.getOriginalFilename();
        String extension = Optional.ofNullable(originalFileName)
                .filter(name -> name.contains("."))
                .map(name -> name.substring(name.lastIndexOf('.')))
                .orElse("");
        String storedFileName = generateStoredFileName(extension);
        Files.copy(file.getInputStream(), storagePath.resolve(storedFileName), StandardCopyOption.REPLACE_EXISTING);

        StudentDocument doc = new StudentDocument();
        doc.setApplicationId(applicationId);
        doc.setAdmissionNumber(admissionNumber);
        doc.setDocumentType(documentType);
        doc.setOriginalFileName(originalFileName);
        doc.setStoredFileName(storedFileName);
        doc.setStoragePath(storagePath.toString());
        doc.setMimeType(file.getContentType());
        doc.setFileSize(file.getSize());
        doc.setUploadedBy(uploadedBy);
        doc.setUploadedAt(LocalDateTime.now());
        doc.setUploadStatus(UploadStatus.UPLOADED);
        doc.setVerificationStatus(VerificationStatus.PENDING);
        StudentDocument saved = studentDocumentRepository.save(doc);
        auditLogService.logAction(uploadedBy, "ROLE_ADMISSION_CELL", "UPLOAD_DOCUMENT", "Document ID " + saved.getId());
        return saved;
    }

    private void validateFile(MultipartFile file) {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Unsupported file type: " + file.getContentType());
        }
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds limit of " + maxFileSize + " bytes");
        }
    }

    private Path ensureStoragePath() throws IOException {
        Path path = Path.of(storageDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path;
    }

    private String generateStoredFileName(String extension) {
        String year = String.valueOf(LocalDateTime.now().getYear());
        String uuid = UUID.randomUUID().toString();
        return "DOC_" + year + "_" + uuid + extension;
    }

    public List<StudentDocument> getDocumentsByApplicationId(Long applicationId) {
        return studentDocumentRepository.findByApplicationId(applicationId);
    }

    public List<StudentDocument> getDocumentsByAdmissionNumber(String admissionNumber) {
        return studentDocumentRepository.findByAdmissionNumber(admissionNumber);
    }

    public Path downloadDocument(Long documentId) throws IOException {
        StudentDocument doc = studentDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        Path filePath = Path.of(doc.getStoragePath()).resolve(doc.getStoredFileName());
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("File missing on storage");
        }
        return filePath;
    }

    @Transactional
    public StudentDocument verifyDocument(Long documentId, String verifiedBy) {
        StudentDocument doc = studentDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setVerificationStatus(VerificationStatus.VERIFIED);
        doc.setVerifiedBy(verifiedBy);
        doc.setVerifiedAt(LocalDateTime.now());
        auditLogService.logAction(verifiedBy, "ROLE_REGISTRAR", "VERIFY_DOCUMENT", "Document ID " + documentId);
        return doc;
    }

    @Transactional
    public StudentDocument rejectDocument(Long documentId, String reason, String rejectedBy) {
        StudentDocument doc = studentDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setVerificationStatus(VerificationStatus.REJECTED);
        doc.setRejectionReason(reason);
        doc.setVerifiedBy(rejectedBy);
        doc.setVerifiedAt(LocalDateTime.now());
        auditLogService.logAction(rejectedBy, "ROLE_REGISTRAR", "REJECT_DOCUMENT", "Document ID " + documentId + ", Reason: " + reason);
        return doc;
    }

    @Transactional
    public StudentDocument replaceDocument(Long documentId, MultipartFile newFile, String uploadedBy) throws IOException {
        validateFile(newFile);
        StudentDocument oldDoc = studentDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        oldDoc.setUploadStatus(UploadStatus.REPLACED);
        studentDocumentRepository.save(oldDoc);
        Path storagePath = ensureStoragePath();
        String storedFileName = generateStoredFileName(Optional.ofNullable(newFile.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse(""));
        Files.copy(newFile.getInputStream(), storagePath.resolve(storedFileName), StandardCopyOption.REPLACE_EXISTING);
        StudentDocument newDoc = new StudentDocument();
        newDoc.setApplicationId(oldDoc.getApplicationId());
        newDoc.setAdmissionNumber(oldDoc.getAdmissionNumber());
        newDoc.setDocumentType(oldDoc.getDocumentType());
        newDoc.setOriginalFileName(newFile.getOriginalFilename());
        newDoc.setStoredFileName(storedFileName);
        newDoc.setStoragePath(storagePath.toString());
        newDoc.setMimeType(newFile.getContentType());
        newDoc.setFileSize(newFile.getSize());
        newDoc.setUploadedBy(uploadedBy);
        newDoc.setUploadedAt(LocalDateTime.now());
        newDoc.setUploadStatus(UploadStatus.UPLOADED);
        newDoc.setVerificationStatus(VerificationStatus.PENDING);
        newDoc.setVersion(oldDoc.getVersion() != null ? oldDoc.getVersion() + 1 : 1L);
        StudentDocument saved = studentDocumentRepository.save(newDoc);
        auditLogService.logAction(uploadedBy, "ROLE_ADMISSION_CELL", "REPLACE_DOCUMENT", "Old ID " + documentId + ", New ID " + saved.getId());
        return saved;
    }

    @Transactional
    public void deleteDocument(Long documentId, String requestedBy) {
        StudentDocument doc = studentDocumentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setUploadStatus(UploadStatus.DELETED);
        studentDocumentRepository.save(doc);
        auditLogService.logAction(requestedBy, "ROLE_OFFICE_HELP_DESK", "DELETE_DOCUMENT", "Document ID " + documentId);
    }
}
