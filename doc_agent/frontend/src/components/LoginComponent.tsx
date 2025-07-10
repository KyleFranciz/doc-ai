import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

// interface for the login box props that will be passed down
interface LoginBoxProps {
  // function to handle the login button click
  handleLogin: (e: React.FormEvent) => Promise<void>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  signInActive?: boolean;
}

// component for the login box

export default function LoginBox(props: LoginBoxProps) {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className=" w-[450px] h-[500px] bg-[#181818] rounded-lg shadow-xl p-8 outline-[0.5px] border-white">
        <form className="space-y-6" onSubmit={props.handleLogin}>
          {/*Tittle for the login box */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Login to your account
            </h1>
            <p className="text-gray-300 text-sm">
              Enter your email for your account
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
                required
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
                required
              />
            </div>
            {/*Submit button for the login form*/}
            <div className="space-y-3 pt-4">
              <button
                className="w-full mb-4 bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-md transition-colors hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black"
                type="submit"
              >
                Login
              </button>
              <button
                type="button"
                className="w-full flex justify-center items-center b-2 bg-[#292929] hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md outline-[0.5px] border-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="px-2">
                  <FaGoogle />
                </span>
                Login with Google
              </button>
            </div>
            {/* Link to the sign up page */}
            <div className="flex justify-center items-center">
              Don't have an account?{" "}
              <span className="ml-2 underline">
                <Link to="/signup">Sign up</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
