import { Link } from "react-router";
import "../main.css";
import { SignOutSupabase } from "../connections/user-connections";

export default function MainPage() {
  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="text-white">
          This page will introduce the user to the application
        </h1>
      </div>
      <div className="bg-[#272727] p-2 rounded-[5px] ml-2 font-semibold">
        <Link to={"/prompt"}>(Link to the prompt page)</Link>
      </div>
      <button
        className="px-4 py-1 text-black text-[15px] border-[0.5px] bg-white rounded-2xl font-semibold cursor-pointer hover:bg-[#c4c4c4]"
        onClick={SignOutSupabase}
      >
        Sign Out
      </button>
    </>
  );
}
