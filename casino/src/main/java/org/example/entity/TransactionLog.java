package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_log")
@Getter
@Setter
@NoArgsConstructor
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;


    @Column(nullable = false)
    private Double amount;


    private LocalDateTime timestamp;


    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    public TransactionLog(Player player, TransactionType type, Double amount, TransactionStatus status) {
        this.player = player;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.status = status;
    }
}
