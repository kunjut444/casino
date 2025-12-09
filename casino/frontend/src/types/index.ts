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
  id?: number;
  player?: Player;
  bet: BetType;
  amount: number;
  choose: string;
  winMoney?: number;
  isWin?: boolean;
  timestamp?: string;
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
  playerId?: number;
  betType: BetType;
  amount: number;
  choose: string;
  timestamp?: string;
}

export interface BetSearchCriteria {
  bet?: BetType;
  minAmount?: number;
  maxAmount?: number;
  isWin?: boolean;
  choose?: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  BONUS = 'BONUS'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: number;
  playerId: number;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
}

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
}

export interface TransactionSearchCriteria {
  type?: TransactionType;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
}



