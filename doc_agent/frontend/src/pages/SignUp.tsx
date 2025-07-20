import { useState } from "react";
import SignupBox from "../components/SignupComponent";
import { signUpSupabase } from "../connections/user-connections"; // custom function
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function SignUpPage() {
  // state to hold the email and password input values (passed down to component SignupBox)
  const [email, setEmail] = useState<string>(""); // handle email
  const [password, setPassword] = useState<string>(""); // handle password
  const [signUpActive, setSignUpActive] = useState<boolean>(false); // to show the success or failure message

  // set up navigate
  const navigate = useNavigate();

  // function that will handle all the sign up logic
  const handleSubmit = async (e: React.FormEvent) => {
    // todo: rework the signUp logic here, call the signUpSupabase function and handle the success or failure
    e.preventDefault(); // prevent form from submitting normally ( I make the form submit how I want)

    //try to sign up with the custom func I made
    try {
      setSignUpActive(true); // set signup status as active

      // send the request to supabase to sign up the user (
      // function handles validating the users info before sending
      // )
      const success = await signUpSupabase(email, password); // call the signUpSupabase function to sign up the user

      // if sign up is successful, navigate to the main page and clear the input fields
      if (success) {
        setEmail(""); // clear the email input
        setPassword(""); // clear the password input
        navigate("/"); // navigate to the user back to the main page
      } else {
        navigate("/login"); // navigate the user to the login page
      }
    } catch (signUpError) {
      // display error message if sign up fails
      toast.error(`Failed to sign up: ${signUpError}`);
    } finally {
      setSignUpActive(false); // set signup status as inactive to handle the loading state
      setEmail(""); // reset email input
      setPassword(""); // reset password input
    }
    // call the signUp function with the email and password
  };

  return (
    <div>
      <SignupBox
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        signUpActive={signUpActive}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
