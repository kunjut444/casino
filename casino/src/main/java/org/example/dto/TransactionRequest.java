package org.example.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.entity.TransactionType;

import java.io.Serializable;

@Getter
@Setter
public class TransactionRequest implements Serializable {


    private TransactionType type;


    private Double amount;
}
