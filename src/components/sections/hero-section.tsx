import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-pets.jpg";

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Pets felizes em um evento" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
            <span className="gradient-text">PETs DAY</span>
            <br />
            <span className="text-foreground">
              O maior encontro de pets da cidade!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
            Junte-se a nós para um dia inesquecível de diversão, atividades e muito amor. 
            <span className="text-secondary font-medium"> Inscrições abertas!</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-6 hover-lift animate-bounce-gentle"
            >
              <Link to="/cadastro">
                Inscreva-se Agora
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 hover-lift"
              onClick={() => scrollToSection('sobre')}
            >
              Saiba Mais
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-heading font-bold text-primary">500+</div>
              <div className="text-muted-foreground font-body">Pets Esperados</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-heading font-bold text-secondary">20+</div>
              <div className="text-muted-foreground font-body">Atividades</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-heading font-bold text-accent">15+</div>
              <div className="text-muted-foreground font-body">Parceiros</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-primary/10 rounded-full animate-float" />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}