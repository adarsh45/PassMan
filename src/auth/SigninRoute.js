import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./helper/authCalls";

const SigninRoute = ({ component: C, ...props }) => {
  return (
    <Route
      {...props}
      render={(routeProps) =>
        !isAuthenticated() ? <C {...routeProps} /> : <Redirect to="/home" />
      }
    />
  );
};

export default SigninRoute;
