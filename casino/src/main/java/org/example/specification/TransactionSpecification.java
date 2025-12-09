package org.example.specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.example.dto.TransactionSearchCriteria;
import org.example.entity.TransactionLog;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public class TransactionSpecification implements Specification<TransactionLog> {
    private final TransactionSearchCriteria criteria;
    private final Long playerId;

    @Override
    public Predicate toPredicate(Root<TransactionLog> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(builder.equal(root.get("player").get("id"), playerId));

        if (criteria.getType() != null) {
            predicates.add(builder.equal(root.get("type"), criteria.getType()));
        }

        if (criteria.getStatus() != null) {
            predicates.add(builder.equal(root.get("status"), criteria.getStatus()));
        }

        if (criteria.getMinAmount() != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("amount"), criteria.getMinAmount()));
        }

        if (criteria.getMaxAmount() != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("amount"), criteria.getMaxAmount()));
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}

