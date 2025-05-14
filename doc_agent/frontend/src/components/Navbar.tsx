//interface for the items that will be in the nav
interface NavInterface {
  icon: string;
}

const NavbarMapper: NavInterface[] = [
  //todo: change the message icon
  { icon: "message icon" },
  //todo: change the logo icon when the logo from the user login is setup
  { icon: "user icon" },
];

export default function Navbar() {
  return (
    <nav className="absolute top-4 right-0 w-full">
      <ul className="flex justify-between mx-6">
        {NavbarMapper.map((item) => (
          <div>{item.icon}</div>
        ))}
      </ul>
    </nav>
  );
}
