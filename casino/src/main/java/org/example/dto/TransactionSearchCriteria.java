package org.example.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.entity.TransactionStatus;
import org.example.entity.TransactionType;

@Getter
@Setter
public class TransactionSearchCriteria {
    private TransactionType type;
    private TransactionStatus status;
    private Double minAmount;
    private Double maxAmount;
}

