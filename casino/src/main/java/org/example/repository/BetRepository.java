package org.example.repository;

import org.example.dto.BetRequest;
import org.example.entity.Bet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet, Long>, JpaSpecificationExecutor<Bet> {
    List<Bet> findByPlayerId(Long playerId);
}

