package com.spring.budgetservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UpdateBudgetDto {
    private Integer id;
    private String budgetName;
    private String budgetCategory;
    private String budgetLimit;
    private String budgetNotes;
    private String recurring;
    private Integer userId;
    private Date budgetDate;
}
