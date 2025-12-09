import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { Transaction, TransactionType, TransactionStatus, TransactionSearchCriteria } from '../types';
import './TransactionHistory.css';

const TransactionHistory: React.FC = () => {
  const { player } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionSearchCriteria>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (player) {
      loadTransactions();
    }
  }, [player]);

  const loadTransactions = async () => {
    if (!player) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactionHistory(player.id);
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке транзакций');
    } finally {
      setLoading(false);
    }
  };

  const searchTransactions = async () => {
    if (!player) return;

    setLoading(true);
    setError(null);

    try {
      const data = await transactionService.searchTransactions(player.id, filters);
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при поиске транзакций');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof TransactionSearchCriteria, value: string) => {
    setFilters((prev) => {
      if (value === '') {
        return { ...prev, [field]: undefined };
      }

      if (field === 'minAmount' || field === 'maxAmount') {
        return { ...prev, [field]: Number(value) };
      }

      if (field === 'type') {
        return { ...prev, type: value as TransactionType };
      }

      if (field === 'status') {
        return { ...prev, status: value as TransactionStatus };
      }

      return prev;
    });
  };

  const resetFilters = () => {
    setFilters({});
    loadTransactions();
  };

  const getTransactionTypeLabel = (type: TransactionType): string => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'Пополнение';
      case TransactionType.WITHDRAWAL:
        return 'Вывод';
      case TransactionType.BONUS:
        return 'Бонус';
      default:
        return type;
    }
  };

  const getTransactionTypeIcon = (type: TransactionType): string => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return '💰';
      case TransactionType.WITHDRAWAL:
        return '💸';
      case TransactionType.BONUS:
        return '🎁';
      default:
        return '📝';
    }
  };

  const getStatusLabel = (status: TransactionStatus): string => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'Завершена';
      case TransactionStatus.PENDING:
        return 'В обработке';
      case TransactionStatus.FAILED:
        return 'Ошибка';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
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
      return dateString;
    }
  };

  return (
    <div className="transaction-history">
      <h2>История транзакций</h2>

      <div className="transaction-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Тип</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Все</option>
              <option value={TransactionType.DEPOSIT}>Пополнение</option>
              <option value={TransactionType.WITHDRAWAL}>Вывод</option>
              <option value={TransactionType.BONUS}>Бонус</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Все</option>
              <option value={TransactionStatus.COMPLETED}>Завершена</option>
              <option value={TransactionStatus.PENDING}>В обработке</option>
              <option value={TransactionStatus.FAILED}>Ошибка</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Мин. сумма</label>
            <input
              type="number"
              placeholder="от"
              value={filters.minAmount ?? ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Макс. сумма</label>
            <input
              type="number"
              placeholder="до"
              value={filters.maxAmount ?? ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="search-button" onClick={searchTransactions} disabled={loading}>
            {loading ? 'Поиск...' : 'Искать'}
          </button>
          <button className="reset-button" onClick={resetFilters} disabled={loading}>
            Сбросить
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : transactions.length === 0 ? (
        <p className="empty-history">Транзакций пока нет</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`transaction-item ${transaction.status.toLowerCase()} ${
                transaction.type === TransactionType.DEPOSIT || transaction.type === TransactionType.BONUS
                  ? 'positive'
                  : 'negative'
              }`}
            >
              <div className="transaction-header">
                <div className="transaction-type">
                  <span className="transaction-icon">
                    {getTransactionTypeIcon(transaction.type)}
                  </span>
                  <span className="transaction-type-label">
                    {getTransactionTypeLabel(transaction.type)}
                  </span>
                </div>
                <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                  {getStatusLabel(transaction.status)}
                </span>
              </div>
              <div className="transaction-details">
                <div className="transaction-amount">
                  {(transaction.type === TransactionType.DEPOSIT ||
                    transaction.type === TransactionType.BONUS) && (
                    <span className="amount positive">+${transaction.amount.toFixed(2)}</span>
                  )}
                  {transaction.type === TransactionType.WITHDRAWAL && (
                    <span className="amount negative">-${transaction.amount.toFixed(2)}</span>
                  )}
                </div>
                <div className="transaction-date">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;


