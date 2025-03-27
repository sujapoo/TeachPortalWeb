import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './Scripts/Components/LoginComponent';
import DashboardComponent from './Scripts/Components/DashboardComponent';
import AuthLayout from './Scripts/Components/AuthLayout';
import SignupForm from './Scripts/Components/SignupForm';


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginComponent />} />      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignupForm />} /> 
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={<DashboardComponent />} />
        
      </Route>
    </Routes>
  );
};

export default App;
