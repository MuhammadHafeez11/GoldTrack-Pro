import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {userReducer} from './redux/reducers/userReducer';
import { customerReducer } from './redux/reducers/customerReducer';
import { historyAnalyticsReducer, historyReducer, notificationReducer } from './redux/reducers/historyReducer';
import { shopReducer } from './redux/reducers/shopReducer';

const persistConfig = { 
    key: 'root',
    storage,
    whitelist: ['user']
}

const reducer = combineReducers({
    shop: shopReducer,
    user: userReducer,
    customer: customerReducer,
    analytics: historyAnalyticsReducer,
    history: historyReducer,
    notifications: notificationReducer
});

const persistedReducer = persistReducer(persistConfig, reducer)

let initialState = {
    user: [],
    shop: [],
    customer: [],
    history: [],
    analytics: [],
    notifications: [],
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

// export const persistor = persistStore(store);
export default store;