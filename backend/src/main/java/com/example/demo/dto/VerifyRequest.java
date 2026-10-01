package com.example.demo.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String verificationStatus;

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

}
