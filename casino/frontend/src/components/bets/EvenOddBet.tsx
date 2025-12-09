import React, { useState } from 'react';
import { BetType } from '../../types';
import './Bet.css';

interface EvenOddBetProps {
  onBet: (bet: { betType: BetType; amount: number; choose: string }) => void;
  loading: boolean;
  playerBalance: number;
}

const EvenOddBet: React.FC<EvenOddBetProps> = ({ onBet, loading, playerBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<'EVEN' | 'ODD' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChoice || !amount) {
      alert('Выберите вариант и введите сумму ставки');
      return;
    }

    const betAmount = parseFloat(amount);
    if (betAmount <= 0 || betAmount > playerBalance) {
      alert('Неверная сумма ставки');
      return;
    }

    onBet({
      betType: BetType.EVEN_ODD,
      amount: betAmount,
      choose: selectedChoice,
    });

    setAmount('');
    setSelectedChoice(null);
  };

  return (
    <div className="bet-container">
      <h2>Четное / Нечетное</h2>
      <p className="bet-description">
        Выберите четное или нечетное число. Если угадаете, выиграете удвоенную ставку!
      </p>

      <form onSubmit={handleSubmit} className="bet-form">
        <div className="choice-buttons">
          <button
            type="button"
            className={`choice-button ${selectedChoice === 'EVEN' ? 'selected' : ''}`}
            onClick={() => setSelectedChoice('EVEN')}
            disabled={loading}
          >
            Четное
          </button>
          <button
            type="button"
            className={`choice-button ${selectedChoice === 'ODD' ? 'selected' : ''}`}
            onClick={() => setSelectedChoice('ODD')}
            disabled={loading}
          >
            Нечетное
          </button>
        </div>

        <div className="amount-input-group">
          <label>Сумма ставки</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            min="1"
            max={playerBalance}
            step="0.01"
            required
            disabled={loading}
          />
          <div className="quick-amounts">
            <button
              type="button"
              onClick={() => setAmount((playerBalance * 0.25).toFixed(2))}
              disabled={loading}
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => setAmount((playerBalance * 0.5).toFixed(2))}
              disabled={loading}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setAmount((playerBalance * 0.75).toFixed(2))}
              disabled={loading}
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => setAmount(playerBalance.toFixed(2))}
              disabled={loading}
            >
              Все
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading || !selectedChoice || !amount} className="submit-bet-button">
          {loading ? 'Ставка обрабатывается...' : 'Сделать ставку'}
        </button>
      </form>
    </div>
  );
};

export default EvenOddBet;




