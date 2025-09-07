package com.spring.transactionservice.controller;

import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.dto.AddIncomeDto;
import com.spring.transactionservice.model.Expense;
import com.spring.transactionservice.service.ExpenseService;
import com.spring.transactionservice.service.IncomeService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> addIncomeTransaction(@RequestBody AddIncomeDto income){

    }

    @PostMapping("/expense")
    public ResponseEntity<?> addExpenseTransaction(@RequestBody AddExpenseDto expense){

    }

    @GetMapping("/expense")
    public ResponseEntity<?> getAllExpenseTransaction(@RequestParam Integer userId){

    }

    @GetMapping("/income")
    public ResponseEntity<?> getAllIncomeTransactions(@RequestParam Integer userId){

    }

    @DeleteMapping("/income")
    public ResponseEntity<?> deleteIncomeTransaction(@RequestParam Integer transactionId){}

    @DeleteMapping("/expense")
    public ResponseEntity<?> deleteExpenseTransaction(@RequestParam Integer transactionId){}
}
