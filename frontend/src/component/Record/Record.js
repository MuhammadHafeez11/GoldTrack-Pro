import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../customComponent/customTable';
import { fetchHistory } from '../../redux/actions/historyAction';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DateRangePicker } from 'react-dates';
// import { FaArrowLeft } from 'react-icons/fa';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './EnterRecords.css';
import Sidebar from '../Home/components/Sidebar';

const Record = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, histories, error } = useSelector((state) => state.history);

  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  useEffect(() => {
    const data = histories
      ?.map((history) =>
        history.records.map((record) => ({
          customerName: history.customerId?.customerName,
          cnic: history.customerId?.CNIC,
          type: record.type,
          gold: record.gold,
          amount: record.amount,
          date: new Date(record.date).toISOString().split('T')[0],
          goldRate: record.goldRate,
        }))
      )
      .flat()
      .filter((record) => {
        const matchesName = searchName
          ? record.customerName?.toLowerCase().includes(searchName.toLowerCase())
          : true;
        const matchesType = searchType ? record.type === searchType : true;
  
        const recordDate = new Date(record.date);
        const normalizedRecordDate = new Date(
          recordDate.getFullYear(),
          recordDate.getMonth(),
          recordDate.getDate()
        );
        const normalizedStartDate = startDate
          ? new Date(startDate.year(), startDate.month(), startDate.date())
          : null;
        const normalizedEndDate = endDate
          ? new Date(endDate.year(), endDate.month(), endDate.date())
          : null;
  
        const isWithinDateRange =
          (!normalizedStartDate || normalizedRecordDate >= normalizedStartDate) &&
          (!normalizedEndDate || normalizedRecordDate <= normalizedEndDate);
  
        return matchesName && matchesType && isWithinDateRange;
      });
  
    // Sort transactions in descending order by date (latest first)
    const sortedData = data?.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  
    setFilteredData(sortedData);
  }, [histories, searchName, searchType, startDate, endDate]);  
  
  const handleViewFiltered = () => {
    navigate('/filtered-records', { state: { data: filteredData } });
  };

  const columns = [
    { accessorKey: 'customerName', header: t('customerName') },
    { accessorKey: 'cnic', header: t('cnic') },
    { accessorKey: 'type', header: t('type') }, { 
      header: `${t('gold')} (grams)`,
      accessorKey: 'gold',
      cell: ({ row }) => new Intl.NumberFormat().format(row.original.gold)
    },
    { 
      header: `${t('amount')} (Rs)`, 
      accessorKey: 'amount',
      cell: ({ row }) => `Rs ${new Intl.NumberFormat().format(row.original.amount)}`
    },
    { accessorKey: 'date', header: t('date') },
  ];

  return (
    <div className='App'>
      <div className='Glass'>
        <Sidebar />
    <div className="record-container">
      {/* <div className='header'>
      <button className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft size="1.5vmax" />
      </button>
      <h1 className="title">{t('viewTransactions')}</h1>
      </div> */}
      <div className="search-container">
        <h2>{t('viewTransactions')}</h2>
        <div className="search-fields">
          <input
            type="text"
            placeholder={t('searchByName')}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="">{t('allTransactionTypes')}</option>
            <option value="CashDeposit">{t('cashDeposit')}</option>
            <option value="CashWithdraw">{t('cashWithdraw')}</option>
            <option value="GoldDeposit">{t('goldDeposit')}</option>
            <option value="GoldWithdraw">{t('goldWithdraw')}</option>
            <option value="GoldPurchase">{t('goldPurchase')}</option>
            <option value="GoldSale">{t('goldSale')}</option>
          </select>
          <DateRangePicker 
            startDate={startDate}
            startDateId="start_date_id"
            endDate={endDate}
            endDateId="end_date_id"
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
            isOutsideRange={() => false}
          />
        </div>
        
      </div>
      {filteredData?.length > 0 && (
        <button onClick={handleViewFiltered} className="print-button">
          {t('printTransactions')}
        </button>
      )}
      {loading ? (
        <p>{t('loading')}...</p>
      ) : error ? (
        <p className="error">
          {t('error')}: {error}
        </p>
      ) : filteredData?.length > 0 ? (
        <CustomTable columns={columns} data={filteredData} />
      ) : (
        <p className="no-data">{t('noDataFound')}</p>
      )}
    </div></div>
    </div>
  );
};

export default Record;