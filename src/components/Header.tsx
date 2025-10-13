export default function Header() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-heading-3">Scheduler</a>
        <nav className="flex items-center gap-6 text-body">
          <a href="#" className="hover:underline underline-offset-4">Dashboard</a>
          <a href="#" className="hover:underline underline-offset-4">Calendar</a>
          <a href="#" className="hover:underline underline-offset-4">Settings</a>
        </nav>
      </div>
    </header>
  );
}


