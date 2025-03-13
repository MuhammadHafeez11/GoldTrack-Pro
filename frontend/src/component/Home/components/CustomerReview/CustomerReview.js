import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
// import { fetchHistory } from "../../../../redux/actions/historyAction";

const CustomerReview = () => {
  const dispatch = useDispatch();
  const { histories } = useSelector((state) => state.history || []);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Transactions",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: [],
      },
      yaxis: {
        show: false,
      },
      toolbar: {
        show: false,
      },
    },
  });
  useEffect(() => {
    if (histories?.length > 0) {
      const currentDate = new Date();
  
      // Generate the past 7 days including today
      const pastWeek = [...Array(7)].map((_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        return date;
      }).reverse(); // Ascending order
  
      console.log("Past Week Dates:", pastWeek.map((d) => d.toISOString().split("T")[0]));
  
      // Initialize an object to hold counts for each day
      const dayCounts = pastWeek.reduce((acc, date) => {
        const dayString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        acc[dayString] = 0;
        return acc;
      }, {});
  
      // Count the transactions for each day
      histories.forEach((history) => {
        history.records.forEach((record) => {
          const transactionDate = record.date
            ? new Date(record.date.$date || record.date).toISOString().split("T")[0]
            : null;
          if (transactionDate && dayCounts[transactionDate] !== undefined) {
            dayCounts[transactionDate]++;
          }
        });
      });
  
      console.log("Day Counts After Processing:", dayCounts);
  
      // Prepare data for the chart
      const categories = Object.keys(dayCounts);
      const data = Object.values(dayCounts);
  
      setChartData((prev) => ({
        ...prev,
        series: [
          {
            name: "Transactions",
            data: data,
          },
        ],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: categories,
          },
        },
      }));
    }
  }, [histories]);  

  return (
    <div className="CustomerReview">
      <Chart options={chartData.options} series={chartData.series} type="area" />
    </div>
  );
};

export default CustomerReview;