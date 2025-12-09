package org.example.service;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.dto.BetRequest;
import org.example.dto.BetSearchCriteries;
import org.example.entity.Bet;
import org.example.entity.BetType;
import org.example.entity.Player;
import org.example.repository.BetRepository;
import org.example.specification.BetSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class BetService {
    private final PlayerService playerService;
    private final BetRepository betRepository;


    @Transactional
   public Bet makeBet(BetRequest betRequest){
       Player player = playerService.getPlayerById(betRequest.getPlayerId());
       Double amount = betRequest.getAmount();
       if(amount > player.getBalance()){
           throw new RuntimeException("у вас недостаточно средств");
       }
       BetType bet = betRequest.getBetType();
       String choose = betRequest.getChoose();
        LocalDateTime timestamp = betRequest.getTimestamp();
       boolean isWin = false;
       Double winMoney = 0.0;
       if(bet == BetType.EVEN_ODD){
            isWin = even_Odd(choose);
            winMoney = amount * 2;
       }
       if(bet == BetType.EMOJI_ROULETTE){
           isWin = playEmojiRoulette(choose);
            winMoney = amount * 6;
       }
       if(bet == BetType.NUMBER_ROULETTE){
            isWin = playNumberRoulette(choose);
            winMoney = amount * 36;
       }
       if(isWin){
           player.setBalance(player.getBalance()+ winMoney);
       }else{
           player.setBalance(player.getBalance()- amount);
       }
       playerService.updatePlayer(player.getId(),player);


       Bet newBet = new Bet(player, bet, amount, choose, winMoney, isWin,timestamp);
       return betRepository.save(newBet);
   }

   public List<Bet> searchBets(BetSearchCriteries criteries,Long playerId){
       Specification<Bet> specification = new BetSpecification(criteries,playerId);

       Sort sort = Sort.by(Sort.Direction.DESC,"amount");

       return betRepository.findAll(specification,sort);
   }


    public List<BetRequest> getBetHistoryByPlayerId(Long playerId) {

        playerService.getPlayerById(playerId);


        List<Bet> bets = betRepository.findByPlayerId(playerId);


        return bets.stream()
                .map(this::mapToBetHistoryResponse)
                .collect(Collectors.toList());
    }


    private BetRequest mapToBetHistoryResponse(Bet bet) {
        return new BetRequest(
                bet.getId(),
                bet.getBet(),
                bet.getAmount(),
                bet.getChoose(),
                bet.getTimestamp()
        );
    }





    private Boolean even_Odd(String choice){

        String normalizedChoice = choice.toUpperCase();
        if(!normalizedChoice.equals("EVEN") && !normalizedChoice.equals("ODD") 
           && !choice.equals("четный") && !choice.equals("нечетный")){
            throw new RuntimeException("введите 'EVEN'/'ODD' или 'четный'/'нечетный'");
        }

        int randomNumber = (int)(Math.random()*100);
        boolean isEven = randomNumber % 2 == 0;
        

        if(normalizedChoice.equals("EVEN")){
            return isEven;
        }
        if(normalizedChoice.equals("ODD")){
            return !isEven;
        }
        

        if(choice.equals("четный")){
            return isEven;
        }
        if(choice.equals("нечетный")){
            return !isEven;
        }
        
        return false;
    }

    private boolean playNumberRoulette(String choice) {
        int number = (int) (Math.random() * 37);
        System.out.println(number);
        int chosenNumber = Integer.parseInt(choice);
        return number == chosenNumber;
    }

    private boolean playEmojiRoulette(String choice) {
        String[] emojis = {"🍒", "🍋", "🍉", "⭐", "🍀", "💎"};
        int index = (int) (Math.random() * emojis.length);
        String result = emojis[index];
        return result.equals(choice);
    }

}
