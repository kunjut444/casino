package org.example.repository;

import org.example.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




//todo заюзать транзакции
@Repository
public interface PlayerRepository extends JpaRepository<Player,Long> {
    Player findByUsername(String username);


}
