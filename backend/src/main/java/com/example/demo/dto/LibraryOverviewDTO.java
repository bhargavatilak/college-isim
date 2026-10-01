package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryOverviewDTO {
    private Long totalBooks;
    private Long booksIssued;
    private Long booksAvailable;

    

    

    public Long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(Long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public Long getBooksIssued() {
        return booksIssued;
    }

    public void setBooksIssued(Long booksIssued) {
        this.booksIssued = booksIssued;
    }

    public Long getBooksAvailable() {
        return booksAvailable;
    }

    public void setBooksAvailable(Long booksAvailable) {
        this.booksAvailable = booksAvailable;
    }

}
