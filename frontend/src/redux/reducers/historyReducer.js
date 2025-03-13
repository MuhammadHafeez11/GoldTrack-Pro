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

const initialState = {
  today: [],
  previous: [],
  analyticsData: [],
  loading: false,
  error: null,
};

export const historyReducer = (state = { histories: [] }, action) => {
  switch (action.type) {
    case FETCH_HISTORY_REQUEST:
      return { loading: true, histories: [] };
    case FETCH_HISTORY_SUCCESS:
      return { loading: false, histories: action.payload };
    case FETCH_HISTORY_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_OR_UPDATE_HISTORY_REQUEST:
      return { ...state, loading: true };
    case CREATE_OR_UPDATE_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.success,
        histories: action.payload,
      };
    case CREATE_OR_UPDATE_HISTORY_FAIL:
      return { ...state, loading: false, error: action.payload };
      case RESET_HISTORY_SUCCESS:
        return { ...state, success: false }; // Reset success flag
    default:
      return state;
  }
};


export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload.notifications };
    case FETCH_NOTIFICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// export const notificationReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case FETCH_NOTIFICATIONS_REQUEST:
//       return { ...state, loading: true };
//     case FETCH_NOTIFICATIONS_SUCCESS:
//       return { ...state, loading: false, today: action.payload.today, previous: action.payload.previous };
//     case FETCH_NOTIFICATIONS_FAIL:
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

export const historyAnalyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_ANALYTICS_REQUEST:
      return { ...state, loading: true };
    case HISTORY_ANALYTICS_SUCCESS:
      return { loading: false, analyticsData: action.payload, error: null };
    case HISTORY_ANALYTICS_FAIL:
      return { loading: false, error: action.payload, analyticsData: [] };
    default:
      return state;
  }
};
