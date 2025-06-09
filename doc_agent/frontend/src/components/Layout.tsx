import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

//import { useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation(); // get the location

  const isChatPage = location.pathname.includes("/chat/"); // get the location of the chat page

  //check if the current location is the chat page
  const style = isChatPage
    ? " w-full max-w-full"
    : "flex justify-center items-center";

  // TODO: If route is chat page then have the items center go away from styling
  return (
    <>
      {/*This div controls the styling for the rest of the app */}
      <div className=" bg-[#303030] text-white overflow-x-hidden  ">
        {/*Sidebar goes here to handle the navigation through the prompts */}
        <div>
          {/*Navbar mainly just has the user logo for now */}
          {/* Might add an app logo later on */}
          <Navbar />
          {
            <div className={`max-h-lvh h-screen ${style} bg-[#303030]`}>
              {/*Switch this part for the different pages*/}
              <Outlet />
            </div>
          }
        </div>
      </div>
    </>
  );
}
