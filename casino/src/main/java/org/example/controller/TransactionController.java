package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.TransactionRequest;
import org.example.dto.TransactionResponse;
import org.example.dto.TransactionSearchCriteria;
import org.example.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;


    @PostMapping("/{playerId}")
    public ResponseEntity<TransactionResponse> executeTransaction(
            @PathVariable Long playerId,
            @RequestBody TransactionRequest request) {

        TransactionResponse response = transactionService.processTransaction(playerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/history/{playerId}")
    public ResponseEntity<List<TransactionResponse>> getHistory(@PathVariable Long playerId) {
        List<TransactionResponse> history = transactionService.getPlayerHistory(playerId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/search/{playerId}")
    public ResponseEntity<List<TransactionResponse>> searchTransactions(@PathVariable Long playerId,
                                                                        @ModelAttribute TransactionSearchCriteria criteria) {
        List<TransactionResponse> result = transactionService.searchTransactions(playerId, criteria);
        return ResponseEntity.ok(result);
    }
}
