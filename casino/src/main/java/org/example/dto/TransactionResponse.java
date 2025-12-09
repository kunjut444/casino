package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.entity.TransactionStatus;
import org.example.entity.TransactionType;

import java.time.LocalDateTime;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class TransactionResponse implements Serializable {

    private Long id;
    private Long playerId;
    private TransactionType type;
    private Double amount;
    private LocalDateTime timestamp;
    private TransactionStatus status;
}
