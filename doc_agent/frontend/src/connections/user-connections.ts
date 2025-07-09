// setting up the user sign in and sign out functionality
import { toast } from "sonner";
import { supabase } from "./supabaseClient"; // brought in to use Supabase for auth
import { validatePassword } from "../functions/passwordValidator"; // brought in to validate the passwordValidator

export type AuthCheckerEvents = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED"; // going to add update user function later on

//^ function to sign up the user
export const signUpSupabase = async (email: string, password: string) => {
  try {
    // check the users password to make sure that it meets the requirements
    const checkedPassword = validatePassword(password);

    //if the password is not valid, show an error message and exit the function
    if (checkedPassword) {
      toast.error(checkedPassword);
      return false; // return if the password is not valid and leave the function
    }

    // Proceed directly with signup
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "/prompt", // redirect to dashboard after the user signs up for the first time
      },
    });

    // check if there's an error when signing up the user
    if (signUpError) {
      if (
        signUpError.message.includes("already registered") ||
        signUpError.message.includes("already exists")
      ) {
        toast.error(
          "An account with this email already exists. Please sign in instead."
        );
      } else {
        toast.error(`Sign up failed: ${signUpError.message}`);
      }
      return false;
    }

    // Handle successful signup response
    if (data.user) {
      // ^ The most reliable way to check for an existing user after a signUp call
      // is to check the `identities` array. If it's empty, the user already existed.
      if (data.user.identities && data.user.identities.length === 0) {
        // This is an existing user who was just signed in.
        // We must sign them out and show the correct error.
        await supabase.auth.signOut();
        toast.error(
          "An account with this email already exists. Please sign in instead."
        );
        return false;
      }

      // If we reach here, it's a genuinely new user.
      // For security, we should sign them out to force them to go through the
      // email verification flow.
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.auth.signOut();
      }

      // Show the appropriate verification message for a new user.
      toast.success(
        "Please check your email to verify your account before signing in."
      );
      return true;
    }

    toast.error("Sign up error: Unknown error occurred");
    return false;
  } catch (tryError) {
    toast.error(`Sign up error: ${tryError}`);
    return false;
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
      // Handle specific error cases for better UX
      if (signInError.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else if (signInError.message.includes("Email not confirmed")) {
        toast.error(
          "Please check your email and confirm your account before signing in."
        );
      } else if (signInError.message.includes("Too many requests")) {
        toast.error(
          "Too many sign-in attempts. Please wait a moment and try again."
        );
      } else {
        toast.error(`Sign in failed: ${signInError.message}`);
      }
      //exit the function if the sign in fails
      return false;
    }

    //if the user data was found, show a success message
    if (data.user) {
      toast.success(`You are signed in `);
      return true;
    }

    toast.error("Sign in failed: user cannot be found");
    return false;
    // if there was a problem with the sign in process, show an error message
  } catch (tryError) {
    toast.error(`There was a problem signing in: ${tryError} `);
    return false;
  }
};

//^ sign out function for the user
export const SignOutSupabase = async () => {
  //try to sign out the user
  try {
    const { error: signOutError } = await supabase.auth.signOut();

    // if there was an error during the sign out process, show an error message
    if (signOutError) {
      toast.error(`Sign out failed: ${signOutError.message}`);
      return false;
    }

    toast.success("You have successfully signed out");
    return true;
  } catch (error) {
    toast.error(`There was an error when signing out ${error}`);
    return false;
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
      toast.success(`You are currently have a session and are signed in `);
      return session; // stop the function if the user is signed in
      // if there is no session, show a message that the user is not signed in
    } else {
      toast.info("You currently have no session and are not signed in");
      return null; // return null if the user is not signed in
    }
  } catch (sessionFetchError) {
    toast.error(`Failed to fetch user session: ${sessionFetchError}`);
    return null;
  }
};

//^ function to handle getting the user information
export const getSupabaseUser = async () => {
  try {
    // try to get the user data from the DB
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      toast.error(`Failed to get user data: ${error.message}`);
      // exit the function
      return null;
    }

    if (!user) {
      toast.error(`There was no user data found`); // todo: take this part out in production
      // exit the function
      return null;
    }

    // return the user out the function id found
    return user;
  } catch (error) {
    toast.error(`Failed to get user from the database: ${error}`);
    return null; // exit the function
  }
};
