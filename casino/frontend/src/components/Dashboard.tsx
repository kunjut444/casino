import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { betService } from '../services/api';
import { BetType, BetRequest } from '../types';
import EvenOddBet from './bets/EvenOddBet';
import NumberRouletteBet from './bets/NumberRouletteBet';
import EmojiRouletteBet from './bets/EmojiRouletteBet';
import BetHistory from './BetHistory';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { player, logout, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [selectedBetType, setSelectedBetType] = useState<BetType>(BetType.EVEN_ODD);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastBetResult, setLastBetResult] = useState<any>(null);

  useEffect(() => {
    if (player) {
      loadRecentBets();
    }
  }, [player]);

  const loadRecentBets = async () => {
    if (!player) return;
    try {
      const history = await betService.getBetHistory(player.id);
      // Показываем только последние 5 ставок на дашборде
      setBetHistory(history.slice(0, 5));
    } catch (error) {
      // Игнорируем ошибки при загрузке истории на дашборде
      console.error('Failed to load bet history:', error);
    }
  };

  if (!player) {
    return null;
  }

  const handleBet = async (betRequest: Omit<BetRequest, 'playerId'>) => {
    if (!player) return;

    setLoading(true);
    try {
      const fullBetRequest: BetRequest = {
        ...betRequest,
        playerId: player.id,
      };

      const result = await betService.makeBet(fullBetRequest);
      setLastBetResult(result);
      
      // Обновляем баланс
      if (result.isWin) {
        updateBalance(player.balance + result.winMoney - result.amount);
      } else {
        updateBalance(player.balance - result.amount);
      }

      // Обновляем историю ставок
      await loadRecentBets();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при размещении ставки');
    } finally {
      setLoading(false);
    }
  };

  const renderBetComponent = () => {
    switch (selectedBetType) {
      case BetType.EVEN_ODD:
        return <EvenOddBet onBet={handleBet} loading={loading} playerBalance={player.balance} />;
      case BetType.NUMBER_ROULETTE:
        return <NumberRouletteBet onBet={handleBet} loading={loading} playerBalance={player.balance} />;
      case BetType.EMOJI_ROULETTE:
        return <EmojiRouletteBet onBet={handleBet} loading={loading} playerBalance={player.balance} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎰 Мини Казино</h1>
          <div className="user-info">
            <div className="balance">
              <span className="balance-label">Баланс:</span>
              <span className="balance-amount">${player.balance.toFixed(2)}</span>
            </div>
            <div className="username">👤 {player.username}</div>
            <div className="nav-buttons">
              <button onClick={() => navigate('/bets')} className="nav-button">
                История ставок
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

      {lastBetResult && (
        <div className={`bet-result ${lastBetResult.isWin ? 'win' : 'lose'}`}>
          {lastBetResult.isWin ? (
            <div>
              <h3>🎉 Вы выиграли!</h3>
              <p>Выигрыш: ${lastBetResult.winMoney.toFixed(2)}</p>
            </div>
          ) : (
            <div>
              <h3>😔 Вы проиграли</h3>
              <p>Ставка: ${lastBetResult.amount.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      <div className="dashboard-content">
        <div className="bet-section">
          <div className="bet-type-selector">
            <button
              className={selectedBetType === BetType.EVEN_ODD ? 'active' : ''}
              onClick={() => setSelectedBetType(BetType.EVEN_ODD)}
            >
              Чет/Нечет
            </button>
            <button
              className={selectedBetType === BetType.NUMBER_ROULETTE ? 'active' : ''}
              onClick={() => setSelectedBetType(BetType.NUMBER_ROULETTE)}
            >
              Числовая Рулетка
            </button>
            <button
              className={selectedBetType === BetType.EMOJI_ROULETTE ? 'active' : ''}
              onClick={() => setSelectedBetType(BetType.EMOJI_ROULETTE)}
            >
              Эмодзи Рулетка
            </button>
          </div>

          <div className="bet-component-container">
            {renderBetComponent()}
          </div>
        </div>

        <div className="history-section">
          <div className="history-section-header">
            <h2>История ставок</h2>
            <div className="history-actions">
              <button className="nav-button" onClick={() => navigate('/transactions')}>
                История транзакций
              </button>
            </div>
          </div>
          <BetHistory bets={betHistory} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



