import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import React from "react";

// interface for the sign up info being passed between components
interface SignUpBox {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  signUpActive?: boolean;

}
export default function SignupBox(props: SignUpBox) {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className=" w-[450px] h-[500px] bg-[#181818] rounded-lg shadow-xl p-8 outline-[0.5px] border-white">
        <form className="space-y-6" onSubmit={props.handleSubmit}>
          {/*Tittle for the signup box */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Sign up for your account
            </h1>
            <p className="text-gray-300 text-sm">
              Enter your email for your new account
            </p>
          </div>
          {/*Input fields for the email and password*/}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="youremail@example.com"
                className="w-full px-3 mb-2 py-2 bg-[#292929] outline-[0.5px] border-gray-300 rounded-md placeholder:text-white  placeholder:opacity-35 text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                onChange={(e) => props.setEmail(e.target.value)}
                required // required to submit the form
                value={props.email}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">
                  Password
                </label>
                <Link
                  to="/"
                  className="text-sm text-white hover:text-gray-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 bg-[#292929] outline-[0.5px] border-gray-300 rounded-md text-white placeholder:text-white placeholder:opacity-35 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                onChange={(e) => props.setPassword(e.target.value)}
                required // required to submit the form
                value={props.password}
              />
            </div>
            {/*Submit button for the signup form*/}
            <div className="space-y-3 pt-4">
              <button
                className="w-full mb-4 bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black"
                type="submit"
              >
                Sign up
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center b-2 bg-[#292929] hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md outline-[0.5px] border-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="px-2">
                  <FaGoogle />
                </span>
                Sign up with Google
              </button>
            </div>
            {/* Link to the login page */}
            <div className="flex justify-center items-center">
              Already have an account?{" "}
              <span className="ml-2 underline">
                <Link to="/login">Login</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
