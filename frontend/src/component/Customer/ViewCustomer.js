import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './customer.css';
import { clearErrors, getCustomers } from '../../redux/actions/customerAction';
import { fetchShopData } from '../../redux/actions/shopAction';
import CustomTable from '../customComponent/customTable';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Home/components/Sidebar';

const ViewCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Fetch customers and shop data from Redux store
  const { customers, loading, error } = useSelector((state) => state.customer);
  const { shopData, loading: shopLoading, error: shopError } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(fetchShopData());

    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const columns = [
    { header: t('customerName'), accessorKey: 'customerName' },
    { header: t('cnic'), accessorKey: 'CNIC' },
    // { header: t('gender'), accessorKey: 'gender' },
    { header: t('phoneNumber'), accessorKey: 'phoneNumber' },
    {
      header: t('address'),
      cell: ({ row }) => {
        const { address } = row.original;
        return `${address.streetAddress}, ${address.city}, ${address.state}, ${address.country}`;
      },
    }, { 
      header: `${t('gold')} (grams)`, 
      accessorKey: 'gold',
      cell: ({ row }) => new Intl.NumberFormat().format(row.original.gold) // Format gold value with commas
    },
    { 
      header: `${t('amount')} (Rs)`, 
      accessorKey: 'amount',
      cell: ({ row }) => `${new Intl.NumberFormat().format(row.original.amount)}` // Format amount value with commas
    },
  ];

  return (
    <div className='App'>
      <div className='Glass'>
        <Sidebar />
    <div className="view-customer-container">
      <h3 className='h3'>{t("viewCustomers")}</h3>
      {/* <div className="shop-details">
        {shopLoading ? (
          <p>{t('loading')}...</p>
        ) : shopError ? (
          <p className="error-message">{t('error')}: {shopError}</p>
        ) : (
          <div className="shop-summary">
  <p><strong>{t('totalGold')}:</strong> {`${new Intl.NumberFormat().format(shopData?.gold || 0)} ${t('grams')}`}</p>
  <p><strong>{t('totalAmount')}:</strong> {`Rs ${new Intl.NumberFormat().format(shopData?.amount || 0)}`}</p>
</div>

        )}
      </div> */}

      {loading ? (
        <p>{t('loading')}...</p>
      ) : error ? (
        <p className="error-message">{t('error')}: {error}</p>
      ) : (
        <CustomTable columns={columns} data={customers || []} />
      )}
    </div>
    </div>
    </div>
  );
};

export default ViewCustomer;
