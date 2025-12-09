package org.example.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name="bet")
@NoArgsConstructor
@Getter
@Setter
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @Enumerated(EnumType.STRING)
    private BetType bet;

    private Double amount;

    private String choose;


    private Double winMoney;

    private Boolean isWin;

    private LocalDateTime timestamp;

    public Bet(Player player, BetType bet, Double amount, String choose, Double win_money, Boolean isWin,LocalDateTime timestamp) {
        this.player = player;
        this.amount = amount;
        this.bet = bet;
        this.choose = choose;
        this.winMoney = win_money;
        this.isWin = isWin;
        this.timestamp = timestamp;
    }

}
