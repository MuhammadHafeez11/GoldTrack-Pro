import {
    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_FAIL,
    GET_CUSTOMERS_REQUEST,
    GET_CUSTOMERS_SUCCESS,
    GET_CUSTOMERS_FAIL,
    CLEAR_ERRORS,
    RESET_CUSTOMER_SUCCESS
  } from "../constants/customerConstant";

  export const customerReducer = (state = { customers: [] }, action) => {
    switch (action.type) {
      case ADD_CUSTOMER_REQUEST:
      case GET_CUSTOMERS_REQUEST:
        return {
          ...state,
          loading: true,
        };
  
      case ADD_CUSTOMER_SUCCESS:
        return {
          ...state,
          loading: false,
          customer: action.payload,
          success: true,
        };
  
      case GET_CUSTOMERS_SUCCESS:
        return {
          ...state,
          loading: false,
          customers: action.payload,
        };
  
      case ADD_CUSTOMER_FAIL:
      case GET_CUSTOMERS_FAIL:
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

        case RESET_CUSTOMER_SUCCESS:
          return {
            ...state,
            success: false,
          };
  
      default:
        return state;
    }
  };