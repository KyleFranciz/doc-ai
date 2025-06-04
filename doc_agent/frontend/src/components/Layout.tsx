import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  // get current location of the page that the user is on
  const location = useLocation();

  // check if the user is on the ChatPage
  const isChatPage = location.pathname.includes("/chat/");

  return (
    <>
      {/*This div controls the styling for the rest of the app */}
      <div className=" h-screen bg-[#303030] text-white  ">
        {/*Sidebar goes here to handle the navigation through the prompts */}
        <div>
          {/*Navbar mainly just has the user logo for now */}
          {/* Might add an app logo later on */}
          <Navbar />
          {isChatPage ? (
            <div className="h-[calc(100vh-60px)] w-full">
              {/*Switch this part for the different pages*/}
              <Outlet />
            </div>
          ) : (
            <div className="h-[calc(100vh-60px)] flex justify-center items-center">
              <div className="w-full max-w-lg max-h-lvh">
                {/*Switch this part for the different pages*/}
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
