package com.spring.transactionservice.service;

import com.spring.transactionservice.dto.AddIncomeDto;
import com.spring.transactionservice.model.Income;
import com.spring.transactionservice.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncomeService {
    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository){
        this.incomeRepository = incomeRepository;
    }

    public void addIncomeTransaction(AddIncomeDto input){
        System.out.println("User" + input.getUserId());
        Income newIncome = new Income(
                input.getDateOfIncome(),
                input.getIncomeAmount(),
                input.getIncomeCategory(),
                input.getIncomeFrequency(),
                input.getAdditionalNotes(),
                input.getUserId(),
                input.getIncomeDescription()
        );

        incomeRepository.save(newIncome);
    }

    public void deleteIncomeTransaction(Integer id){
        Optional<Income> incomeToDelete = incomeRepository.findById(id);
        if(incomeToDelete.isPresent()){
            Income income = incomeToDelete.get();
            incomeRepository.delete(income);
        } else {
            throw new RuntimeException("Transaction not found");
        }
    }

    public List<Income> getAllIncomeTransactions(Integer userId){
       return incomeRepository.findByUserId(userId);
    }
}
