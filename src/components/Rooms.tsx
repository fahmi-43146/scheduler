import {
  Atom,
  Microscope,
  Calculator,
  FlaskConical,
  Dna,
  Telescope,
  Cpu,
  Mountain,
  Leaf,
  Bot,
} from "lucide-react";

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
    <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-x-visible w-full pb-2">
      {rooms.map(({ name, Icon, id }) => {
        const isActive = selectedRoomName === name;
        return (
          <button
            key={id || name}
            type="button"
            onClick={() => onSelect?.(name, id)}
            className={`flex items-center gap-3 rounded-md border px-3 py-2 transition-all text-left shadow-sm
              ${
                isActive
                  ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800"
              } focus-visible:ring-2 focus-visible:ring-orange-400 outline-none`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? "text-orange-600" : "text-orange-500"
              }`}
            />
            <span
              className={`text-sm font-medium truncate ${
                isActive
                  ? "text-orange-700 dark:text-orange-400"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
