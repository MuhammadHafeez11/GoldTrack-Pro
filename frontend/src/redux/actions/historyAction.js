import {
  FETCH_HISTORY_REQUEST,
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_FAIL,
  CREATE_OR_UPDATE_HISTORY_REQUEST,
  CREATE_OR_UPDATE_HISTORY_SUCCESS,
  CREATE_OR_UPDATE_HISTORY_FAIL,
  RESET_HISTORY_SUCCESS,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAIL,
  HISTORY_ANALYTICS_REQUEST,
  HISTORY_ANALYTICS_SUCCESS,
  HISTORY_ANALYTICS_FAIL,
} from '../constants/historyConstant';
import axiosInstance from '../../api/axiosInstance';

export const getHistoryAnalytics = (params = "1week") => async (dispatch) => {
  try {
    dispatch({ type: HISTORY_ANALYTICS_REQUEST });

    // Check if params is an object (with startDate and endDate)
    let queryStr = "";
    if (typeof params === "object" && params.startDate && params.endDate) {
      queryStr = `?startDate=${params.startDate}&endDate=${params.endDate}`;
    } else {
      // Fallback: use timeRange
      queryStr = `?timeRange=${params}`;
    }

    const { data } = await axiosInstance.get(`/history/analytics${queryStr}`);

    dispatch({
      type: HISTORY_ANALYTICS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: HISTORY_ANALYTICS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const fetchHistory = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_HISTORY_REQUEST });
    const { data } = await axiosInstance.get('/history/get');
    dispatch({ type: FETCH_HISTORY_SUCCESS, payload: data.histories });
  } catch (error) {
    dispatch({
      type: FETCH_HISTORY_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const createOrUpdateHistory = (historyData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_OR_UPDATE_HISTORY_REQUEST });

    console.log(historyData);
    const { data } = await axiosInstance.post('/history/create-or-update', historyData);
    
    dispatch({ type: CREATE_OR_UPDATE_HISTORY_SUCCESS, payload: data.history, success: data.success});
  } catch (error) {
    dispatch({
      type: CREATE_OR_UPDATE_HISTORY_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const fetchNotification = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
    const { data } = await axiosInstance.get('/history/notifications');
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_NOTIFICATIONS_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const resetHistorySuccess = () => (dispatch) => {
  dispatch({ type: RESET_HISTORY_SUCCESS });
};
