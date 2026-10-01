package com.example.demo.service;

import com.example.demo.entity.IdCard;
import com.example.demo.repository.IdCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IdCardService {
    private final IdCardRepository idCardRepository;

    public List<IdCard> getAllIdCards() {
        return idCardRepository.findAll();
    }

    @Transactional
    public IdCard generateIdCard(Long studentId) {
        IdCard card = new IdCard();
        card.setStudentId(studentId);
        card.setCardNumber("ID-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        card.setIssueDate(LocalDate.now());
        card.setExpiryDate(LocalDate.now().plusYears(4));
        card.setStatus(IdCard.IdCardStatus.ACTIVE);
        return idCardRepository.save(card);
    }
}
