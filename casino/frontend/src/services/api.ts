import axios from 'axios';
import type { Player, LoginRequest, RegisterRequest, BetRequest, Bet } from '../types';

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
};

