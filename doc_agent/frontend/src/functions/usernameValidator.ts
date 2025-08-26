// this file is for validating the username that get created by users

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
export const validateUsername = (
  username: string,
  // returns isValid: boolean and message: string
): { isValid: boolean; message: string } => {
  // check if the username has profanity
  if (profanity.exists(username)) {
    return {
      isValid: false,
      message: "Username contains inappropriate language.",
    };
  }
  // check if the username contains symbols
  if (hasSymbols(username)) {
    return { isValid: false, message: "Username should not contain symbols." };
  }
  // otherwise, the username is valid and can be used
  return { isValid: true, message: "Username is valid." };
};
