import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
  //const location = useLocation();

  // TODO: If route is chat page then have the items center go away from styling
  return (
    <>
      {/*This div controls the styling for the rest of the app */}
      <div className=" bg-[#303030] text-white  ">
        {/*Sidebar goes here to handle the navigation through the prompts */}
        <div>
          {/*Navbar mainly just has the user logo for now */}
          {/* Might add an app logo later on */}
          <Navbar />

          <div className="max-h-lvh h-screen bg-[#303030]">
            {/*Switch this part for the different pages*/}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
