import {
    FETCH_SHOP_DATA_REQUEST,
    FETCH_SHOP_DATA_SUCCESS,
    FETCH_SHOP_DATA_FAIL,
  } from '../constants/shopConstant';
  import axiosInstance from '../../api/axiosInstance';
  
  export const fetchShopData = () => async (dispatch) => {
    try {
      dispatch({ type: FETCH_SHOP_DATA_REQUEST });
  
      const { data } = await axiosInstance.get('/shop/get');
      dispatch({ type: FETCH_SHOP_DATA_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({
        type: FETCH_SHOP_DATA_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };  