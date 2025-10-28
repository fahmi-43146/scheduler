import { ArrowRight, BookOpen, Users, Award, Microscope } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation 
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                UT
              </div>
              <span className="text-lg font-semibold">
                University of Tunis El Manar
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a
                href="#about"
                className="text-sm hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="#programs"
                className="text-sm hover:text-primary transition-colors"
              >
                Programs
              </a>
              <a
                href="#achievements"
                className="text-sm hover:text-primary transition-colors"
              >
                Achievements
              </a>
            </div>
          </div>
        </div>
      </nav>*/}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                Est. 2000 • Tunis, Tunisia
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Faculty of Sciences
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Leading the advancement of scientific knowledge and innovation
                in North Africa through excellence in research, education, and
                community engagement.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  Explore Programs <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative h-96 bg-linear-to-br from-secondary to-muted rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center">
                <Microscope className="w-24 h-24 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Hero Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-b border-border py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 bg-linear-to-br from-secondary to-muted rounded-2xl border border-border flex items-center justify-center">
              <p className="text-muted-foreground">Campus Image Placeholder</p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About Our University
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2000, the University of Tunis El Manar stands as a
                  premier multidisciplinary institution dedicated to advancing
                  scientific knowledge and fostering innovation across North
                  Africa.
                </p>
                <p>
                  Our Faculty of Sciences is recognized internationally for
                  excellence in fundamental sciences, engineering sciences,
                  medical sciences, and computer sciences. We are committed to
                  providing world-class education and conducting cutting-edge
                  research that addresses global challenges.
                </p>
                <p>
                  With a diverse community of scholars, researchers, and
                  students, we create an environment where intellectual
                  curiosity thrives and transformative discoveries are made.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <div className="text-2xl font-bold text-primary">2000+</div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <p className="text-sm text-muted-foreground">
                    Faculty Members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="border-b border-border py-20 md:py-32 bg-secondary/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Academic Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive programs designed to develop leaders and innovators
              in science and technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Fundamental Sciences",
                desc: "Mathematics, Physics, Chemistry, Biology",
              },
              {
                icon: Microscope,
                title: "Engineering Sciences",
                desc: "Civil, Electrical, Mechanical Engineering",
              },
              {
                icon: Users,
                title: "Medical Sciences",
                desc: "Medicine, Pharmacy, Health Sciences",
              },
              {
                icon: Award,
                title: "Computer Sciences",
                desc: "Computer Science, Information Technology",
              },
            ].map((program, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border bg-background hover:border-primary transition-colors group"
              >
                <program.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">{program.title}</h3>
                <p className="text-sm text-muted-foreground">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section
        id="achievements"
        className="border-b border-border py-20 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recognition & Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recognized globally for our contributions to science and education
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "International Rankings",
                desc: "Ranked among top universities in Mathematics, Chemistry, and Computer Science",
              },
              {
                title: "Research Excellence",
                desc: "Leading research in Public Health, Agricultural Sciences, and Engineering",
              },
              {
                title: "Global Partnerships",
                desc: "Collaborations with prestigious institutions worldwide",
              },
              {
                title: "Innovation Hub",
                desc: "Fostering entrepreneurship and technological innovation",
              },
              {
                title: "Community Impact",
                desc: "Serving society through applied research and outreach programs",
              },
              {
                title: "Student Success",
                desc: "Graduates leading in academia, industry, and public service",
              },
            ].map((achievement, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <Award className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of a vibrant academic community dedicated to excellence,
            innovation, and making a difference in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity">
              Apply Now
            </button>
            <button className="px-8 py-3 border-2 border-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer 
      <footer className="border-t border-border bg-secondary/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">University</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Admissions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Academics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Research</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Research Centers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Publications
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Collaborations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    News
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Alumni
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tunis, Tunisia</li>
                <li>
                  <a
                    href="mailto:info@utm.tn"
                    className="hover:text-foreground transition-colors"
                  >
                    info@utm.tn
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+216"
                    className="hover:text-foreground transition-colors"
                  >
                    +216 (0) XX XXX XXX
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 University of Tunis El Manar. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>*/}
    </main>
  );
}
