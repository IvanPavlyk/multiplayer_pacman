import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from 'pages/Home';
import Login from 'pages/Login';
import Room from 'pages/Room';
import Account from 'pages/Account';
import MatchHistory from 'pages/MatchHistory';
import NavigationBar from 'components/NavigationBar';
import GlobalStats from 'pages/GlobalStats';
import NewAccount from 'pages/NewAccount';
import PrivateRoute from 'components/PrivateRoute';

const Router = () => {
  return (
    <main>
      <NavigationBar>
        <Switch>
          <Route path='/' exact component={Login}/>
          <PrivateRoute path='/new-account' component={NewAccount}/>
          <PrivateRoute path='/home' component={Home}/>
          <PrivateRoute path='/room/:id' component={Room}/>
          <PrivateRoute path='/account' component={Account}/>
          <PrivateRoute path='/stats/account' component={MatchHistory}/>
          <PrivateRoute path='/stats/global' component={GlobalStats}/>
        </Switch>
      </NavigationBar>
    </main>
  );
};

export default Router;
