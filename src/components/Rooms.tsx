import { Atom, Microscope, Calculator } from "lucide-react";

type Room = {
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const rooms: Room[] = [
  { name: "Science", Icon: Atom },
  { name: "Biology", Icon: Microscope },
  { name: "Math", Icon: Calculator },
];

export default function Rooms() {
  return (
    <div className="flex flex-col gap-3">
      {rooms.map(({ name, Icon }) => (
        <div
          key={name}
          className="flex items-center gap-3 rounded border border-black/10 dark:border-white/15 bg-white dark:bg-gray-900 px-3 py-2"
        >
          <Icon className="w-5 h-5" />
          <span className="text-body">{name}</span>
        </div>
      ))}
    </div>
  );
}


