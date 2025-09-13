package com.spring.transactionservice.controller;

import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.dto.AddIncomeDto;
import com.spring.transactionservice.model.Expense;
import com.spring.transactionservice.model.Income;
import com.spring.transactionservice.responses.AddExpenseTransactionResponse;
import com.spring.transactionservice.responses.AddIncomeTransactionResponse;
import com.spring.transactionservice.service.ExpenseService;
import com.spring.transactionservice.service.IncomeService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    private final IncomeService incomeService;

    private final ExpenseService expenseService;

    public TransactionController(IncomeService incomeService, ExpenseService expenseService){
        this.incomeService = incomeService;
        this.expenseService = expenseService;
    }

    @PostMapping("/income")
    public ResponseEntity<AddIncomeTransactionResponse> addIncomeTransaction(@RequestBody AddIncomeDto income){
        Income newIncomeAdded = incomeService.addIncomeTransaction(income);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AddIncomeTransactionResponse(
                        newIncomeAdded.getId(),
                        newIncomeAdded.getDateOfIncome(),
                        newIncomeAdded.getIncomeAmount(),
                        newIncomeAdded.getIncomeCategory(),
                        newIncomeAdded.getIncomeFrequency(),
                        newIncomeAdded.getAdditionalNotes(),
                        newIncomeAdded.getUserId(),
                        newIncomeAdded.getIncomeDescription()
                ));
    }

    @PostMapping("/expense")
    public ResponseEntity<AddExpenseTransactionResponse> addExpenseTransaction(@RequestBody AddExpenseDto expense){
        Expense newExpense = expenseService.addExpenseTransaction(expense);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AddExpenseTransactionResponse(
                        newExpense.getId(),
                        newExpense.getDateOfExpense(),
                        newExpense.getExpenseDescription(),
                        newExpense.getExpenseAmount(),
                        newExpense.getExpenseCategory(),
                        newExpense.getExpensePaymentMethod(),
                        newExpense.getAdditionalNotes(),
                        newExpense.getUserId()
                ));
    }

    @GetMapping("/expense")
    public List<Expense> getAllExpenseTransaction(@RequestParam Integer userId){
        return expenseService.getAllExpenseTransactions(userId);
    }

    @GetMapping("/income")
    public List<Income> getAllIncomeTransactions(@RequestParam Integer userId){
        return incomeService.getAllIncomeTransactions(userId);
    }

    @DeleteMapping("/income")
    public ResponseEntity<Void> deleteIncomeTransaction(@RequestParam Integer transactionId){
        incomeService.deleteIncomeTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/expense")
    public ResponseEntity<Void> deleteExpenseTransaction(@RequestParam Integer transactionId){
        expenseService.deleteExpenseTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
}
