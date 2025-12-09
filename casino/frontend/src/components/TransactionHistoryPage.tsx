import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TransactionHistory from './TransactionHistory';
import './TransactionHistoryPage.css';

const TransactionHistoryPage: React.FC = () => {
  const { player, logout } = useAuth();
  const navigate = useNavigate();

  if (!player) {
    return null;
  }

  return (
    <div className="transaction-history-page">
      <header className="page-header">
        <div className="header-content">
          <h1>💳 История транзакций</h1>
          <div className="user-info">
            <div className="balance">
              <span className="balance-label">Баланс:</span>
              <span className="balance-amount">${player.balance.toFixed(2)}</span>
            </div>
            <div className="username">👤 {player.username}</div>
            <div className="nav-buttons">
              <button onClick={() => navigate('/dashboard')} className="nav-button">
                Главная
              </button>
              <button onClick={() => navigate('/bets')} className="nav-button">
                Ставки
              </button>
              <button onClick={() => navigate('/transactions')} className="nav-button">
                История транзакций
              </button>
              <button onClick={logout} className="logout-button">
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default TransactionHistoryPage;


