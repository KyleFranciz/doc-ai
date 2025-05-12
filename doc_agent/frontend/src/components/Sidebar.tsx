interface SidebarInterface {
  Icon: string;
  Text: string;
}

const SidebarMapper: SidebarInterface[] = [
  {
    Icon: "Prompt Icon",
    Text: "prompt",
  },
  {
    Icon: "Settings Icon",
    Text: "settings",
  },
];

export default function Sidebar() {
  return (
    <nav>
      <ul>
        {SidebarMapper.map((items) => (
          <div>
            <li>{items.Icon}</li>
            <li>{items.Text}</li>
          </div>
        ))}
      </ul>
    </nav>
  );
}
