//import React from 'react';
import Login from '../components/Login';
import '../Login.css';
import ResponsiveAppBar from '../AppBar';

const LoginPage = () => (
  <div className="login-page">
    <ResponsiveAppBar></ResponsiveAppBar>
    <Login />
   
  </div>
);

export default LoginPage;
