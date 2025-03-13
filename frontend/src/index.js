import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux'
import store, {persistor} from './store';
import './i18n.js';

import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store}>
    {/* <PersistGate persistor={persistor}> */}
    <App />
    <ToastContainer
  position="bottom-center"
  autoClose={2000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  transition={Slide} // Use Slide component here
/> 
{/* </PersistGate> */}
  </Provider>
);