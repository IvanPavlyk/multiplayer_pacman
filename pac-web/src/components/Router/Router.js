import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from 'pages/Home';
import Login from 'pages/Login';
import Room from 'pages/Room';
import Account from 'pages/Account';
import AccountStats from 'pages/AccountStats';
import NavigationBar from 'components/NavigationBar';
import GlobalStats from 'pages/GlobalStats';
import NewAccount from 'pages/NewAccount';

const Router = () => {
  return (
    <main>
      <NavigationBar>
        <Switch>
          <Route path='/' exact component={Login}/>
          <Route path='/home' exact component={Home}/>
          <Route path='/room/:id' component={Room}/>
          <Route path='/account' component={Account}/>
          <Route path='/new-account' component={NewAccount}/>
          <Route path='/stats/account' component={AccountStats}/>
          <Route path='/stats/global' component={GlobalStats}/>
        </Switch>
      </NavigationBar>
    </main>
  );
};

export default Router;
