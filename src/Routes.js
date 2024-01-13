import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthProvider } from "./auth/helper/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";
import Signin from "./auth/Signin";
import HomePage from "./pages/homepage/HomePage";
import Record from "./pages/recordpage/Record";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { BiLink } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
import SigninRoute from "./auth/SigninRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider />
      <Switch>
        <SigninRoute path="/" exact component={Signin} />
        <PrivateRoute path="/home" exact component={HomePage} />
        <PrivateRoute path="/record" exact component={Record} />
      </Switch>
      <div className="about-me">
        Created with <FcLike /> by Adarsh Shete
        <a href="https://adarsh45.github.io/" target="_blank" rel="noreferrer">
          <BiLink />
        </a>
        <a href="https://github.com/adarsh45" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/adarsh45"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://twitter.com/shete_adarsh"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter />
        </a>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
