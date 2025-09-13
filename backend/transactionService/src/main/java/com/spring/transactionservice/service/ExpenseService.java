package com.spring.transactionservice.service;


import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.model.Expense;
import com.spring.transactionservice.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository){
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpenseTransaction(AddExpenseDto input){
        Expense newExpense = new Expense(
                input.getDateOfExpense(),
                input.getExpenseDescription(),
                input.getExpenseAmount(),
                input.getExpenseCategory(),
                input.getExpensePaymentMethod(),
                input.getAdditionalNotes(),
                input.getUserId()
        );

        return expenseRepository.save(newExpense);
    }

    public void deleteExpenseTransaction(Integer id){
        Optional<Expense> expenseToDelete = expenseRepository.findById(id);
        if(expenseToDelete.isPresent()){
            Expense expense = expenseToDelete.get();
            expenseRepository.delete(expense);
        } else {
            throw new RuntimeException("Transaction not found");
        }
    }

    public List<Expense> getAllExpenseTransactions(Integer userId){
        return expenseRepository.findByUserId(userId);
    }

}
