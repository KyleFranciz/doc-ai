import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      {/*This div controls the styling for the rest of the app */}
      <div className=" w-screen h-screen bg-[#262626] text-white flex justify-center items-center ">
        {/*Sidebar goes here to handle the navigation through the prompts */}
        <div>
          {/*Navbar mainly just has the user logo for now */}
          {/* Might add an app logo later on */}
          <Navbar />
          <div className="w-full max-w-lg">
            {/*Switch this part for the different pages*/}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
