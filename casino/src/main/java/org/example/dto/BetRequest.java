package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.entity.BetType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BetRequest {

    private Long playerId;

    private BetType betType;

    private Double amount;

    private String choose;
}

