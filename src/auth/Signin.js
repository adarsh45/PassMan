import { useState } from "react";
import { signInWithGithub } from "./helper/authCalls";
import { ReactComponent as IndianFarmer } from "../assets/indian_farmer.svg";

import "./signin.scss";
import { Col, Row } from "reactstrap";
import { FaGithub } from "react-icons/fa";

const Signin = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    signInWithGithub()
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
    <div className="signin-page">
      <h1 className="heading">
        Pass<span className="color-green">Man</span>
      </h1>

      <Row className="main-div">
        <Col md={8} className="welcome-div">
          <p className="welcome-text">
            Hey ! Having a hard time{" "}
            <span className="color-green">
              remembering all those passwords ?
            </span>
            <br />
            Sign in now &amp;{" "}
            <span className="color-green">free up your memory</span> from those
            lengthy passwords! <br />
            Completely <span className="color-green">
              secure, risk-free
            </span>{" "}
            &amp; easy-to-use!!!
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="signin-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Loading</span>
            ) : (
              <span>
                {" "}
                <FaGithub /> Continue with GitHub
              </span>
            )}
          </button>
        </Col>
        <Col md={4}>
          <IndianFarmer style={{ width: "auto", height: "22rem" }} />
        </Col>
      </Row>
    </div>
  );
};

export default Signin;
