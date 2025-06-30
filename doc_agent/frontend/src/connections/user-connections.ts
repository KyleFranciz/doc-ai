// setting up the user sign in and sign out functionality
import { toast } from "sonner";
import { supabase } from "./supabaseClient"; // brought in to use Supabase for auth
import { validatePassword } from "../functions/passwordValidator"; // brought in to validate the password

export type AuthCheckerEvents = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED"; // going to add update user function later on

//^ function to sign up the user
export const signUpSupabase = async (email: string, password: string) => {
  try {
    // check the users password to make sure that it meets the requirements
    const checkedPassword = validatePassword(password);

    // if the password is not valid, show an error message and exit the function
    if (checkedPassword) {
      toast.error(checkedPassword);
      return false; // return if the password is not valid
    }

    // continue otherwise
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      // options: {
      // emailRedirectTo: "/dashboard", // redirect to dashboard after the user signs up for the first time
      // },
    });
    // handle the successful sign up
    if (data) {
      toast.success("You have successfully signed up!");
      return true;
    }
    // handle any errors during sign in
    if (signUpError) {
      toast.error(`Sign up failed ${signUpError.message}. Please try again.`);
      return false;
    }
  } catch (tryError) {
    console.error(tryError);
  }
};

//^ function to sign in the user
export const signInSupabase = async (email: string, password: string) => {
  try {
    // try to sign in the user
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password }
    );

    // show if there was an error during the sign in process
    if (signInError) {
      toast.error(`Sign in failed: ${signInError.message}`);
      //exit the function if the sign in fails
      return false;
    }

    //if the user data was found, show a success message
    if (data.user) {
      toast.success(`You are signed in`);
      return true;
    }

    toast.error("Sign in failed: user cannot be found");
    return false;
    // if there was a problem with the sign in process, show an error message
  } catch (tryError) {
    toast.error(`There was a problem signing in: ${tryError} `);
  }
};

//^ sign out function for the user
export const SignOutSupabase = async () => {
  //try to sign out the user
  const { error: signOutError } = await supabase.auth.signOut();

  // if there was an error during the sign out process, show an error message
  if (signOutError) {
    toast.error(`Sign out failed: ${signOutError.message}`);
  }
  toast.success("You have successfully signed out");
};

//^ function to check the user session and if they are signed in currently (might handle this in the main app component)
export const getUserSession = async () => {
  try {
    // get the current user session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // if there is a session, show a success message with the user's email for validation
    if (session) {
      toast.success(`You are currently have a session and are signed in`);
      return session; // stop the function if the user is signed in
      // if there is no session, show a message that the user is not signed in
    } else {
      toast.info("You currently have no session and are not signed in");
      return; // stop the function if the user is not signed in
    }
  } catch (sessionFetchError) {
    toast.error(`Failed to fetch user session: ${sessionFetchError}`);
  }
};

//^ function to check the users current Auth state and handle the the different situations
export const handleAuthState = (event: AuthCheckerEvents) => {
  switch (event) {
    case "SIGNED_IN":
      return toast.success(`You are now signed in`);
      break;
    case "SIGNED_OUT":
      return toast.info(`You are now signed out`);
      break;
    case "TOKEN_REFRESHED":
      return toast.success(`Your session token has been refreshed`);
      break;
  }
};
