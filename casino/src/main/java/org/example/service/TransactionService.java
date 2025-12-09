package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.TransactionRequest;
import org.example.dto.TransactionResponse;
import org.example.dto.TransactionSearchCriteria;
import org.example.entity.Player;
import org.example.entity.TransactionLog;
import org.example.entity.TransactionStatus;
import org.example.entity.TransactionType;
import org.example.repository.TransactionLogRepository;
import org.example.specification.TransactionSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final PlayerService playerService;
    private final TransactionLogRepository transactionLogRepository;


    @Transactional
    public TransactionResponse processTransaction(Long playerId, TransactionRequest request) {
        Player player = playerService.getPlayerById(playerId);

        TransactionLog log;
        TransactionType type = request.getType();
        Double amount = request.getAmount();

        if (amount <= 0) {
            throw new IllegalArgumentException("Сумма транзакции должна быть положительной.");
        }

        if (type == TransactionType.DEPOSIT || type == TransactionType.BONUS) {

            player.setBalance(player.getBalance() + amount);
            log = new TransactionLog(player, type, amount, TransactionStatus.COMPLETED);

        } else if (type == TransactionType.WITHDRAWAL) {

            if (player.getBalance() < amount) {
                throw new RuntimeException("Недостаточно средств для вывода.");
            }

            player.setBalance(player.getBalance() - amount);
            log = new TransactionLog(player, type, amount, TransactionStatus.COMPLETED);

        } else {
            throw new IllegalArgumentException("Неподдерживаемый тип транзакции: " + type);
        }

        playerService.createPlayer(player);
        TransactionLog savedLog = transactionLogRepository.save(log);

        return mapToResponse(savedLog);
    }


    public List<TransactionResponse> getPlayerHistory(Long playerId) {

        playerService.getPlayerById(playerId);

        return transactionLogRepository.findByPlayerIdOrderByTimestampDesc(playerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> searchTransactions(Long playerId, TransactionSearchCriteria criteria) {
        playerService.getPlayerById(playerId);

        Specification<TransactionLog> specification = new TransactionSpecification(criteria, playerId);
        Sort sort = Sort.by(Sort.Direction.DESC, "timestamp");

        return transactionLogRepository.findAll(specification, sort).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }



    private TransactionResponse mapToResponse(TransactionLog log) {
        return new TransactionResponse(
                log.getId(),
                log.getPlayer().getId(),
                log.getType(),
                log.getAmount(),
                log.getTimestamp(),
                log.getStatus()
        );
    }
}
