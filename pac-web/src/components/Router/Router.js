import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "../Pages/Login";


const Router = () => {
    return (
        <main>
            <Switch>
                <Route path="/login" exact component={Login} />
                <Redirect to="/login" />
            </Switch>
        </main>
    );
};

export default Router;
