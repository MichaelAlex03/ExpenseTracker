package com.spring.transactionservice.repository;

import com.spring.transactionservice.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {
    Optional<Income> findById(Integer userId);
    Optional<Income> findByTransactionId(Integer transactionId);
}
