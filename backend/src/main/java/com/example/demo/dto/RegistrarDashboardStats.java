package com.example.demo.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarDashboardStats {
    private long totalStudents;
    private long newAdmissions;
    private long pendingAdmissions;

    

    

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getNewAdmissions() {
        return newAdmissions;
    }

    public void setNewAdmissions(long newAdmissions) {
        this.newAdmissions = newAdmissions;
    }

    public long getPendingAdmissions() {
        return pendingAdmissions;
    }

    public void setPendingAdmissions(long pendingAdmissions) {
        this.pendingAdmissions = pendingAdmissions;
    }

}
