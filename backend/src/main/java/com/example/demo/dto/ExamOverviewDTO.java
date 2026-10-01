package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamOverviewDTO {
    private int upcomingExams;
    private int ongoingExams;
    private int completedExams;
    private double averagePassPercentage;

    

    

    public int getUpcomingExams() {
        return upcomingExams;
    }

    public void setUpcomingExams(int upcomingExams) {
        this.upcomingExams = upcomingExams;
    }

    public int getOngoingExams() {
        return ongoingExams;
    }

    public void setOngoingExams(int ongoingExams) {
        this.ongoingExams = ongoingExams;
    }

    public int getCompletedExams() {
        return completedExams;
    }

    public void setCompletedExams(int completedExams) {
        this.completedExams = completedExams;
    }

    public double getAveragePassPercentage() {
        return averagePassPercentage;
    }

    public void setAveragePassPercentage(double averagePassPercentage) {
        this.averagePassPercentage = averagePassPercentage;
    }

}
