import axiosInstance from "../../api/axiosInstance";
import {
  ADD_CUSTOMER_REQUEST,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  GET_CUSTOMERS_REQUEST,
  GET_CUSTOMERS_SUCCESS, 
  GET_CUSTOMERS_FAIL,
  CLEAR_ERRORS,
} from "../constants/customerConstant";

// Add Customer
export const addCustomer = (customerData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_CUSTOMER_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const { data } = await axiosInstance.post(`/customer/new`, customerData, config);

    dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: data.customer });
  } catch (error) {
    dispatch({
      type: ADD_CUSTOMER_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Get Customers
export const getCustomers = () => async (dispatch) => {
    try {
      dispatch({ type: GET_CUSTOMERS_REQUEST });
  
      const { data } = await axiosInstance.get(`/customer/get`);
  
      dispatch({ type: GET_CUSTOMERS_SUCCESS, payload: data.customers });
    } catch (error) {
      dispatch({
        type: GET_CUSTOMERS_FAIL,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };