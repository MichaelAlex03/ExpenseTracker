package com.spring.budgetservice.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AddBudgetResponse {
    private Integer id;
    private String budgetName;
    private String budgetCategory;
    private String budgetLimit;
    private String budgetNotes;
    private String recurring;
    private Integer userId;
    private Date budgetDate;

    public AddBudgetResponse(
            Integer id,
            String budgetName,
            String budgetCategory,
            String budgetLimit,
            String budgetNotes,
            String recurring,
            Integer userId,
            Date budgetDate
    ){
        this.id = id;
        this.budgetName = budgetName;
        this.budgetCategory = budgetCategory;
        this.budgetLimit = budgetLimit;
        this.budgetNotes = budgetNotes;
        this.recurring = recurring;
        this.userId = userId;
        this.budgetDate = budgetDate;
    }
}
