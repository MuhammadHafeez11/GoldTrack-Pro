import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import "./Table.css";
import { fetchHistory } from "../../../../redux/actions/historyAction";
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next

const makeStyle = (status) => {
  if (status === "Approved") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "Pending") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

export default function BasicTable() {
  const dispatch = useDispatch();
  const { histories } = useSelector((state) => state.history);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const { t } = useTranslation(); // Hook for translation

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  useEffect(() => {
    if (histories) {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recent = histories
        .flatMap((history) =>
          history.records.map((record) => ({
            ...record,
            customerId: history.customerId,
            date: new Date(record.date),
          }))
        )
        .filter((record) => record.date > last24Hours)
        .map((record) => ({
          name: record.type,
          customerName: record.customerId.customerName,
          trackingId: record._id,
          gold: record.gold,
          amount: record.amount,
          date: record.date.toISOString().split("T")[0],
          status: "Approved", // Adjust based on your requirements
        }));

      setRecentTransactions(recent);
    }
  }, [histories]);

  return (
    <div className="Table">
      <h3>{t("todayTransactions")}</h3>
      <TableContainer
  component={Paper}
  style={{
    boxShadow: "0px 13px 20px 0px #80808029",
    maxHeight: "210px", // Control the scrollable height
    overflowY: "auto",  // Allow vertical scrolling
  }}
>
  <Table
    sx={{ 
      minWidth: 650,
      // tableLayout: "fixed", // Ensures fixed layout for proper styling
    }}
    aria-label="simple table"
  >
    <TableHead>
      <TableRow>
        <TableCell align="left" className="sticky-header">
          {t("transactionType")}
        </TableCell>
        <TableCell align="left" className="sticky-header">
          {t("customerName")}
        </TableCell>
        <TableCell align="left" className="sticky-header">
          {t("amount")}
        </TableCell>
        <TableCell align="left" className="sticky-header">
          {t("goldQuantity")}
        </TableCell>
        <TableCell align="left" className="sticky-header">
          {t("status")}
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {recentTransactions.length > 0 ? (
        recentTransactions.map((row) => (
          <TableRow key={row.trackingId}>
            <TableCell>{row.name}</TableCell>
            <TableCell align="left">{row.customerName}</TableCell>
            <TableCell align="left">{row.amount}</TableCell>
            <TableCell align="center">{row.gold}</TableCell>
            <TableCell align="left">
              <span className="status" style={makeStyle(row.status)}>
                {row.status}
              </span>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={5}
            align="center"
            style={{ color: "#888", fontStyle: "italic" }}
          >
            {t("noTransactionsToday")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
    </div>
  );
}