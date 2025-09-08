package com.spring.transactionservice.repository;

import com.spring.transactionservice.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {
    List<Income> findByUserId(Integer userId);
    Optional<Income> findById(Integer transactionId);
}
