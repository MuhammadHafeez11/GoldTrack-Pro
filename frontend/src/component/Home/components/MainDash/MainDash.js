import React, { useState, useEffect} from "react";
import Cards from "../Cards/Cards.js";
import Table from "../Table/Table.js";
import "./MainDash.css";
import { useTranslation } from 'react-i18next';
import { fetchHistory } from "../../../../redux/actions/historyAction.js";
import { useDispatch, useSelector } from "react-redux";

const MainDash = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { histories } = useSelector((state) => state.history);
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
    // dispatch(fetchNotifications());
    // dispatch(fetchShopData());
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="MainDash">
      <h1>{t("dashboard")}</h1>
         <Cards />
       {/* <div className="transaction-summary">
        {Object.keys(totals).map((key) => (
          <div className="summary-card" key={key}>
            <p className="summary-title">{t(key)}</p>
            <p className="summary-value">
              {totals[key]} {key.includes('Gold') ? t('grams') : 'Rs'}</p>
          </div>
        ))}
      </div> */}
      {/* <Table /> */}
    </div>
  );
};

export default MainDash;