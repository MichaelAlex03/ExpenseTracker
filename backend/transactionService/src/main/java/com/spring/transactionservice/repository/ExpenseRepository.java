package com.spring.transactionservice.repository;

import com.spring.transactionservice.model.Expense;
import com.spring.transactionservice.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    Optional<Income> findByUserId(Integer userId);
}
