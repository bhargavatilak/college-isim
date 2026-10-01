package com.example.demo.controller;

import com.example.demo.entity.IdCard;
import com.example.demo.service.IdCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrar/id-cards")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REGISTRAR')")
public class RegistrarIdCardController {

    private final IdCardService idCardService;

    @GetMapping
    public ResponseEntity<List<IdCard>> getAllIdCards() {
        return ResponseEntity.ok(idCardService.getAllIdCards());
    }

    @PostMapping("/generate")
    public ResponseEntity<IdCard> generateIdCard(@RequestParam Long studentId) {
        return ResponseEntity.ok(idCardService.generateIdCard(studentId));
    }
}
