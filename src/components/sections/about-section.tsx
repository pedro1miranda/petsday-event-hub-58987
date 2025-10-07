import { Heart, Calendar, MapPin, Users } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: Heart,
      title: "Amor pelos Pets",
      description: "Celebramos a conexão especial entre tutores e seus companheiros"
    },
    {
      icon: Calendar,
      title: "Evento Único",
      description: "Um dia inteiro dedicado à diversão e bem-estar dos nossos pets"
    },
    {
      icon: MapPin,
      title: "Localização Central",
      description: "Fácil acesso para toda a família pet da região"
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com outros tutores que amam seus pets"
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Sobre o <span className="gradient-text">PETs DAY</span>
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
              O PETs DAY é mais que um evento - é uma celebração do amor incondicional 
              que nossos pets nos oferecem todos os dias. Nossa missão é criar um espaço 
              onde pets e tutores possam se divertir, aprender e se conectar em um 
              ambiente seguro e acolhedor.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group text-center space-y-4 p-6 rounded-xl bg-card hover:bg-card/80 transition-all duration-300 hover-lift"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Nossa Missão
            </h3>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              Promover o bem-estar animal, fortalecer os laços entre pets e tutores, 
              e criar uma comunidade unida pelo amor aos animais. Cada PETs DAY é 
              pensado com carinho para oferecer momentos inesquecíveis para toda a família pet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}