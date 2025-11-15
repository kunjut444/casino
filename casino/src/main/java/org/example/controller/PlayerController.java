package org.example.controller;



import lombok.AllArgsConstructor;
import org.example.entity.Player;
import org.example.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@AllArgsConstructor
public class PlayerController {
    public final PlayerService  playerService;

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers(){
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id){
       return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player){
       return ResponseEntity.status(HttpStatus.CREATED).body(playerService.createPlayer(player));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id,@RequestBody Player player){
        return ResponseEntity.ok(playerService.updatePlayer(id,player));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Player> deletePlayer(@PathVariable Long id){
           if (playerService.getPlayerById(id) == null) {
               return ResponseEntity.notFound().build();
           }
           playerService.deletePlayer(id);
           return ResponseEntity.noContent().build();
    }
}
