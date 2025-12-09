package org.example.controller;

import lombok.AllArgsConstructor;
import org.example.dto.BetRequest;
import org.example.dto.BetSearchCriteries;
import org.example.entity.Bet;
import org.example.service.BetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
@AllArgsConstructor
public class BetController {
    private final BetService betService;

    @PostMapping
    public ResponseEntity<Bet> makeBet(@RequestBody BetRequest betRequest) {
           Bet bet = betService.makeBet(betRequest);
           return ResponseEntity.status(HttpStatus.CREATED).body(bet);
    }

    @GetMapping("/history/{playerId}")
    public ResponseEntity<List<BetRequest>> getBetHistory(@PathVariable Long playerId){
        return ResponseEntity.ok(betService.getBetHistoryByPlayerId(playerId));
    }

    @GetMapping("/search/{playerId}")
    public ResponseEntity<List<Bet>> searchSpecification(@PathVariable Long playerId, @ModelAttribute BetSearchCriteries criteries){
        return ResponseEntity.ok(betService.searchBets(criteries,playerId));
    }

}

