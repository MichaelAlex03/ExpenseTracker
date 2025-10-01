package com.spring.budgetservice.controller;

import com.spring.budgetservice.dto.AddBudgetDto;
import com.spring.budgetservice.model.Budget;
import com.spring.budgetservice.response.AddBudgetResponse;
import com.spring.budgetservice.response.RemoveBudgetResponse;
import com.spring.budgetservice.service.BudgetService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService){
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<AddBudgetResponse> addBudget(@RequestBody AddBudgetDto addBudgetDto){
        try{
            Budget budget = budgetService.addBudget(addBudgetDto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new AddBudgetResponse(
                            budget.getId(),
                            budget.getBudgetName(),
                            budget.getBudgetCategory(),
                            budget.getBudgetLimit(),
                            budget.getBudgetNotes(),
                            budget.getRecurring(),
                            budget.getUserId(),
                            budget.getBudgetDate()
                    ));
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping
    public List<Budget> getBudgets (@RequestParam Integer userId){
        return budgetService.getBudgets(userId);
    }
}
