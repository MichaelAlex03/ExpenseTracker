package com.spring.transactionservice.responses;

import lombok.Getter;

import java.util.Date;

@Getter
public class AddExpenseTransactionResponse {
    private Integer id;
    private Date dateOfExpense;
    private String expenseDescription;
    private String expenseAmount;
    private String expenseCategory;
    private String expensePaymentMethod;
    private String additionalNotes;
    private Integer userId;

    public AddExpenseTransactionResponse(
            Integer id,
            Date dateOfExpense,
            String expenseDescription,
            String expenseAmount,
            String expenseCategory,
            String expensePaymentMethod,
            String additionalNotes,
            Integer userId
    ){
        this.id = id;
        this.dateOfExpense = dateOfExpense;
        this.expenseDescription = expenseDescription;
        this.expenseAmount = expenseAmount;
        this.expenseCategory = expenseCategory;
        this.expensePaymentMethod = expensePaymentMethod;
        this.additionalNotes = additionalNotes;
        this.userId = userId;
    }
}
