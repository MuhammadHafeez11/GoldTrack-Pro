import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Cards.css";
import Card from "../Card/Card";
import * as Unicons from "@iconscout/react-unicons";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { getHistoryAnalytics } from "../../../../redux/actions/historyAction";

const Cards = () => {
  // Date range states (using moment objects)
  const [startDate, setStartDate] = useState(moment().subtract(7, "days")); // Default: last 7 days
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

  const [cardsData, setCardsData] = useState([]);
  const dispatch = useDispatch();

  const { analyticsData, loading, error } = useSelector((state) => state.analytics);

  // When the date range changes, dispatch the action only when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const params = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      };
      dispatch(getHistoryAnalytics(params));
    }
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    if (analyticsData) {
      setCardsData(analyticsData);
    }
  }, [analyticsData]);

  // Compute a display text for the selected range
  const rangeText = `${startDate.format("DD-MM")} to ${endDate.format("DD-MM")}`;

  return (
    <div>
      {/* Date Range Picker */}
      <div className="time-range-selector">
        <label htmlFor="date-range-picker">Select Date Range: </label>
        <DateRangePicker 
          startDate={startDate} // moment object
          startDateId="start_date_id"
          endDate={endDate} // moment object
          endDateId="end_date_id"
          onDatesChange={({ startDate, endDate }) => {
            // Only update if both dates are available
            if (startDate && endDate) {
              setStartDate(startDate);
              setEndDate(endDate);
            }
          }}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          isOutsideRange={() => false}
          displayFormat="DD-MM-YYYY"
        />
      </div>

      {/* Cards */}
      <div className="Cards">
        {cardsData?.map((card, id) => {
          const IconComponent = Unicons[card.png] || Unicons.UilQuestionCircle;
          return (
            <div className="parentContainer" key={id}>
              <Card
                index={id}
                title={card.title}
                color={card.color}
                barValue={card.barValue}
                value={card.value}
                png={IconComponent}
                rangeText={rangeText}  // Pass the dynamic range text
                series={card.series.map((s) => ({
                  name: s.name,
                  data: s.data.map((d) => ({ x: new Date(d.x), y: d.y })),
                }))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;
