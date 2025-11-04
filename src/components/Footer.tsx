import {
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { Icon: Youtube, label: "YouTube", href: "https://youtube.com" },
    { Icon: Github, label: "GitHub", href: "https://github.com" },
  ];

  const quickLinks = [
    { label: "À propos", href: "/about" },
    { label: "Formations", href: "/programs" },
    { label: "Admissions", href: "/admissions" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-to-r from-primary via-primary to-[#166FE5] text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12 pb-safe">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-10">
          {/* About Section */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-lg font-semibold text-primary-foreground">
              Université de Tunis El Manar
            </h3>
            <p className="text-primary-foreground/80 text-xs sm:text-sm leading-relaxed text-balance">
              Une institution multidisciplinaire de premier plan dédiée à
              l'excellence en enseignement, recherche et innovation dans les
              sciences, l'ingénierie et la médecine.
            </p>
            <div className="flex gap-3 pt-1 justify-center md:justify-start">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
                >
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-lg font-semibold text-primary-foreground">
              Liens rapides
            </h3>
            <ul className="space-y-1.5 inline-block text-left">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 text-xs sm:text-sm"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-lg font-semibold text-primary-foreground">
              Contact
            </h3>
            <div className="space-y-2 text-xs sm:text-sm inline-block text-left">
              <div className="flex gap-2 items-start justify-center md:justify-start">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary-foreground" />
                <p className="text-primary-foreground/80 text-balance">
                  Campus Universitaire El Manar, 2092 El Manar, Tunis
                </p>
              </div>
              <div className="flex gap-2 items-center justify-center md:justify-start">
                <Phone className="w-4 h-4 shrink-0 text-primary-foreground" />
                <a
                  href="tel:+21671872600"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +216 71 872 600
                </a>
              </div>
              <div className="flex gap-2 items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 shrink-0 text-primary-foreground" />
                <a
                  href="mailto:info@utm.rnu.tn"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors break-all"
                >
                  info@utm.rnu.tn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8 text-center md:text-left">
          <h3 className="text-lg font-semibold text-primary-foreground mb-3">
            Notre localisation
          </h3>
          <div className="rounded-xl overflow-hidden border border-border/20 shadow-lg h-48 md:h-80 mx-auto md:mx-0 max-w-md">
            <iframe
              title="Carte de localisation de l’université"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Campus%20Universitaire%20El%20Manar%2C%202092%20El%20Manar%2C%20Tunis&output=embed"
              allowFullScreen
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20"></div>

        {/* Bottom Section */}
        <div className="pt-6 flex flex-col sm:flex-row justify-center md:justify-between items-center gap-3 text-xs sm:text-sm text-primary-foreground/80">
          <p>
            © {currentYear} Université de Tunis El Manar. Tous droits réservés.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Politique de confidentialité
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
