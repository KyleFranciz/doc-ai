import { IoMenu } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { FaRegUserCircle } from "react-icons/fa";

//interface for the items that will be in the nav
interface NavInterface {
  icon: IconType; // make image also possible if the user is signed in
}

//TODO : add the chat session to the navbar if the user is on the chat page

const NavbarMapper: NavInterface[] = [
  //todo: change the message icon
  { icon: IoMenu },
  //todo: change the logo icon when the logo from the user login is setup
  { icon: FaRegUserCircle },
];

export default function Navbar() {
  return (
    <nav className="absolute top-4 right-0 w-full">
      <ul className="flex justify-between mx-6">
        {NavbarMapper.map((item, idx) => (
          <div key={idx}>{<item.icon size={"30px"} />}</div>
        ))}
      </ul>
    </nav>
  );
}
