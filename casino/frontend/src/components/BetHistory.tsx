import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { betService } from '../services/api';
import { BetRequest, BetType, Bet } from '../types';
import './BetHistory.css';

type BetHistoryItem = BetRequest | Bet;

interface BetHistoryProps {
  bets?: BetHistoryItem[];
  showFullHistory?: boolean;
  loadingOverride?: boolean;
  errorMessage?: string | null;
}

const BetHistory: React.FC<BetHistoryProps> = ({
  bets: propBets,
  showFullHistory = false,
  loadingOverride,
  errorMessage,
}) => {
  const { player } = useAuth();
  const [bets, setBets] = useState<BetHistoryItem[]>(propBets || []);
  const [loading, setLoading] = useState(showFullHistory && !propBets);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showFullHistory && player && !propBets) {
      loadBetHistory();
    } else if (propBets) {
      setBets(propBets);
      setLoading(false);
    }
  }, [player, showFullHistory, propBets]);

  const loadBetHistory = async () => {
    if (!player) return;

    setLoading(true);
    setError(null);
    try {
      const data = await betService.getBetHistory(player.id);
      setBets(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке истории ставок');
    } finally {
      setLoading(false);
    }
  };

  const getBetTypeLabel = (betType: BetType): string => {
    switch (betType) {
      case BetType.EVEN_ODD:
        return 'Чет/Нечет';
      case BetType.NUMBER_ROULETTE:
        return 'Числовая Рулетка';
      case BetType.EMOJI_ROULETTE:
        return 'Эмодзи Рулетка';
      default:
        return betType;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString || '';
    }
  };

  const effectiveLoading = loadingOverride ?? loading;
  const effectiveError = errorMessage ?? error;

  if (effectiveLoading) {
    return (
      <div className="bet-history">
        <h2>История ставок</h2>
        <p className="empty-history">Загрузка...</p>
      </div>
    );
  }

  if (effectiveError) {
    return (
      <div className="bet-history">
        <h2>История ставок</h2>
        <p className="empty-history error">{effectiveError}</p>
      </div>
    );
  }

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
        {bets.map((betItem, index) => {
          const betType = 'bet' in betItem ? betItem.bet : betItem.betType;
          const isWin = 'isWin' in betItem ? betItem.isWin : undefined;
          const winMoney = 'winMoney' in betItem ? betItem.winMoney : undefined;
          const timestamp = 'timestamp' in betItem ? betItem.timestamp : undefined;

          return (
            <div
              key={betItem.id || index}
              className={`bet-item ${isWin === undefined ? '' : isWin ? 'win' : 'lose'}`}
            >
              <div className="bet-header">
                <span className="bet-type">{getBetTypeLabel(betType)}</span>
                {timestamp && <span className="bet-date">{formatDate(timestamp)}</span>}
              </div>
              <div className="bet-details">
                <div className="bet-info">
                  <span>
                    Выбор: <strong>{betItem.choose}</strong>
                  </span>
                  <span>
                    Ставка: <strong>${betItem.amount.toFixed(2)}</strong>
                  </span>
                </div>
                {isWin !== undefined && (
                  <div className={`bet-status ${isWin ? 'win' : 'lose'}`}>
                    {isWin ? 'Выигрыш' : 'Проигрыш'}
                  </div>
                )}
                {winMoney !== undefined && isWin && (
                  <div className="bet-win">
                    Вы выиграли: <strong>${winMoney.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BetHistory;