package com.spring.transactionservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UpdateIncomeDto {
    private Integer id;
    private Date dateOfIncome;
    private String incomeAmount;
    private String incomeCategory;
    private String incomeFrequency;
    private String additionalNotes;
    private Integer userId;
    private String incomeDescription;
}
