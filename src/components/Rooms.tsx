import { Atom, Microscope, Calculator, FlaskConical, Dna, Telescope, Cpu, Mountain, Leaf, Bot } from "lucide-react";

type Room = {
  id?: string;
  name: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const defaultRooms: Room[] = [
  { name: "Physics", Icon: Atom },
  { name: "Biology", Icon: Microscope },
  { name: "Mathematics", Icon: Calculator },
  { name: "Chemistry", Icon: FlaskConical },
  { name: "Genetics", Icon: Dna },
  { name: "Astronomy", Icon: Telescope },
  { name: "Computer Science", Icon: Cpu },
  { name: "Geology", Icon: Mountain },
  { name: "Ecology", Icon: Leaf },
  { name: "Robotics", Icon: Bot },
];

export default function Rooms({
  rooms = defaultRooms,
  selectedRoomName,
  onSelect,
}: {
  rooms?: Room[];
  selectedRoomName?: string;
  onSelect?: (roomName: string, roomId?: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {rooms.map(({ name, Icon, id }) => {
        const isActive = selectedRoomName === name;
        return (
          <button
            key={id || name}
            type="button"
            onClick={() => onSelect?.(name, id)}
            className={`flex items-center gap-3 rounded border px-3 py-2 text-left transition-colors ${
              isActive
                ? "border-orange-600 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/20"
                : "border-black/10 dark:border-white/15 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-orange-700" : "text-orange-600"}`} />
            <span className={`text-body ${isActive ? "text-orange-700" : "text-orange-600"}`}>{name}</span>
          </button>
        );
      })}
    </div>
  );
}


