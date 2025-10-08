package com.spring.transactionservice.controller;

import com.spring.transactionservice.dto.AddExpenseDto;
import com.spring.transactionservice.dto.AddIncomeDto;
import com.spring.transactionservice.dto.UpdateExpenseDto;
import com.spring.transactionservice.dto.UpdateIncomeDto;
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
        try{
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
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

    @GetMapping("/expense")
    public List<Expense> getAllExpenseTransaction(@RequestParam Integer userId){
        return expenseService.getAllExpenseTransactions(userId);
    }

    @GetMapping("/income")
    public List<Income> getAllIncomeTransactions(@RequestParam Integer userId){
        return incomeService.getAllIncomeTransactions(userId);
    }

    @GetMapping("/singleIncome")
    public Income getIncomeTransaction(@RequestParam Integer incomeId){
        return incomeService.getIncome(incomeId);
    }


    @GetMapping("/singleExpense")
    public Expense getExpenseTransaction(@RequestParam Integer expenseId){
        return expenseService.getExpense(expenseId);
    }

    @PatchMapping("/income")
    public Income updateIncome(@RequestBody UpdateIncomeDto input){
        try{
            return incomeService.updateIncome(input);
        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    @PatchMapping("/expense")
    public Expense updateExpense(@RequestBody UpdateExpenseDto input){
        try{
            return expenseService.updateExpenseTransaction(input);
        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
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
