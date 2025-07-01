import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useSidebar } from "../context/SidebarContext";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import {
  getSupabaseUser,
  SignOutSupabase,
} from "../connections/user-connections";
import { useEffect, useState } from "react";

// todo: Adjust the navbar if the user is signed in or not

export default function Navbar() {
  // use navigate hook for the routing
  const navigate = useNavigate();

  // handle the toggle for the sidebar
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // when the user is logged only show the sign out button and user info
  useEffect(() => {
    const NavbarUserStyling = async () => {
      // check if the user is logged in
      const User = await getSupabaseUser();

      if (User) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };
    NavbarUserStyling();
  }, []);

  return (
    <nav className="fixed right-0 w-full bg-[#171717] ">
      <ul className="flex justify-between items-center mx-6 h-[55px]">
        <div className="flex items-center justify-between w-full">
          {/*Sidebar button */}
          <motion.button
            className="hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={toggleSidebar}
          >
            {!isSidebarOpen ? <TbLayoutSidebarLeftExpand size={30} /> : <></>}
          </motion.button>
          {loggedIn ? (
            //? Sign Out button for the user
            <div>
              <motion.button
                onTap={() => SignOutSupabase()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-1 text-black text-[15px] border-[0.5px] bg-white rounded-2xl font-semibold cursor-pointer hover:bg-[#c4c4c4]"
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            //? Log In and Sign Up buttons for non-logged in users
            <div className="flex items-center justify-between w-[176px]">
              <motion.button
                onTap={() => navigate("/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-1 text-black text-[15px] border-[0.5px] bg-white rounded-2xl font-semibold cursor-pointer hover:bg-[#c4c4c4]"
              >
                <div className="">Log in</div>
              </motion.button>
              <motion.button
                onTap={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.8 }}
                className="rounded-2xl font-semibold border-[0.5px] py-1 px-4 text-[15px] cursor-pointer hover:bg-[#282828] hover:border-white"
              >
                <div>Sign Up</div>
              </motion.button>
            </div>
          )}
        </div>
      </ul>
    </nav>
  );
}
