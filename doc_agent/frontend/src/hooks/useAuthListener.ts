// this file is going to be used to route the user when certain auth events happen
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // might not use navigate, might just refresh page
import { supabase } from "../connections/supabaseClient";
import { toast } from "sonner";

export const useAuthListener = () => {
  // Initialize the navigate variable to help with routing
  const navigate = useNavigate();

  // use useEffect to help with reloading when the auth state changes
  useEffect(() => {
    // create the listener for the auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth change Event: ${event}, Session:${session}`);

        // use switch case to handle the auth state switching
        switch (event) {
          case "SIGNED_IN":
            // alert the user they're signed in
            toast.success("You are successfully signed in");
            // navigate to the prompt page
            navigate("/prompt");
            // stop the listener
            break;

          case "SIGNED_OUT":
            // alert the user they're signed out
            toast.success("you are successfully signed out");
            // navigate to the home page
            navigate("/");
            break;

          case "INITIAL_SESSION":
            if (session) {
              // let the user know that they are already signed in
              toast.success("Welcome back");
              // navigate straight to the prompt page
              navigate("/prompt");
            } else {
              // take the user to the initial page if they aren't signed in already
              navigate("/");
            }
            // stop the function from running after so it doesn't keep running
            break;
        }
      }
    );
    // stop the listener from running after so it doesn't keep running
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);
};
