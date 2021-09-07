import { supabase } from "../../client";

// TODO: see this : supabase.auth.user()

export const isAuthenticated = () => {
  if (localStorage.getItem("passmanuser")) {
    return JSON.parse(localStorage.getItem("passmanuser"));
  } else return false;
};

export const signInWithGithub = async (redirectUrl) => {
  const promise = new Promise((resolve, reject) => {
    supabase.auth
      .signIn(
        {
          provider: "github",
        },
        {
          redirectTo: redirectUrl,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export const signout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  else localStorage.removeItem("passmanuser");
};
