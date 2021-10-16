import { useEffect } from "react";
import { supabase } from "../../client";

const getUserData = (userData) => {
  return {
    id: userData.id,
    email: userData.email,
    fullname: userData.user_metadata?.full_name,
    username: userData.user_metadata.user_name,
  };
};

// readymade provider to be called at parent level(Routes.js)
export const AuthProvider = () => {
  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange((evt, session) => {
      console.log("SESSION: ", session);
      session && session.user
        ? localStorage.setItem(
            "passmanuser",
            JSON.stringify(getUserData(session.user))
          )
        : localStorage.removeItem("passmanuser");
      // session && session.user && history.push("/home");
    });
    return () => unsubscribe();
  }, []);
  return <></>;
};
