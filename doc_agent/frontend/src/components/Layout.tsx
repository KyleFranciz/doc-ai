import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <div>
        <Sidebar />
        <div>
          <Navbar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
