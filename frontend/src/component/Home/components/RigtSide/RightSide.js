import React from "react";
import CustomerReview from "../CustomerReview/CustomerReview.js";
import Updates from "../Updates/Updates.js";
import { useTranslation } from "react-i18next";
import "./RightSide.css";

const RightSide = () => {
  const { t } = useTranslation();
  return (
    <div className="RightSide">
      <div>
        <h3>{t("previousTransactions")}</h3>
        <Updates />
      </div>
      {/* <div>
        <h3>{t("transactionsChart")}</h3>
        <CustomerReview />
      </div> */}
    </div>
  );
};

export default RightSide;