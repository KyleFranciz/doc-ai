//interface for the items that will be in the nav
interface NavInterface {
  Icon: string;
}

const NavbarMapper: NavInterface[] = [
  { Icon: "message icon" },
  { Icon: "settings icon" },
];

export default function Navbar() {
  return (
    <nav>
      <ul>
        {NavbarMapper.map((item) => (
          <div>{item.Icon}</div>
        ))}
      </ul>
    </nav>
  );
}
