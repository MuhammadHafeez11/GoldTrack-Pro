import {
    LOGIN_REQUEST,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS,
  } from "../constants/userConstant";
  
  export const userReducer = (state = { user: {} }, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
      case REGISTER_USER_REQUEST:
        return {
          loading: true,
          isAuthenticated: false,
        };
      case LOGIN_SUCCESS:
      case REGISTER_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: action.payload,
        };
  
      case LOGOUT_SUCCESS:
        return {
          loading: false,
          user: null,
          isAuthenticated: false,
        };
      case LOGIN_FAIL:
      case REGISTER_USER_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: action.payload,
        };
  
      case LOGOUT_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
  
      default:
        return state;
    }
  };