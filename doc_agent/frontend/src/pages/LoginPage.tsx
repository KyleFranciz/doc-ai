import React, { useState } from "react";
import LoginBox from "../components/LoginComponent";
import { signInSupabase } from "../connections/user-connections";
import { useNavigate } from "react-router";

export default function LoginPage() {
  // states to handle the login from the user
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signInActive, setSignInActive] = useState<boolean>(false);

  // set up navigate for the page navigation
  const navigate = useNavigate();

  // function to login the user
  const HandleLogin = async (e: React.FormEvent) => {
    setSignInActive(true);
    //prevent the default function of the form
    e.preventDefault();

    // sign the user in with my custom function
    const success = await signInSupabase(email, password); // handles all the error handling internally

    // if there is no success stop the function
    if (!success) {
      setEmail("");
      setPassword("");
      return;
    }

    // if the sign in was successful, clear the input fields and navigate to the main page
    if (success) {
      setEmail("");
      setPassword("");
      navigate("/prompt");
    }

    setSignInActive(false);
  };

  return (
    <div>
      <LoginBox
        setEmail={setEmail}
        setPassword={setPassword}
        signInActive={signInActive}
        handleLogin={HandleLogin}
      />
    </div>
  );
}
