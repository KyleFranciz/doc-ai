// this file is for validating the username that get created by users

import { supabase } from "@/connections/supabaseClient";
import { Profanity } from "@2toad/profanity"; // library for checking profanity

// initialize the profanity checker
const profanity = new Profanity();

// function to check if the username contains symbols
const hasSymbols = (username: string): boolean => {
  const symbolRegex = /[^a-zA-Z0-9]/;
  // returns true if the username contains symbols
  return symbolRegex.test(username);
};

// TODO: take out the message and just return true or false after the debugging is done
export const validateUsername = async (
  username: string,
  // returns isValid: boolean and message: string
): Promise<{ isValid: boolean; message: string }> => {
  try {
    // NOTE: start the req to the database to see if the username is already in use
    // checks the username in the database
    const usernameExists = supabase
      .from("profiles")
      .select("*")
      .eq("username", username);

    // NOTE: can make the code cleaner by combining the two checks below
    // check if the username has profanity
    if (profanity.exists(username)) {
      return {
        isValid: false,
        message: "Username contains inappropriate language.",
      };
    }
    // check if the username contains symbols
    if (hasSymbols(username)) {
      return {
        isValid: false,
        message: "Username should not contain symbols.",
      };
    }

    // start the fetch to see if the username is already in use
    const { data, error } = await usernameExists;

    // if there is an error, show an error message
    if (error) {
      return {
        isValid: false,
        message:
          "There was an error in the process of validating the username.",
      };
    }

    // if the username is already in use, show an error message
    if (data && data.length > 0) {
      return {
        isValid: false,
        message: "Username is already exists in the database.",
      };
    }

    // otherwise, the username is valid and can be used
    return { isValid: true, message: "Username is valid." };
  } catch (_error) {
    return {
      isValid: false,
      message: "There was an error validating the username.",
    };
  }
};
