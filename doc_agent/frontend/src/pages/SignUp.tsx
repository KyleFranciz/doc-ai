import { useState } from "react";
import SignupBox from "../components/SignupComponent";
import { signUpSupabase } from "@/connections/user-connections"; // custom function
import { toast } from "sonner";

export default function SignUpPage() {
  // state to hold the email and password input values (passed down to component SignupBox)
  const [email, setEmail] = useState<string>(""); // handle email
  const [password, setPassword] = useState<string>(""); // handle password
  const [signUpActive, setSignUpActive] = useState<boolean>(false); // to show the success or failure message

  // function that will handle all the sign up logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form from submitting normally ( I make the form submit how I want)

    try {
      setSignUpActive(true); // set signup status as active

      await signUpSupabase(email, password); // call the signUpSupabase function to sign up the user
    } catch (signUpError) {
      // display error message if sign up fails
      toast.error(`Failed to sign up: ${signUpError}`);
    } finally {
      setSignUpActive(false); // set signup status as inactive
      // todo: route the user to the home page or some other page after successful sign up
    }
    // call the signUp function with the email and password
  };

  return (
    <div>
      <SignupBox />
    </div>
  );
}
