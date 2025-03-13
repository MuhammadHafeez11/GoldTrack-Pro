import {
    FETCH_SHOP_DATA_REQUEST,
    FETCH_SHOP_DATA_SUCCESS,
    FETCH_SHOP_DATA_FAIL,
  } from '../constants/shopConstant';
  
  export const shopReducer = (state = { shopData: {} }, action) => {
    switch (action.type) {
      case FETCH_SHOP_DATA_REQUEST:
        return { loading: true, shopData: {} };
      case FETCH_SHOP_DATA_SUCCESS:
        return { loading: false, success: true, shopData: action.payload };
      case FETCH_SHOP_DATA_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };  