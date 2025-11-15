import React, { useState } from 'react';
import { BetType } from '../../types';
import './Bet.css';

interface NumberRouletteBetProps {
  onBet: (bet: { betType: BetType; amount: number; choose: string }) => void;
  loading: boolean;
  playerBalance: number;
}

const NumberRouletteBet: React.FC<NumberRouletteBetProps> = ({ onBet, loading, playerBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNumber === null || !amount) {
      alert('Выберите число и введите сумму ставки');
      return;
    }

    const betAmount = parseFloat(amount);
    if (betAmount <= 0 || betAmount > playerBalance) {
      alert('Неверная сумма ставки');
      return;
    }

    onBet({
      betType: BetType.NUMBER_ROULETTE,
      amount: betAmount,
      choose: selectedNumber.toString(),
    });

    setAmount('');
    setSelectedNumber(null);
  };

  return (
    <div className="bet-container">
      <h2>Числовая Рулетка</h2>
      <p className="bet-description">
        Выберите число от 1 до 36. Если угадаете, выиграете в 35 раз больше ставки!
      </p>

      <form onSubmit={handleSubmit} className="bet-form">
        <div className="number-grid">
          {numbers.map((num) => (
            <button
              key={num}
              type="button"
              className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
              onClick={() => setSelectedNumber(num)}
              disabled={loading}
            >
              {num}
            </button>
          ))}
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

        <button type="submit" disabled={loading || selectedNumber === null || !amount} className="submit-bet-button">
          {loading ? 'Ставка обрабатывается...' : 'Сделать ставку'}
        </button>
      </form>
    </div>
  );
};

export default NumberRouletteBet;

