package com.spring.transactionservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "expenses")
@Getter
@Setter
public class Expense{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date_of_expense")
    private Date dateOfExpense;

    @Column(name = "expense_description")
    private String expenseDescription;

    @Column(name = "expense_amount")
    private String expenseAmount;

    @Column(name = "expense_category")
    private String expenseCategory;

    @Column(name = "expense_payment_method")
    private String expensePaymentMethod;

    @Column(name = "additional_notes")
    private String additionalNotes;

    @Column(name = "user_id")
    private Integer userId;

    public Expense(){
    }

    public Expense(
            Date dateOfExpense,
            String expenseDescription,
            String expenseAmount,
            String expenseCategory,
            String expensePaymentMethod,
            String additionalNotes,
            Integer userId
    ){
        this.dateOfExpense = dateOfExpense;
        this.expenseDescription = expenseDescription;
        this.expenseAmount = expenseAmount;
        this.expenseCategory = expenseCategory;
        this.expensePaymentMethod = expensePaymentMethod;
        this.additionalNotes = additionalNotes;
        this.userId = userId;
    }
}
