import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signInWithGithub, signout } from "./helper/authCalls";

// const crypto = require("crypto-js");

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSignout = async () => {
    try {
      await signout();
      console.log("Succesfully logged out!");
    } catch (error) {
      console.log("ERROR SIGNING OUT: ", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    // TODO: handle redirect issue (won't redirect to /home)
    signInWithGithub("http://localhost:3000/home")
      .then((response) => {
        console.log("SUCCESS: ", response);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="button block"
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Login using github</span>}
          </button>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSignout();
            }}
            className={"button block"}
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
