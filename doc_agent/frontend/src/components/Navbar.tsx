import { IconType } from "react-icons/lib";
import { IoMdMenu } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";

//interface for the items that will be in the nav
interface NavInterface {
  icon: IconType; // make into a react component
}

//TODO : WORK ON THE CHANGING THE ICONS TO THE PROPER ONES IN THE NAVBAR

const NavbarMapper: NavInterface[] = [
  //todo: change the message icon
  { icon: IoMdMenu },
  //todo: change the logo icon when the logo from the user login is setup
  { icon: FaRegUserCircle },
];

export default function Navbar() {
  return (
    <nav className="fixed right-0 w-full bg-[#303030] ">
      <ul className="flex justify-between items-center mx-6 h-[55px]">
        {NavbarMapper.map((item, idx) => (
          <div key={idx} className="hover:cursor-pointer">
            <item.icon size={32} />
          </div>
        ))}
      </ul>
    </nav>
  );
}
