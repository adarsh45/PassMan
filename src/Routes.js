import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./auth/helper/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";
import Signin from "./auth/Signin";
import HomePage from "./pages/homepage/HomePage";
import Record from "./pages/recordpage/Record";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider />
      <Switch>
        <Route path="/" exact component={Signin} />
        <PrivateRoute path="/home" exact component={HomePage} />
        <PrivateRoute path="/record" exact component={Record} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
