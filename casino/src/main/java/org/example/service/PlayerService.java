package org.example.service;


import lombok.AllArgsConstructor;
import org.example.entity.Player;
import org.example.repository.PlayerRepository;
import org.springframework.stereotype.Service;


import java.util.List;



@Service
@AllArgsConstructor
public class PlayerService {
  private  PlayerRepository playerRepository;


  public List<Player> getAllPlayers(){
      return playerRepository.findAll().stream().toList();
  }

  public Player getPlayerById(Long id){
      return playerRepository.findById(id).orElseThrow(()->new RuntimeException("не найден игрок с соответствующим id"));
  }

  public Player getPlayerByUsername(String username){
      return playerRepository.findByUsername(username);
  }

  public Player createPlayer(Player player){
      if(player == null){
          throw new RuntimeException("игрок не должен быть пустым");
      }
      if(player.getUsername() == null || player.getUsername().trim().isEmpty()){
          throw new RuntimeException("введите имя игрока");
      }
      if(player.getPassword() == null || player.getPassword().trim().isEmpty()){
          throw new RuntimeException("введите пароль игрока");
      }
      return playerRepository.save(player);

  }

  public void deletePlayer(Long id){
      playerRepository.delete(getPlayerById(id));
  }

  public Player updatePlayer(Long id, Player player){
      Player updatePlayer = getPlayerById(id);

      if(player.getUsername() != null && !player.getUsername().trim().isEmpty() && !updatePlayer.getUsername().equals(player.getUsername())){
          updatePlayer.setUsername(player.getUsername());
      }

      if(player.getPassword() != null && !player.getPassword().trim().isEmpty() && !updatePlayer.getPassword().equals(player.getPassword())){
          updatePlayer.setPassword(player.getPassword());
      }

      if(player.getBalance() != null && !updatePlayer.getBalance().equals(player.getBalance())){
          updatePlayer.setBalance(player.getBalance());
      }
      return playerRepository.save(updatePlayer);
  }

}
