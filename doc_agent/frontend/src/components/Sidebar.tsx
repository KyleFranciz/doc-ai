import { IconType } from "react-icons/lib";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { BsChatLeftFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useMutation } from "@tanstack/react-query"; add back once the mutation is set up
import { fetchChats } from "../api/ChatFetcher";
import { motion } from "motion/react";
import { useSidebar } from "../context/SidebarContext";
import { User } from "@supabase/supabase-js";
import { MdClear } from "react-icons/md";
import { deleteChat } from "../api/ChatDeleters.ts";
import { toast } from "sonner";

// interface for the Sidebar Icons and Selectors
interface SidebarInterface {
  Icon: IconType;
  Text: string;
  link: string;
  keys: number;
}

// Sidebar User interface for user Prop passed in
interface SidebarUserInterface {
  user: User | null;
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

// TODO: SET UP MUTATION FOR TO REFRESH ALL THE CHATS THAT THE USER HAS WHEN A NEW CHAT IS CREATED

export default function Sidebar({ user }: SidebarUserInterface) {
  // get the query client to handle the queries and mutations, help sidebar refetch
  const queryClient = useQueryClient();

  // create state to keep track of the navbar
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  /*TODO: make fetch function that checks sessionID in the parameter
   * if it is detected make the chatbar refetch the again*/
  // api fetch for all the chats in the database
  const { data, isLoading, error } = useQuery({
    // The users chats are loaded into the sidebar so that they can see their chat history
    queryFn: () => fetchChats(),
    queryKey: ["chats"], // key is an array of chats
    // refetchInterval: 10000, // refetch the chats every 10 seconds (might not use)
    refetchOnWindowFocus: true, // refetches when the window changes
  });

  // mutation function to refresh the chats when chat deleted
  const { mutateAsync: deletedChatMutation } = useMutation({
    // function to delete the chat session
    mutationFn: deleteChat,
    // fire after successful deletion of the chat
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  return (
    <motion.nav
      initial={{ x: -300 }}
      transition={{ x: { type: "spring", damping: 40, stiffness: 350 } }}
      animate={{ x: isSidebarOpen ? 0 : -300 }}
      className="absolute flex flex-col z-2 w-[300px] bg-[#101010] h-full"
    >
      <div className=" h-[40px] flex justify-between items-center pt-2 px-2.5">
        {/*Logo for the top half of the sidebar */}
        <Link to={"/"}>
          <FaHome size={30} />
        </Link>
        <button className="hover:cursor-pointer" onClick={toggleSidebar}>
          {isSidebarOpen ? <TbLayoutSidebarLeftCollapse size={30} /> : <></>}
        </button>
      </div>
      <ul className="mt-6">
        {/*Has NEW CHAT and FIND CHAT buttons to select those options */}
        {SidebarMapper.map((items) => (
          <Link
            key={items.keys}
            to={items.link}
            className="mx-2 px-2 flex items-center h-[45px] hover:bg-[#1d1d1d] rounded-[8px] "
          >
            <div className="mr-2">{<items.Icon size={20} />}</div>
            <p>{items.Text}</p>
          </Link>
        ))}
      </ul>

      {/*NOTE: Conversation Section */}
      {/*RECENT CHATS ARE BELLOW*/}
      {/*Section that has all the chats from the DB */}
      {user ? (
        <div className="mt-5 h-full w-full scrollbar-transparent overflow-y-scroll cursor-pointer">
          <div className="">
            <h3 className="px-2 mx-2 mb-2 font-light text-xs">Conversations</h3>
          </div>
          <div>
            {/* if there is an error getting the chats from the DB */}
            {error && (
              <div className="mx-2 px-2 flex items-center h-[45px] rounded-[8px] bg-[#1d1d1d]">
                {`Failed to load chats: ${error.message}`}
              </div>
            )}
          </div>
          {/* TODO: make a loading animation to display when fetching the chats from the DB */}
          {isLoading ? (
            <div className="mx-2 px-2 flex items-center h-[45px] rounded-[8px] bg-[#1d1d1d]">
              loading...
            </div>
          ) : (
            <div className="h-[710px]">
              {data?.data?.chat?.map((chats) => (
                <Link
                  className="group hover:bg-[#1d1d1d] mx-2 h-[45px] px-2 flex items-center rounded-[8px]"
                  to={`/chat/${chats.session_id}`}
                  key={chats.session_id}
                >
                  {chats.title}
                  <div className="ml-auto hidden group-hover:block">
                    <MdClear
                      size={20}
                      // Mutation function to delete the chat session from the sidebar
                      // Await the deletion of the chat from the sidebar
                      onClick={async () => {
                        try {
                          await deletedChatMutation(chats.session_id);
                        } catch (error) {
                          // let the user know if there is an error
                          toast.error(
                            `Message failed to delete properly ${error}`,
                          );
                        }
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {/*SETTINGS SECTION*/}
      {user ? (
        <div className="bg-[#101010] w-auto flex justify-center items-center h-[80px]">
          <Link
            to={"/settings"}
            className="mx-2 mb-1 w-[284px] absolute bottom-0 bg-[#101010] px-2 flex items-center h-[55px] hover:bg-[#1d1d1d] rounded-[8px]"
          >
            <IoMdSettings size={25} className="mr-2" />
            Settings
          </Link>
        </div>
      ) : (
        <></>
      )}
    </motion.nav>
  );
}
