import { ArrowRight, BookOpen, Users, Award, Microscope } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                Établie en 2000 • Tunis, Tunisie
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                Faculté des Sciences
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                À l&rsquo;avant-garde de la connaissance scientifique et de
                l&rsquo;innovation en Afrique du Nord, grâce à
                l&rsquo;excellence en recherche, en enseignement et en
                engagement communautaire.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  Découvrir les formations <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
            <div className="relative h-96 bg-linear-to-br from-secondary to-muted rounded-2xl border border-border flex items-center justify-center">
              <div className="text-center">
                <Microscope className="w-24 h-24 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Image principale (placeholder)
                </p>
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
              <p className="text-muted-foreground">
                Image du campus (placeholder)
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                À propos de notre université
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fondée en 2000, l’Université de Tunis El Manar est une
                  institution multidisciplinaire de premier plan dédiée à
                  l’avancement des connaissances scientifiques et au
                  développement de l&rsquo;innovation à travers l&rsquo;Afrique
                  du Nord.
                </p>
                <p>
                  Notre Faculté des Sciences est reconnue internationalement
                  pour son excellence dans les sciences fondamentales, les
                  sciences de l’ingénieur, les sciences médicales et
                  l’informatique. Nous nous engageons à offrir une formation de
                  classe mondiale et à mener des recherches de pointe qui
                  répondent aux défis mondiaux.
                </p>
                <p>
                  Avec une communauté diversifiée de chercheurs, d’enseignants
                  et d’étudiants, nous créons un environnement où la curiosité
                  intellectuelle prospère et où des découvertes transformatrices
                  sont réalisées.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <div className="text-2xl font-bold text-primary">
                    + de 2 000
                  </div>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary border border-border">
                  <div className="text-2xl font-bold text-primary">
                    + de 500
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enseignants-chercheurs
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
              Formations académiques
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des programmes complets conçus pour former des leaders et des
              innovateurs en sciences et technologies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Sciences fondamentales",
                desc: "Mathématiques, Physique, Chimie, Biologie",
              },
              {
                icon: Microscope,
                title: "Sciences de l’ingénieur",
                desc: "Génie civil, Électrique, Mécanique",
              },
              {
                icon: Users,
                title: "Sciences médicales",
                desc: "Médecine, Pharmacie, Sciences de la santé",
              },
              {
                icon: Award,
                title: "Informatique",
                desc: "Informatique, Technologies de l’information",
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
              Reconnaissance & Réalisations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reconnue mondialement pour nos contributions à la science et à
              l’éducation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Classements internationaux",
                desc: "Classée parmi les meilleures universités en Mathématiques, Chimie et Informatique",
              },
              {
                title: "Excellence en recherche",
                desc: "Recherche de pointe en santé publique, sciences agricoles et ingénierie",
              },
              {
                title: "Partenariats mondiaux",
                desc: "Collaborations avec des institutions prestigieuses à travers le monde",
              },
              {
                title: "Pôle d’innovation",
                desc: "Promotion de l’entrepreneuriat et de l’innovation technologique",
              },
              {
                title: "Impact sociétal",
                desc: "Au service de la société grâce à la recherche appliquée et aux programmes de sensibilisation",
              },
              {
                title: "Succès des diplômés",
                desc: "Diplômés leaders dans l’enseignement, l’industrie et le service public",
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
            Rejoignez notre communauté
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Faites partie d’une communauté académique dynamique, dédiée à
            l’excellence, à l’innovation et à l’impact positif dans le monde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity">
              Postuler maintenant
            </button>
            <button className="px-8 py-3 border-2 border-primary-foreground rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors">
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
