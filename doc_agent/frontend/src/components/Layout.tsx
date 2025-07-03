import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  // get the current location
  const location = useLocation(); // get the location

  // check the current location to see if it includes the chat page
  const isChatPage = location.pathname.includes("/chat/"); // get the location of the chat page

  //styles for the chatPage
  const style = isChatPage
    ? " w-full max-w-full"
    : "flex justify-center items-center";

  return (
    <>
      {/*This div controls the styling for the rest of the app */}
      <div className=" bg-[#303030] text-white overflow-x-hidden  ">
        {/*Sidebar goes here to handle the navigation through the prompts */}
        <div>
          {/*Navbar mainly just has the user logo for now */}
          {/* Might add an app logo later on */}
          <Navbar />
          <Sidebar />
          {
            <div
              className={`max-h-lvh h-screen ${style} bg-[#171717] overflow-x-hidden scrollbar-transparent`}
            >
              {/*Switch this part for the different pages*/}
              <Outlet />
            </div>
          }
        </div>
      </div>
    </>
  );
}
