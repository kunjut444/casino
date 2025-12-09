package org.example.repository;

import org.example.entity.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long>,
                                                  JpaSpecificationExecutor<TransactionLog> {
    List<TransactionLog> findByPlayerIdOrderByTimestampDesc(Long playerId);
}