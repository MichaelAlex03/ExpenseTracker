package com.spring.budgetservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "budgets")
@Getter
@Setter
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(name = "budget_name")
    private String budgetName;

    @Column(name = "budget_category")
    private String budgetCategory;

    @Column(name = "budget_limit")
    private String budgetLimit;

    @Column(name = "budget_notes")
    private String budgetNotes;

    @Column(name = "recurring")
    private String recurring;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "budget_date")
    private Date budgetDate;

    public Budget(){

    }

    public Budget(
            String budgetName,
            String budgetCategory,
            String budgetLimit,
            String budgetNotes,
            String recurring,
            Integer userId,
            Date budgetDate
    ){
        this.budgetName = budgetName;
        this.budgetCategory = budgetCategory;
        this.budgetLimit = budgetLimit;
        this.budgetNotes = budgetNotes;
        this.recurring = recurring;
        this.userId = userId;
        this.budgetDate = budgetDate;
    }
}
