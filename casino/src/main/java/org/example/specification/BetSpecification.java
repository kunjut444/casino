package org.example.specification;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.example.dto.BetSearchCriteries;
import org.example.entity.Bet;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class BetSpecification implements Specification<Bet> {
    private final BetSearchCriteries criteries;
    private final Long playerId;

    @Override
    public Predicate toPredicate(Root<Bet> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(builder.equal(root.get("player"),playerId));

        if(criteries.getBet() != null){
            predicates.add(builder.equal(root.get("bet"),criteries.getBet()));
        }

        if(criteries.getChoose() != null && !criteries.getChoose().isEmpty()){
            predicates.add(builder.equal(root.get("choose"),criteries.getChoose()));
        }

        if(criteries.getIsWin() != null){
            predicates.add(builder.equal(root.get("isWin"),criteries.getIsWin()));
        }

        if(criteries.getMaxAmount() != null){
            predicates.add(builder.lessThanOrEqualTo(root.get("amount"),criteries.getMaxAmount()));
        }

        if(criteries.getMinAmount() != null){
            predicates.add(builder.greaterThanOrEqualTo(root.get("amount"),criteries.getMinAmount()));
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
