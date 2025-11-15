import React from 'react';
import { Bet } from '../types';
import './BetHistory.css';

interface BetHistoryProps {
  bets: Bet[];
}

const BetHistory: React.FC<BetHistoryProps> = ({ bets }) => {
  if (bets.length === 0) {
    return (
      <div className="bet-history">
        <h2>История ставок</h2>
        <p className="empty-history">Ставок пока нет</p>
      </div>
    );
  }

  return (
    <div className="bet-history">
      <h2>История ставок</h2>
      <div className="bet-list">
        {bets.map((bet) => (
          <div key={bet.id} className={`bet-item ${bet.isWin ? 'win' : 'lose'}`}>
            <div className="bet-header">
              <span className="bet-type">{bet.bet}</span>
              <span className={`bet-status ${bet.isWin ? 'win' : 'lose'}`}>
                {bet.isWin ? '✓ Выигрыш' : '✗ Проигрыш'}
              </span>
            </div>
            <div className="bet-details">
              <div className="bet-info">
                <span>Выбор: <strong>{bet.choose}</strong></span>
                <span>Ставка: <strong>${bet.amount.toFixed(2)}</strong></span>
              </div>
              {bet.isWin && (
                <div className="bet-win">
                  Выигрыш: <strong>${bet.winMoney.toFixed(2)}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetHistory;

