package org.example.dto;


import lombok.Getter;
import lombok.Setter;
import org.example.entity.BetType;


@Getter
@Setter
public class BetSearchCriteries {
    private BetType bet;
    private Double minAmount;
    private Double maxAmount;
    private Boolean isWin;
    private String choose;
}
