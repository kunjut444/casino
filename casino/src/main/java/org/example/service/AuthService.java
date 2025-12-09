package org.example.service;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.dto.LoginRequest;
import org.example.dto.RegisterRequest;
import org.example.entity.Player;
import org.example.security.GlobalExceptionHandler;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@AllArgsConstructor
public class AuthService {
    private final PlayerService playerService;
    private final PasswordEncoder passwordEncoder;

    public Player register(RegisterRequest request){
        String username = request.getUsername();
        if(!(playerService.getPlayerByUsername(username) == null)){
            throw new RuntimeException("игрок с таким именем уже существует");
        }
        String password = passwordEncoder.encode(request.getPassword());
        Double balance = 1000.0;

      return playerService.createPlayer(new Player(balance,username,password));
    }

    @Transactional
    public Player login(LoginRequest request){
        String username = request.getUsername();
        Player player = playerService.getPlayerByUsername(username);
        if(player == null){
            throw new RuntimeException("игрока с таким именем не существует");
        }
        String password = request.getPassword();
        if(!passwordEncoder.matches(password, player.getPassword())){
            throw new RuntimeException("неправильный пароль");
        }
        return playerService.getPlayerByUsername(username);
    }

}
