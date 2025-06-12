import { IconType } from "react-icons/lib";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { BsChatLeftFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../api/ChatFetcher";

interface SidebarInterface {
  Icon: IconType;
  Text: string;
  link: string;
}

const SidebarMapper: SidebarInterface[] = [
  {
    Icon: BsChatLeftFill,
    Text: "New Chat",
    link: "/prompt",
  },
  {
    Icon: FaSearch,
    Text: "Find Chat",
    link: "/settings",
  },
];

export default function Sidebar() {
  // api fetch for all the chats in the database
  const { data, isPending, isError } = useQuery({
    queryFn: () => fetchChats("user_tester"),
    queryKey: ["chats"],
  });

  return (
    <nav className="absolute flex flex-col z-0] w-[300px] bg-[#101010] h-full">
      <div className=" h-[40px] flex justify-between items-center pt-2 px-2.5">
        <Link to={"/"}>
          <FaHome size={25} />
        </Link>
        <TbLayoutSidebarLeftCollapse size={25} />
      </div>
      <ul className="mt-6">
        {SidebarMapper.map((items) => (
          <Link
            to={items.link}
            className="mx-2 px-2 flex items-center h-[45px] hover:bg-[#1d1d1d] rounded-[8px] "
          >
            <li className="mr-2">{<items.Icon size={20} />}</li>
            <li>{items.Text}</li>
          </Link>
        ))}
      </ul>
      {/*Section for all the chats from the DB */}
      <div className="mt-5 w-full cursor-pointer">
        {data?.data.chat.map((chats) => (
          <div className="hover:bg-[#1d1d1d] mx-2 h-[45px] px-2 flex items-center rounded-[8px]">
            <Link to={`/chat/${chats.session_id}`}>{chats.title}</Link>
          </div>
        ))}
      </div>
      <div className="">
        <Link
          to={"/settings"}
          className="mx-2 absolute bottom-2 px-2 flex items-center h-[45px] hover:bg-[#1d1d1d] rounded-[8px]"
        >
          <IoMdSettings size={25} className="mr-2" />
          Settings
        </Link>
      </div>
    </nav>
  );
}
