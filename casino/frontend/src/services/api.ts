import axios from 'axios';
import type { Player, LoginRequest, RegisterRequest, BetRequest, Bet, Transaction, TransactionRequest, BetSearchCriteria, TransactionSearchCriteria } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<Player> => {
    const response = await api.post<Player>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<Player> => {
    const response = await api.post<Player>('/auth/register', data);
    return response.data;
  },
};

export const playerService = {
  getPlayerById: async (id: number): Promise<Player> => {
    const response = await api.get<Player>(`/players/${id}`);
    return response.data;
  },
};

export const betService = {
  makeBet: async (betRequest: BetRequest): Promise<Bet> => {
    const response = await api.post<Bet>('/bets', betRequest);
    return response.data;
  },
  
  getBetHistory: async (playerId: number): Promise<BetRequest[]> => {
    const response = await api.get<BetRequest[]>(`/bets/history/${playerId}`);
    return response.data;
  },

  searchBets: async (playerId: number, filters: BetSearchCriteria): Promise<Bet[]> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );

    const response = await api.get<Bet[]>(`/bets/search/${playerId}`, { params });
    return response.data;
  },
};

export const transactionService = {
  getTransactionHistory: async (playerId: number): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/transactions/history/${playerId}`);
    return response.data;
  },

  searchTransactions: async (playerId: number, filters: TransactionSearchCriteria): Promise<Transaction[]> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );

    const response = await api.get<Transaction[]>(`/transactions/search/${playerId}`, { params });
    return response.data;
  },
  
  createTransaction: async (playerId: number, transactionRequest: TransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>(`/transactions/${playerId}`, transactionRequest);
    return response.data;
  },
};

