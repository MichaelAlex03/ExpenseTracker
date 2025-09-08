package com.spring.transactionservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "income")
@Getter
@Setter
public class Income{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date_of_income")
    private Date dateOfIncome;

    @Column(name = "income_amount")
    private String incomeAmount;

    @Column(name = "income_category")
    private String incomeCategory;

    @Column(name = "income_frequency")
    private String incomeFrequency;

    @Column(name = "additional_notes")
    private String additionalNotes;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "income_description")
    private String incomeDescription;

    public Income(){
    }

    public Income(
            Date dateOfIncome,
            String incomeAmount,
            String incomeCategory,
            String incomeFrequency,
            String additionalNotes,
            Integer userId,
            String incomeDescription
    ){
        this.dateOfIncome = dateOfIncome;
        this.incomeAmount = incomeAmount;
        this.incomeCategory = incomeCategory;
        this.incomeFrequency = incomeFrequency;
        this.additionalNotes = additionalNotes;
        this.userId = userId;
        this.incomeDescription = incomeDescription;
    }
}
