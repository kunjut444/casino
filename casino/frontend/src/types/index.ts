export enum BetType {
  EVEN_ODD = 'EVEN_ODD',
  NUMBER_ROULETTE = 'NUMBER_ROULETTE',
  EMOJI_ROULETTE = 'EMOJI_ROULETTE'
}

export interface Player {
  id: number;
  username: string;
  balance: number;
  password?: string;
}

export interface Bet {
  id: number;
  player: Player;
  bet: BetType;
  amount: number;
  choose: string;
  winMoney: number;
  isWin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface BetRequest {
  playerId: number;
  betType: BetType;
  amount: number;
  choose: string;
}

