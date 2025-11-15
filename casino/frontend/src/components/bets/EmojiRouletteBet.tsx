import React, { useState } from 'react';
import { BetType } from '../../types';
import './Bet.css';

interface EmojiRouletteBetProps {
  onBet: (bet: { betType: BetType; amount: number; choose: string }) => void;
  loading: boolean;
  playerBalance: number;
}

const emojis = [
  { emoji: '🎰', name: 'Слот' },
  { emoji: '🎲', name: 'Кубик' },
  { emoji: '🃏', name: 'Джокер' },
  { emoji: '🎯', name: 'Мишень' },
  { emoji: '🎪', name: 'Цирк' },
  { emoji: '🎨', name: 'Палитра' },
  { emoji: '🎭', name: 'Маска' },
  { emoji: '🎪', name: 'Шатер' },
];

const EmojiRouletteBet: React.FC<EmojiRouletteBetProps> = ({ onBet, loading, playerBalance }) => {
  const [amount, setAmount] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmoji || !amount) {
      alert('Выберите эмодзи и введите сумму ставки');
      return;
    }

    const betAmount = parseFloat(amount);
    if (betAmount <= 0 || betAmount > playerBalance) {
      alert('Неверная сумма ставки');
      return;
    }

    onBet({
      betType: BetType.EMOJI_ROULETTE,
      amount: betAmount,
      choose: selectedEmoji,
    });

    setAmount('');
    setSelectedEmoji(null);
  };

  return (
    <div className="bet-container">
      <h2>Эмодзи Рулетка</h2>
      <p className="bet-description">
        Выберите эмодзи. Если угадаете, выиграете в 7 раз больше ставки!
      </p>

      <form onSubmit={handleSubmit} className="bet-form">
        <div className="emoji-grid">
          {emojis.map((item) => (
            <button
              key={item.emoji}
              type="button"
              className={`emoji-button ${selectedEmoji === item.emoji ? 'selected' : ''}`}
              onClick={() => setSelectedEmoji(item.emoji)}
              disabled={loading}
              title={item.name}
            >
              {item.emoji}
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

        <button type="submit" disabled={loading || !selectedEmoji || !amount} className="submit-bet-button">
          {loading ? 'Ставка обрабатывается...' : 'Сделать ставку'}
        </button>
      </form>
    </div>
  );
};

export default EmojiRouletteBet;

