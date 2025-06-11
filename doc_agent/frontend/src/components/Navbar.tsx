import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router";

// Adjust the navbar if the user is signed in or not

export default function Navbar() {
  return (
    <nav className="fixed right-0 w-full bg-[#171717] ">
      <ul className="flex justify-between items-center mx-6 h-[55px]">
        <div className="flex items-center justify-between w-full">
          <IoMdMenu size={30} />
          <div className="flex items-center justify-between w-[172px]">
            <Link
              to={"/login"}
              className="px-4 py-1 text-black text-[15px] bg-white rounded-2xl font-semibold hover:bg-[#c4c4c4]"
            >
              Log in
            </Link>
            <Link
              to={"/signup"}
              className="rounded-2xl font-semibold border-[0.5px] py-1 px-4 text-[15px] hover:bg-[#282828] hover:border-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </ul>
    </nav>
  );
}
