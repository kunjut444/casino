package org.example.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Player")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Player {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double balance = 1000.0;
    private String username;
    private String password;


    public Player(Double balance,String username,String password){
        this.balance = balance;
        this.username = username;
        this.password = password;
    }




}
