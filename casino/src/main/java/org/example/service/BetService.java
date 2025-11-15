package org.example.service;


import lombok.AllArgsConstructor;
import org.example.dto.BetRequest;
import org.example.entity.Bet;
import org.example.entity.BetType;
import org.example.entity.Player;
import org.example.repository.BetRepository;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class BetService {
    private final PlayerService playerService;
    private final BetRepository betRepository;



   public Bet makeBet(BetRequest betRequest){
       Player player = playerService.getPlayerById(betRequest.getPlayerId());
       Double amount = betRequest.getAmount();
       if(amount > player.getBalance()){
           throw new RuntimeException("у вас недостаточно средств");
       }
       BetType bet = betRequest.getBetType();
       String choose = betRequest.getChoose();
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


       Bet newBet = new Bet(player, bet, amount, choose, winMoney, isWin);
       return betRepository.save(newBet);
   }




    private Boolean even_Odd(String choice){
        // Принимаем как английские, так и русские значения
        String normalizedChoice = choice.toUpperCase();
        if(!normalizedChoice.equals("EVEN") && !normalizedChoice.equals("ODD") 
           && !choice.equals("четный") && !choice.equals("нечетный")){
            throw new RuntimeException("введите 'EVEN'/'ODD' или 'четный'/'нечетный'");
        }

        int randomNumber = (int)(Math.random()*100);
        boolean isEven = randomNumber % 2 == 0;
        
        // Проверяем выигрыш для английских значений
        if(normalizedChoice.equals("EVEN")){
            return isEven;
        }
        if(normalizedChoice.equals("ODD")){
            return !isEven;
        }
        
        // Проверяем выигрыш для русских значений
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
