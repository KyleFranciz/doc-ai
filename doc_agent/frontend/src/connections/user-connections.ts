// setting up the user sign in and sign out functionality
import { toast } from "sonner";
import { supabase } from "./supabaseClient"; // brought in to use Supabase for auth
import { validatePassword } from "../functions/passwordValidator"; // brought in to validate the password

// function to sign up the user
export const signUpSupabase = async (email: string, password: string) => {
  try {
    // check the users password for validity
    const checkedPassword = validatePassword(password);

    // check if the password is valid
    if (checkedPassword) {
      toast.error(checkedPassword);
      return; // return if the password is not valid
    }

    // continue otherwise
    const { data, error } = await supabase.auth.signUp({
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
    if (error) {
      toast.error("Sign up failed. Please try again.");
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
