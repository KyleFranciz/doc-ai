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
      return; // return if the password is not valid
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
    }
    // handle any errors during sign in
    if (signUpError) {
      toast.error(`Sign up failed ${signUpError.message}. Please try again.`);
      return;
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
      return;
    }

    //if the sign in is successful, show a success message
    if (data) {
      toast.success(`You are signed in`);
    }
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
      return; // stop the function if the user is signed in
      // if there is no session, show a message that the user is not signed in
    } else {
      toast.info("You are not currently signed in");
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
  }
};
