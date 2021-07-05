import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Root from "pages/Root";
import Login from "pages/Login";
import Lobby from "pages/Lobby";

const Router = () => {
    return (
        <main>
            <Switch>
                <Route path="/" exact component={Root}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/lobby" exact component={Lobby}/>
                <Redirect to="/"/>
            </Switch>
        </main>
    );
};

export default Router;
