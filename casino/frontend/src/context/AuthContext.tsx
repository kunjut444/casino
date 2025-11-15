import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  player: Player | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const savedPlayer = localStorage.getItem('player');
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const playerData = await authService.login({ username, password });
    setPlayer(playerData);
    localStorage.setItem('player', JSON.stringify(playerData));
  };

  const register = async (username: string, password: string) => {
    const playerData = await authService.register({ username, password });
    setPlayer(playerData);
    localStorage.setItem('player', JSON.stringify(playerData));
  };

  const logout = () => {
    setPlayer(null);
    localStorage.removeItem('player');
  };

  const updateBalance = (newBalance: number) => {
    if (player) {
      const updatedPlayer = { ...player, balance: newBalance };
      setPlayer(updatedPlayer);
      localStorage.setItem('player', JSON.stringify(updatedPlayer));
    }
  };

  return (
    <AuthContext.Provider value={{ player, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

