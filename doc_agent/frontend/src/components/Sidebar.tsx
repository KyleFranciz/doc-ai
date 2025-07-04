import { IconType } from "react-icons/lib";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { BsChatLeftFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../api/ChatFetcher";
import { motion } from "motion/react";
import { useSidebar } from "../context/SidebarContext";
import { User } from "@supabase/supabase-js";

// interface for the Sidebar Icons and Selectors
interface SidebarInterface {
  Icon: IconType;
  Text: string;
  link: string;
  keys: number;
}

// Sidebar User interface for user Prop passed in
interface SidebarUserInterface {
  user: User | null
}

const SidebarMapper: SidebarInterface[] = [
  {
    Icon: BsChatLeftFill,
    Text: "New Chat",
    link: "/prompt",
    keys: 1,
  },
  {
    Icon: FaSearch,
    Text: "Find Chat",
    link: "/settings",
    keys: 2,
  },
];


//TODO: Only make the chats show when the user is logged in
//TODO: Make useEffect to wrap the get user status function

export default function Sidebar({ user }: SidebarUserInterface) {
  // create state to keep track of the navbar
  const { isSidebarOpen, toggleSidebar } = useSidebar();


  // api fetch for all the chats in the database
  const { data, isLoading, error } = useQuery({
    queryFn: () => fetchChats("user_tester"),
    queryKey: ["chats"],
  });

  // function to get the current state of the user (might just pass down as prop)

  return (
    <motion.nav
      initial={{ x: -300 }}
      transition={{ x: { type: "spring", damping: 40, stiffness: 350 } }}
      animate={{ x: isSidebarOpen ? 0 : -300 }}
      className="absolute flex flex-col z-1 w-[300px] bg-[#101010] h-full"
    >
      <div className=" h-[40px] flex justify-between items-center pt-2 px-2.5">
        {/*Logo for the top half of the sidebar */}
        <Link to={"/"}>
          <FaHome size={25} />
        </Link>
        <button className="hover:cursor-pointer" onClick={toggleSidebar}>
          {isSidebarOpen ? <TbLayoutSidebarLeftCollapse size={25} /> : <></>}
        </button>
      </div>
      <ul className="mt-6">
        {/*Has the selector for the chat section of the sidebar*/}
        {SidebarMapper.map((items) => (
          <li key={items.keys}>
            <Link
              to={items.link}
              className="mx-2 px-2 flex items-center h-[45px] hover:bg-[#1d1d1d] rounded-[8px] "
            >
              <div className="mr-2">{<items.Icon size={20} />}</div>
              <p>{items.Text}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/*TODO: Only show once chat if the username is the same as the user_id in the param*/}

      {/*Section that has all the chats from the DB */}
      <div className="mt-5 w-full cursor-pointer">
        <div>
          <h3 className="px-2 mx-2 mb-2 font-light text-xs">Recent</h3>
        </div>
        <div>
          {error && (
            <div className="mx-2 px-2 flex items-center h-[45px] rounded-[8px] bg-[#1d1d1d]">
              {/*TODO: Change the error message to a better message for the UI*/}
              {error.message}
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="mx-2 px-2 flex items-center h-[45px] rounded-[8px] bg-[#1d1d1d]">
            loading...
          </div>
        ) : (
          <div>
            {data?.data?.chat?.map((chats) => (
              <div className="hover:bg-[#1d1d1d] mx-2 h-[45px] px-2 flex items-center rounded-[8px]">
                <Link to={`/chat/${chats.session_id}`}>{chats.title}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/*Settings Section*/}
      <div className="">
        <Link
          to={"/settings"}
          className="mx-2 absolute w-[284px] bottom-3 px-2 flex items-center h-[45px] w-[100px] hover:bg-[#1d1d1d] rounded-[8px]"
        >
          <IoMdSettings size={25} className="mr-2" />
          Settings
        </Link>
      </div>
    </motion.nav>
  );
}
