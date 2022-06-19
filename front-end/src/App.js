import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
  Navbar,
  HomePage,
  CryptoCurrencies,
  CryptoDetails,
  News,
  Exchanges,
  Login,
  Trading,
  Investment,
} from './components';
import { Layout } from 'antd';
import './App.css';
import Register from './components/Register/Register.jsx';

const App = () => {
  return (
    <div className="app">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main">
        <Layout style={{ backgroundColor: '#e6fffd', height: '100%' }}>
          <div className="routes">
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/exchanges">
                <Exchanges />
              </Route>
              <Route exact path="/cryptocurrencies">
                <CryptoCurrencies />
              </Route>
              <Route exact path="/crypto/:coinId">
                <CryptoDetails />
              </Route>
              <Route exact path="/news">
                <News />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/investment">
                <Investment />
              </Route>
              <Route exact path="/trading">
                <Trading />
              </Route>
            </Switch>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default App;
