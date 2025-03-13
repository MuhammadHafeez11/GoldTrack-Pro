import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import RecordPDF from './RecordPDF';
import CustomTable from '../customComponent/customTable';
import './FilteredRecordsPage.css';

const FilteredRecordsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data } = location.state || {};

  const columns = [
    { accessorKey: 'customerName', header: t('customerName') },
    { accessorKey: 'cnic', header: t('cnic') },
    { accessorKey: 'type', header: t('type') },
    { accessorKey: 'gold', header: t('gold') },
    { accessorKey: 'amount', header: t('amount') },
    { accessorKey: 'date', header: t('date') },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="filtered-records-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft size="1.5vmax" />
        </button>
        <div className="icons">
          <PDFDownloadLink document={<RecordPDF data={data} />} fileName="FilteredRecords.pdf">
            {({ loading }) =>
              loading ? (
                <span>{t('loadingDocument')}</span>
              ) : (
                <FaDownload size="1.5vmax" className="icons" />
              )
            }
          </PDFDownloadLink>
          <FaPrint size="1.5vmax" className="icons print-icon" onClick={handlePrint} />
        </div>
      </div>
      {data ? (
        <div className="printable-area">
          <CustomTable columns={columns} data={data} isPrinting={true}/>
        </div>
      ) : (
        <p>{t('noDataToDisplay')}</p>
      )}
    </div>
  );
};

export default FilteredRecordsPage;