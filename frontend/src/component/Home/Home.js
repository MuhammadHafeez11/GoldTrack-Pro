import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';
import { fetchHistory, fetchNotifications } from '../../redux/actions/historyAction';
import { fetchShopData } from '../../redux/actions/shopAction';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { histories } = useSelector((state) => state.history);
  const { today, previous, loading, error } = useSelector((state) => state.notifications);
  const [totals, setTotals] = useState({
    totalGoldPurchased: 0,
    totalGoldSold: 0,
    totalGoldDeposited: 0,
    totalGoldWithdrawn: 0,
    totalCashDeposited: 0,
    totalCashWithdrawn: 0,
  });

  useEffect(() => {
    if (histories) {
      const summary = {
        totalGoldPurchased: 0,
        totalGoldSold: 0,
        totalGoldDeposited: 0,
        totalGoldWithdrawn: 0,
        totalCashDeposited: 0,
        totalCashWithdrawn: 0,
      };

      if(histories){
      histories?.forEach((history) => {
        history.records.forEach((record) => {
          if (record.type === 'GoldPurchase') summary.totalGoldPurchased += record.gold;
          if (record.type === 'GoldSale') summary.totalGoldSold += record.gold;
          if (record.type === 'GoldDeposit') summary.totalGoldDeposited += record.gold;
          if (record.type === 'GoldWithdraw') summary.totalGoldWithdrawn += record.gold;
          if (record.type === 'CashDeposit') summary.totalCashDeposited += record.amount;
          if (record.type === 'CashWithdraw') summary.totalCashWithdrawn += record.amount;
        });
      });

      setTotals(summary);
    }}
  }, [histories]);
  
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchShopData());
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="home-container">
      {/* <header className="home-header">
        <h1>{t('welcomeMessage')}</h1>
        <p>{t('descriptionMessage')}</p>
      </header> */}
      <div className="transaction-summary">
        {Object.keys(totals).map((key) => (
          <div className="summary-card" key={key}>
            <p className="summary-title">{t(key)}</p>
            <p className="summary-value">
              {totals[key]} {key.includes('Gold') ? t('grams') : 'Rs'}</p>
          </div>
        ))}
      </div>

      <div className="home-options">
        <Link to="/add-customer" className="home-option">
          <div className="option-box">{t('addCustomers')}</div>
        </Link>
        <Link to="/view-customers" className="home-option">
          <div className="option-box">{t('viewCustomers')}</div>
        </Link>
        <Link to="/records" className="home-option">
          <div className="option-box">{t('viewTransactions')}</div>
        </Link>
        <Link to="/enter-records" className="home-option">
          <div className="option-box">{t('enterTransactions')}</div>
        </Link>
      </div>
      <div className="dashboard-notifications">
        <div className="notifications-container">
          <h2>{t('todayTransactions')}</h2>
          {loading ? (
            <p>{t('loading')}</p>
          ) : error ? (
            <p>{t('error', { error })}</p>
          ) : (
            <div className="notification-list">
              {today.length > 0 ? (
                today.map((note, index) => <div key={index} className="notification">{note.message}</div>)
              ) : (
                <p>{t('noTransactionsToday')}</p>
              )}
            </div>
          )}
        </div>
        <div className="notifications-container">
          <h2>{t('previousTransactions')}</h2>
          {loading ? (
            <p>{t('loading')}</p>
          ) : error ? (
            <p>{t('error', { error })}</p>
          ) : (
            <div className="notification-list">
              {previous.length > 0 ? (
                previous.map((note, index) => <div key={index} className="notification">{note.message}</div>)
              ) : (
                <p>{t('noPreviousTransactions')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
