import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[var(--osu-gray-2)] bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="h-1 w-full bg-[var(--osu-gradient)]" />

      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-heading-3 no-underline">Dr Affef Najjari</Link>

        <nav className="flex items-center gap-2 text-body">
          {[
            { href: "#", label: "Dashboard" },
            { href: "#", label: "Calendar" },
            { href: "#", label: "Settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="no-underline rounded-md px-2 py-1
                         hover:bg-white/15 focus-visible:bg-white/20
                         outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/signin"
          className="no-underline rounded-md px-3 py-1.5
                     bg-white/10 hover:bg-white/20 focus-visible:bg-white/25
                     outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          SignIn
        </Link>
      </div>
    </header>
  );
}
