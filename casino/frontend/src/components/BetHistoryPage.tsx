import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { betService } from '../services/api';
import BetHistory from './BetHistory';
import { Bet, BetRequest, BetSearchCriteria, BetType } from '../types';
import './BetHistoryPage.css';

type BetListItem = Bet | BetRequest;

const BetHistoryPage: React.FC = () => {
  const { player, logout } = useAuth();
  const navigate = useNavigate();

  const [bets, setBets] = useState<BetListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filters, setFilters] = useState({
    bet: '',
    minAmount: '',
    maxAmount: '',
    isWin: '',
    choose: '',
  });

  useEffect(() => {
    if (player) {
      loadDefaultHistory();
    }
  }, [player]);

  const loadDefaultHistory = async () => {
    if (!player) return;
    setLoading(true);
    setError(null);
    try {
      const data = await betService.getBetHistory(player.id);
      setBets(data);
      setIsSearchMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить историю ставок');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!player) return;

    const searchFilters: BetSearchCriteria = {
      bet: filters.bet ? (filters.bet as BetType) : undefined,
      minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      isWin: filters.isWin === '' ? undefined : filters.isWin === 'true',
      choose: filters.choose || undefined,
    };

    setLoading(true);
    setError(null);
    try {
      const data = await betService.searchBets(player.id, searchFilters);
      setBets(data);
      setIsSearchMode(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось выполнить поиск');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      bet: '',
      minAmount: '',
      maxAmount: '',
      isWin: '',
      choose: '',
    });
    loadDefaultHistory();
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (!player) {
    return null;
  }

  return (
    <div className="bet-history-page">
      <header className="page-header">
        <div className="header-content">
          <h1>🎰 История ставок</h1>
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
        <form className="filters-card" onSubmit={handleSearch}>
          <div className="filters-header">
            <div>
              <h3>Поиск по спецификациям</h3>
              <p>Заполните один или несколько фильтров</p>
            </div>
            <div className="filters-actions">
              <button type="button" className="ghost-button" onClick={resetFilters} disabled={loading}>
                Сбросить
              </button>
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Поиск...' : 'Искать'}
              </button>
            </div>
          </div>

          <div className="filters-grid">
            <label className="filter-field">
              <span>Тип ставки</span>
              <select name="bet" value={filters.bet} onChange={handleFilterChange}>
                <option value="">Любой</option>
                <option value={BetType.EVEN_ODD}>Чет/Нечет</option>
                <option value={BetType.NUMBER_ROULETTE}>Числовая рулетка</option>
                <option value={BetType.EMOJI_ROULETTE}>Эмодзи рулетка</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Минимальная сумма</span>
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </label>

            <label className="filter-field">
              <span>Максимальная сумма</span>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </label>

            <label className="filter-field">
              <span>Результат</span>
              <select name="isWin" value={filters.isWin} onChange={handleFilterChange}>
                <option value="">Любой</option>
                <option value="true">Выигрыш</option>
                <option value="false">Проигрыш</option>
              </select>
            </label>

            <label className="filter-field full-width">
              <span>Выбор игрока</span>
              <input
                type="text"
                name="choose"
                value={filters.choose}
                onChange={handleFilterChange}
                placeholder="Например, EVEN, ODD или выбранный номер"
              />
            </label>
          </div>
        </form>

        <div className="history-wrapper">
          <div className="history-header">
            <div>
              <h2>{isSearchMode ? 'Результаты поиска' : 'Вся история ставок'}</h2>
              {isSearchMode && <p>Отфильтрованные данные по вашим условиям</p>}
            </div>
            {isSearchMode && (
              <button type="button" className="ghost-button" onClick={resetFilters} disabled={loading}>
                Показать все
              </button>
            )}
          </div>
          <BetHistory bets={bets} loadingOverride={loading} errorMessage={error} />
        </div>
      </div>
    </div>
  );
};

export default BetHistoryPage;