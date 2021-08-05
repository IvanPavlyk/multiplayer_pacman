import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from 'pages/Home';
import Room from 'pages/Room';
import Login from 'pages/Login';
import Account from 'pages/Account';
import MatchHistory from 'pages/MatchHistory';
import NavigationBar from 'components/NavigationBar';
import GlobalStats from 'pages/GlobalStats';
import NewAccount from 'pages/NewAccount';

const Router = () => {
  return (
    <main>
      <NavigationBar/>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/room/:id' component={Room}/>
        <Route path='/account' component={Account}/>
        <Route path='/new-account' component={NewAccount}/>
        <Route path='/stats/account' component={MatchHistory}/>
        <Route path='/stats/global' component={GlobalStats}/>
      </Switch>
    </main>
  );
};

export default Router;
