import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// Parent Card Component
const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <LayoutGroup>
      {expanded ? (
        <ExpandedCard index={props.index} param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </LayoutGroup>
  );
};

// Function to determine card position for styling
const getPositionClass = (index) => (index >= 3 ? "lower-position" : "");

// Compact Card Component
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.title}`}
      onClick={setExpanded}
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue.toFixed(0)}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>{param.value}</span>
        {/* Display the dynamic range text */}
        <span>{param.rangeText}</span>
      </div>
    </motion.div>
  );
}

// Expanded Card Component
function ExpandedCard({ param, setExpanded, index }) {
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (value) => {
            try {
              return new Date(value).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              });
            } catch {
              return "";
            }
          },
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      colors: ["#fff"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      grid: { show: true, borderColor: "#ffffff30" },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.2,
          stops: [0, 100],
        },
      },
    },
  };

  return (
    <motion.div
      className={`ExpandedCard ${getPositionClass(index)}`}
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId={`expandableCard-${param.title}`}
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart options={data.options} series={param.series} type="area" />
      </div>
      {/* Display the dynamic range text */}
      <span>{param.rangeText}</span>
    </motion.div>
  );
}

export default Card;