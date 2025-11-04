import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Syringe, Users, Megaphone, Gift, Trophy, Sparkles } from "lucide-react";
import heroImage from "@/assets/quem-somos-hero.jpg";
import vacinaImage from "@/assets/vacina.jpg";
import passeataImage from "@/assets/passeata.jpg";
import palestrasImage from "@/assets/palestras.jpg";
import brindesImage from "@/assets/brindes.jpg";
import sorteioImage from "@/assets/sorteio.jpg";
import gincanasImage from "@/assets/gincanas.jpg";

interface Activity {
  id: string;
  icon: any;
  title: string;
  description: string;
  details: string;
  image: string;
  highlighted?: boolean;
}

export default function QuemSomosPage() {
  const activities: Activity[] = [
    {
      id: "vacina",
      icon: Syringe,
      title: "Vacina Comunitária",
      description: "Vacinação gratuita e segura para deixar seu pet protegido.",
      details: "Oferecemos vacinação antirrábica gratuita durante todo o evento. Nossa equipe de veterinários qualificados estará à disposição para garantir a saúde do seu pet. Traga a carteira de vacinação para registro.",
      image: vacinaImage,
    },
    {
      id: "passeata",
      icon: Users,
      title: "Passeata Pet",
      description: "Encontro e caminhada pelo parque — traga coleira e água para seu pet.",
      details: "Uma caminhada coletiva pelo parque com todos os participantes e seus pets. O encontro será às 9h na entrada principal. Recomendamos trazer coleira resistente, saquinhos de higiene e água fresca para seu companheiro.",
      image: passeataImage,
    },
    {
      id: "palestras",
      icon: Megaphone,
      title: "Palestras",
      description: "Palestras com especialistas em comportamento e saúde animal.",
      details: "Durante o dia, teremos palestras educativas sobre cuidados, nutrição, adestramento e bem-estar animal. Palestrantes renomados compartilharão dicas valiosas para você cuidar melhor do seu pet.",
      image: palestrasImage,
    },
    {
      id: "brindes",
      icon: Gift,
      title: "Brindes",
      description: "Distribuição de kits e brindes para os participantes.",
      details: "Todos os participantes receberão kits especiais com produtos para pets, incluindo petiscos, brinquedos e amostras de produtos de higiene. Os pontos de distribuição estarão sinalizados durante todo o evento.",
      image: brindesImage,
    },
    {
      id: "sorteio",
      icon: Sparkles,
      title: "Grande Sorteio",
      description: "Grande sorteio com prêmios especiais — participe!",
      details: "O grande destaque do evento! Ao se inscrever, você receberá automaticamente um número da sorte único. Concorrerá a prêmios incríveis como cestas de produtos, sessões de banho e tosa gratuitas, consultas veterinárias e muito mais. Quanto mais pets cadastrar, mais chances de ganhar!",
      image: sorteioImage,
      highlighted: true,
    },
    {
      id: "gincanas",
      icon: Trophy,
      title: "Gincanas",
      description: "Atividades lúdicas e divertidas para pets e tutores, com premiações.",
      details: "Competições amigáveis e divertidas para pets de todas as idades e portes. Desafios de agilidade, melhor fantasia, pet mais fotogênico e muito mais. Haverá premiações para os vencedores de cada categoria!",
      image: gincanasImage,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-background">
                PETs Day — Dog no Park
              </h1>
              <p className="text-xl md:text-2xl text-background/90 font-body leading-relaxed">
                Um dia para cuidar, aprender e celebrar nossos companheiros de quatro patas
              </p>
              <Button asChild size="lg" className="hover-lift text-lg px-8 py-6">
                <Link to="/cadastro">
                  Inscreva seu pet
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  Atividades do <span className="gradient-text">Evento</span>
                </h2>
                <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
                  Um dia completo de cuidados, diversão e aprendizado para você e seu pet
                </p>
              </div>

              {/* Activity Cards */}
              <div className="space-y-12">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    id={activity.id}
                    className={`group relative bg-card rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:border-primary/20 hover-lift ${
                      activity.highlighted ? 'border-primary shadow-lg' : 'border-border'
                    }`}
                  >
                    {activity.highlighted && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-background px-4 py-2 text-sm font-semibold">
                          Destaque
                        </Badge>
                      </div>
                    )}
                    
                    <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              activity.highlighted 
                                ? 'bg-gradient-to-br from-primary to-secondary' 
                                : 'bg-gradient-to-br from-primary/10 to-secondary/10'
                            }`}>
                              <activity.icon className={`w-8 h-8 ${
                                activity.highlighted ? 'text-background' : 'text-primary'
                              }`} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                              {activity.title}
                            </h3>
                          </div>
                          
                          <p className="text-lg text-muted-foreground font-body leading-relaxed">
                            {activity.description}
                          </p>
                          
                          <p className="text-base text-muted-foreground/90 font-body leading-relaxed">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`relative h-64 md:h-auto ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                        <img 
                          src={activity.image}
                          alt={activity.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  Galeria do <span className="gradient-text">Evento</span>
                </h2>
                <p className="text-lg text-muted-foreground font-body">
                  Momentos especiais que tornam o PETs Day inesquecível
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <div 
                    key={`gallery-${activity.id}`}
                    className="group relative aspect-video rounded-xl overflow-hidden hover-lift cursor-pointer"
                  >
                    <img 
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-background font-heading font-semibold text-lg">
                          {activity.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Pronto para participar?
              </h2>
              <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
                Inscreva seu pet agora e garanta sua participação no maior evento pet da cidade! 
                Não perca a chance de participar do grande sorteio e aproveitar um dia incrível 
                ao lado do seu melhor amigo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="hover-lift">
                  <Link to="/cadastro">
                    Fazer inscrição
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover-lift">
                  <a href="#sorteio">
                    Saiba mais sobre o sorteio
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
