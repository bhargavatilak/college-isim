package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionOverviewDTO {
    private Long totalApplications;
    private Long acceptedApplications;
    private Long pendingApplications;

    

    

    public Long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(Long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public Long getAcceptedApplications() {
        return acceptedApplications;
    }

    public void setAcceptedApplications(Long acceptedApplications) {
        this.acceptedApplications = acceptedApplications;
    }

    public Long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(Long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

}
