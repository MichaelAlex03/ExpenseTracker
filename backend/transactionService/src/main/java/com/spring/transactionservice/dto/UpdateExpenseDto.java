package com.spring.transactionservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UpdateExpenseDto {
    private Integer id;
    private Date dateOfExpense;
    private String expenseDescription;
    private String expenseAmount;
    private String expenseCategory;
    private String expensePaymentMethod;
    private String additionalNotes;
    private Integer userId;
}
