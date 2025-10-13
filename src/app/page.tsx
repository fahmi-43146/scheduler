import Rooms from "@/components/Rooms";
import Scheduler from "@/components/Scheduler";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6">
      <div className="bg-white dark:bg-gray-900 p-4 md:flex-1">
        <h2 className="text-heading-2 mb-4 text-center">Rooms</h2>
        <div className="flex flex-col items-start">
          <Rooms />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 text-center md:flex-[5]">
        <h2 className="text-heading-2 mb-4">Scheduler</h2>
        <Scheduler />
      </div>
    </div>
  );
}
