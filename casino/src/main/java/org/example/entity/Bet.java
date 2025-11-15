package org.example.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


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


    public Bet(Player player, BetType bet, Double amount, String choose, Double win_money, Boolean isWin) {
        this.player = player;
        this.amount = amount;
        this.bet = bet;
        this.choose = choose;
        this.winMoney = win_money;
        this.isWin = isWin;
    }

}
