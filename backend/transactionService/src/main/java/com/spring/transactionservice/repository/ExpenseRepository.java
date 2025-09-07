package com.spring.transactionservice.repository;

import com.spring.transactionservice.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    Optional<Expense> findByUserId(Integer userId);
    Optional<Expense> findByTransactionId(Integer transactionId);
}
