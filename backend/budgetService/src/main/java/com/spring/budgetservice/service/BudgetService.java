package com.spring.budgetservice.service;

import com.spring.budgetservice.dto.AddBudgetDto;
import com.spring.budgetservice.model.Budget;
import com.spring.budgetservice.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository){
        this.budgetRepository = budgetRepository;
    }

    public Budget addBudget(AddBudgetDto addBudgetDto){
        Budget budget = new Budget(
                addBudgetDto.getBudgetName(),
                addBudgetDto.getBudgetCategory(),
                addBudgetDto.getBudgetLimit(),
                addBudgetDto.getBudgetNotes(),
                addBudgetDto.getRecurring(),
                addBudgetDto.getUserId(),
                addBudgetDto.getBudgetDate()
        );

        return budgetRepository.save(budget);
    }

    public void removeBudget(){

    }

    public void updateBudget(){

    }

    public List<Budget> getBudgets(Integer userId){
        return budgetRepository.findByUserId(userId);
    }

}
