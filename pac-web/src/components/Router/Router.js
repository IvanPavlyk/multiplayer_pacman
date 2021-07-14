import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Root from "pages/Root";
import Login from "pages/Login";
import Room from "pages/Room";

const Router = () => {
    return (
        <main>
            <Switch>
                <Route path="/" exact component={Root}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/room/:id" component={Room}/>
                <Redirect to="/"/>
            </Switch>
        </main>
    );
};

export default Router;
