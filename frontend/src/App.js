import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from './component/User/LoginSignUp.js';
import Login from './component/User/Login.js';
// import Home from './component/Home/Home.js';
import AddCustomer from './component/Customer/AddCustomer.js';
import ViewCustomer from './component/Customer/ViewCustomer.js';
import Record from './component/Record/Record.js';
import EnterRecords from './component/Record/EnterRecords.js';
import Navbar from './component/layout/Header/Navbar.js';
import FilteredRecordsPage from './component/Record/FilteredRecordsPage.js';
import Dashboard from './component/Home/Dashboard.js';
import ProtectedRoute from './component/Route/ProtectedRoute.js'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>     
      <Route path="/" element={<Login />} />
      {/* <Route path="/home" element={<Dashboard />} />
      <Route path="/add-customer" element={<AddCustomer />} />
      <Route path="/view-customers" element={<ViewCustomer />} />
      <Route path="/records" element={<Record />} />
      <Route path="/enter-records" element={<EnterRecords />} />
      <Route path="/filtered-records" element={<FilteredRecordsPage />} /> */}
       <Route
          path="/home" 
          element={<ProtectedRoute component={Dashboard} />} 
        />
     <Route 
          path="/add-customer" 
          element={<ProtectedRoute component={AddCustomer} />} 
        />
      <Route 
          path="/view-customers" 
          element={<ProtectedRoute component={ViewCustomer} />} 
        />
      <Route 
          path="/records" 
          element={<ProtectedRoute component={Record} />} 
        />
      <Route 
          path="/enter-records" 
          element={<ProtectedRoute component={EnterRecords} />} 
        />
      <Route 
          path="/filtered-records" 
          element={<ProtectedRoute component={FilteredRecordsPage} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
