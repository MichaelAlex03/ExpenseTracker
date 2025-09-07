package com.spring.transactionservice.service;


import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.model.Expense;
import com.spring.transactionservice.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository){
        this.expenseRepository = expenseRepository;
    }

    public void addExpenseTransaction(AddExpenseDto input){
        Expense newExpense = new Expense(
                input.getDateOfExpense(),
                input.getExpenseDescription(),
                input.getExpenseAmount(),
                input.getExpenseCategory(),
                input.getExpensePaymentMethod(),
                input.getAdditionalNotes()
        );

        expenseRepository.save(newExpense);
    }

    public void deleteExpenseTransaction(Integer id){
        Optional<Expense> expenseToDelete = expenseRepository.findByTransactionId(id);
        if(expenseToDelete.isPresent()){
            Expense expense = expenseToDelete.get();
            expenseRepository.delete(expense);
        } else {
            throw new RuntimeException("Transaction not found");
        }
    }

}
