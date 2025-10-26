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
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Admissions", href: "/admissions" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-r from-primary via-primary to-[#166FE5] text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">
              University of Tunis El Manar
            </h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              A leading multidisciplinary institution dedicated to excellence in
              education, research, and innovation across sciences, engineering,
              and medicine.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 text-sm"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary-foreground" />
                <p className="text-primary-foreground/80">
                  Campus Universitaire El Manar, 2092 El Manar, Tunis
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary-foreground" />
                <a
                  href="tel:+21671872600"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +216 71 872 600
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary-foreground" />
                <a
                  href="mailto:info@utm.rnu.tn"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  info@utm.rnu.tn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-foreground mb-4">
            Our Location
          </h3>
          <div className="rounded-xl overflow-hidden border border-border/20 shadow-lg h-64 md:h-80">
            <iframe
              title="University Location Map"
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
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <p>
            © {currentYear} University of Tunis El Manar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
