package com.spring.transactionservice.controller;

import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.dto.AddIncomeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @PostMapping("/income")
    public ResponseEntity<?> addIncomeTransaction(@RequestBody AddIncomeDto){

    }

    @PostMapping("/expense")
    public ResponseEntity<?> addExpenseTransaction(@RequestBody AddExpenseDto){

    }

    @GetMapping("/expense")
    public ResponseEntity<?> getAllExpenseTransaction(@RequestParam Integer userId){

    }

    @GetMapping("/income")
    public ResponseEntity<?> getAllIncomeTransactions(@RequestParam Integer userId){

    }
}
