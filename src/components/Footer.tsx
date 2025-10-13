import { Facebook, Instagram, Github, Chrome, Info, Linkedin, Twitter, Youtube, Dribbble, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.145] bg-gray-800 text-white">
      <div className="mx-auto max-w-6xl px-6 py-6 text-body-small md:text-body relative">
        <div className="md:flex md:flex-row gap-6 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            <a href="/about" className="hover:underline underline-offset-4">About</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Facebook className="w-4 h-4" />
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Facebook</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Instagram className="w-4 h-4" />
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Instagram</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Github className="w-4 h-4" />
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">GitHub</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Chrome className="w-4 h-4" />
            <a href="https://google.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Google</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Linkedin className="w-4 h-4" />
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">LinkedIn</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Twitter className="w-4 h-4" />
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Twitter</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Youtube className="w-4 h-4" />
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">YouTube</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Dribbble className="w-4 h-4" />
            <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Dribbble</a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:hello@example.com" className="hover:underline underline-offset-4">Contact</a>
          </div>
          </div>
          <div className="hidden md:block md:w-80 md:shrink-0">
            <div className="text-body md:text-body-large font-semibold mb-2 text-center md:text-left text-gray-200">Location</div>
            <div className="text-body text-gray-300 md:text-body-large mb-2 text-center md:text-left">
              Campus Universitaire El Manar, 2092 El Manar, Tunis
            </div>
            <div className="rounded-md overflow-hidden border border-white/20 shadow-sm">
              <iframe
                title="Scheduler Location Map"
                className="w-full h-48 min-h-[200px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Campus%20Universitaire%20El%20Manar%2C%202092%20El%20Manar%2C%20Tunis&output=embed"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <span className="block mt-4 text-center sm:text-left md:absolute md:bottom-6 md:right-6">© {new Date().getFullYear()} Scheduler</span>
      </div>
    </footer>
  );
}


