package com.spring.budgetservice.service;

import com.spring.budgetservice.dto.AddBudgetDto;
import com.spring.budgetservice.dto.UpdateBudgetDto;
import com.spring.budgetservice.model.Budget;
import com.spring.budgetservice.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void removeBudget(Integer budgetId){
        Optional<Budget> budget =  budgetRepository.findById(budgetId);
        if (budget.isEmpty()) {
            return;
        }
        Budget budgetToDelete = budget.get();
        budgetRepository.delete(budgetToDelete);

    }

    public Budget getBudget(Integer budgetId){
        Optional<Budget> budget =  budgetRepository.findById(budgetId);
        if(budget.isEmpty()){
            return null;
        }
        return budget.get();
    }

    public Budget updateBudget(UpdateBudgetDto updateBudgetDto){
        Optional<Budget> budgetToUpdate = budgetRepository.findById(updateBudgetDto.getId());
        if(budgetToUpdate.isEmpty()){
            throw new RuntimeException("Budget not found");
        }
        Budget budget = budgetToUpdate.get();
        budget.setBudgetName(updateBudgetDto.getBudgetName());
        budget.setBudgetCategory(updateBudgetDto.getBudgetCategory());
        budget.setBudgetLimit(updateBudgetDto.getBudgetLimit());
        budget.setBudgetNotes(updateBudgetDto.getBudgetNotes());
        budget.setRecurring(updateBudgetDto.getRecurring());
        budget.setUserId(updateBudgetDto.getUserId());
        budget.setBudgetDate(updateBudgetDto.getBudgetDate());
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(Integer userId){
        return budgetRepository.findByUserId(userId);
    }

}
