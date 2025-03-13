import React, { useEffect, useState } from "react";
import "./Updates.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchNotification } from "../../../../redux/actions/historyAction";

const Updates = () => {
  const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
  const { notifications, loading } = useSelector((state) => state.notifications);
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    dispatch(fetchNotification());
  }, [dispatch]);

  useEffect(() => {
    if (notifications) {
      // notifications is already sorted (most recent first)
      setAllNotifications(notifications);
    }
  }, [notifications]);

  return (
    <div className="Updates">
      {loading ? (
        <p style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}>
          {t("loadingNotifications")}
        </p>
      ) : allNotifications.length > 0 ? (
        allNotifications.map((update, index) => (
          <div className="update" key={index}>
            <div className="noti">
              <div style={{ marginBottom: "0.5rem" }}>
                <span>{update.message}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}>
          {t("noNotifications")}
        </p>
      )}
    </div>
  );
};

export default Updates;