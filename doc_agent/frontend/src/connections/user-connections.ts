// setting up the user sign in and sign out functionality
import { toast } from "sonner";
import { supabase } from "./supabaseClient"; // brought in to use Supabase for auth
import { validatePassword } from "../functions/passwordValidator"; // brought in to validate the password

// function to sign up the user
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

// sign out function for the user
export const SignOutSupabase = async () => {
  //try to sign out the user
  const { error: signOutError } = await supabase.auth.signOut();

  // if there was an error during the sign out process, show an error message
  if (signOutError) {
    toast.error(`Sign out failed: ${signOutError.message}`);
  }
};

// function to check the user session and if they are signed in currently (might handle this in the main app component)
