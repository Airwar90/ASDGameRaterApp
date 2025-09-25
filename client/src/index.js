import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import HomePage from './pages/HomePage';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import AddRating from './pages/AddRating';
import UserRatings from './pages/UserRatings';
import UpdateRating from './pages/UpdateRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/userRatings" element={<UserRatings />} />
        <Route path="/addRating" element={<AddRating />} />
        <Route path="/updateRating" element={<UpdateRating />} />
        
      </Routes>      
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
