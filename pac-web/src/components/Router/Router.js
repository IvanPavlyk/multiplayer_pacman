import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from 'pages/Home';
import Login from 'pages/Login';
import Room from 'pages/Room';
import Account from 'pages/Account';
import AccountStats from 'pages/AccountStats';
import NavigationBar from 'components/NavigationBar';

const Router = () => {
  return (
    <main>
      <NavigationBar>
        <Switch>
          <Route path='/' exact component={Home}/>
          <Route path='/login' exact component={Login}/>
          <Route path='/room/:id' component={Room}/>
          <Route path='/account' component={Account}/>
          <Route path='/stats/account' component={AccountStats}/>
          <Redirect to='/login'/>
        </Switch>
      </NavigationBar>
    </main>
  );
};

export default Router;
