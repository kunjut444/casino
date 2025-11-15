package org.example.controller;

import lombok.AllArgsConstructor;
import org.example.dto.BetRequest;
import org.example.entity.Bet;
import org.example.service.BetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

