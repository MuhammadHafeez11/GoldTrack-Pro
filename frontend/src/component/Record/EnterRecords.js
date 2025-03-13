import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../redux/actions/customerAction';
import { createOrUpdateHistory, fetchHistory, resetHistorySuccess } from '../../redux/actions/historyAction';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './EnterRecords.css';
import Sidebar from '../Home/components/Sidebar';

const EnterRecords = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { customers } = useSelector((state) => state.customer);
  const { loading, success } = useSelector((state) => state.history);

  const [operationType, setOperationType] = useState('deposit');
  const [transactionType, setTransactionType] = useState('cash');
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [amountOrQuantity, setAmountOrQuantity] = useState('');
  const [goldRate, setGoldRate] = useState('');
  const [availableGold, setAvailableGold] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);

  useEffect(() => {
    dispatch(getCustomers());
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().split(' ')[0]);
  }, [dispatch]);

  useEffect(() => {
    if (customerId) {
      const customer = customers.find((cust) => cust._id === customerId);
      if (customer) {
        setAvailableGold(customer.gold);
        setAvailableAmount(customer.amount);
      }
    }
  }, [customerId, customers]);

  useEffect(() => {
    if (success) {
      toast.success(t('transactionSuccessful'));
      setCustomerId('');
      setAmountOrQuantity('');
      setGoldRate('');
      setAvailableAmount('');
      setAvailableGold('');
      dispatch(resetHistorySuccess());
      dispatch(fetchHistory())
      dispatch(getCustomers()); // Refresh customer data immediately
    }
  }, [success, dispatch, t]);

  const calculateAmount = () =>
    operationType === 'purchase' || operationType === 'sale'
      ? Number(amountOrQuantity) * Number(goldRate)
      : Number(amountOrQuantity);

      const submitHandler = (e) => {
        e.preventDefault();
      
        const calculatedAmount = calculateAmount();
      
        // Check for insufficient resources and display a dynamic error message with formatted shortage
        if (
          operationType === 'withdraw' &&
          transactionType === 'gold' &&
          Number(amountOrQuantity) > availableGold
        ) {
          const shortage = Number(amountOrQuantity) - availableGold;
          const formattedShortage = shortage.toLocaleString();
          toast.error(
            t('insufficientGoldForWithdrawal', { shortage: formattedShortage })
          );
          return;
        }
        if (
          operationType === 'withdraw' &&
          transactionType === 'cash' &&
          calculatedAmount > availableAmount
        ) {
          const shortage = calculatedAmount - availableAmount;
          const formattedShortage = shortage.toLocaleString();
          toast.error(
            t('insufficientAmountForWithdrawal', { shortage: formattedShortage })
          );
          return;
        }
        if (operationType === 'purchase' && calculatedAmount > availableAmount) {
          const shortage = calculatedAmount - availableAmount;
          const formattedShortage = shortage.toLocaleString();
          toast.error(
            t('insufficientAmountForPurchase', { shortage: formattedShortage })
          );
          return;
        }
        if (operationType === 'sale' && Number(amountOrQuantity) > availableGold) {
          const shortage = Number(amountOrQuantity) - availableGold;
          const formattedShortage = shortage.toLocaleString();
          toast.error(
            t('insufficientGoldForSale', { shortage: formattedShortage })
          );
          return;
        }
      
        const type =
          operationType === 'deposit'
            ? transactionType === 'cash'
              ? 'CashDeposit'
              : 'GoldDeposit'
            : operationType === 'withdraw'
            ? transactionType === 'cash'
              ? 'CashWithdraw'
              : 'GoldWithdraw'
            : operationType === 'purchase'
            ? 'GoldPurchase'
            : 'GoldSale';
      
        const payload = {
          customerId,
          type,
          amount:
            transactionType === 'cash' ||
            operationType === 'purchase' ||
            operationType === 'sale'
              ? calculatedAmount
              : 0,
          gold:
            transactionType === 'gold' ||
            operationType === 'sale' ||
            operationType === 'purchase'
              ? Number(amountOrQuantity)
              : 0,
          goldRate: Number(goldRate),
          date,
          time,
        };
      
        dispatch(createOrUpdateHistory(payload));
      };
      
      
  return (

    <div className='App'>
      <div className='Glass'>
        <Sidebar />
        <div className="add-customer-container">
          <form className="add-customer-form" onSubmit={submitHandler}>
            <h2>{t('enterTransactions')}</h2>

            <div className="form-group">
              <label>{t('operationType')}:</label>
              <select
                className="form-control"
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
              >
                <option value="deposit">{t('deposit')}</option>
                <option value="withdraw">{t('withdraw')}</option>
                <option value="purchase">{t('purchaseGold')}</option>
                <option value="sale">{t('saleGold')}</option>
              </select>
            </div>

            {(operationType === 'deposit' || operationType === 'withdraw') && (
              <div className="form-group">
                <label>{t('transactionType')}:</label>
                <select
                  className="form-control"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="cash">{t('cash')}</option>
                  <option value="gold">{t('gold')}</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>{t('customerName')}:</label>
              <select
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">{t('selectCustomer')}</option>
                {customers?.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('date')}:</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t('time')}:</label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                {(operationType === 'deposit' || operationType === 'withdraw')
                  ? (transactionType === 'cash'
                    ? t('amount')
                    : `${t('goldQuantity')} (gram)`)
                  : `${t('goldQuantity')} (gram)`}
                :
              </label>
              <input
                type="number"
                className="form-control"
                value={amountOrQuantity}
                onChange={(e) => setAmountOrQuantity(e.target.value)}
              />
            </div>


            {(operationType === 'purchase' || operationType === 'sale') && (
              <>
                <div className="form-group">
                  <label>{t('goldRatePerGram')}:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={goldRate}
                    onChange={(e) => setGoldRate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t('calculatedAmount')}:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={calculateAmount()}
                    readOnly
                  />
                </div>
              </>
            )}

{operationType !== 'deposit' && (
              <>
                {operationType !== 'sale' && (
                  <div className="form-group">
                    <label>{t('availableAmount')}:</label>
                    <input type="text" className="form-control" value={availableAmount} readOnly />
                  </div>
                )}
                <div className="form-group">
                  <label>{t('availableGold')} {t('grams')}:</label>
                  <input type="text" className="form-control" value={availableGold} readOnly />
                </div>
              </>
            )}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? t('processing') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterRecords;