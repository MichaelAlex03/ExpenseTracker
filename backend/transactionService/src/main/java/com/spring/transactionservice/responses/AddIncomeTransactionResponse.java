package com.spring.transactionservice.responses;

import lombok.Setter;

import java.util.Date;

public class AddIncomeTransactionResponse {
    private Integer id;
    private Date dateOfIncome;
    private String incomeAmount;
    private String incomeCategory;
    private String incomeFrequency;
    private String additionalNotes;
    private Integer userId;
    private String incomeDescription;

    public AddIncomeTransactionResponse(
            Integer id,
            Date dateOfIncome,
            String incomeAmount,
            String incomeCategory,
            String incomeFrequency,
            String additionalNotes,
            Integer userId,
            String incomeDescription
    ){
        this.id = id;
        this.dateOfIncome = dateOfIncome;
        this.incomeAmount = incomeAmount;
        this.incomeCategory = incomeCategory;
        this.incomeFrequency = incomeFrequency;
        this.additionalNotes = additionalNotes;
        this.userId = userId;
        this.incomeDescription = incomeDescription;

    }
}
