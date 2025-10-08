import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import sponsor1 from "@/assets/sponsor-1.png";
import sponsor2 from "@/assets/sponsor-2.png";
import sponsor3 from "@/assets/sponsor-3.png";
import sponsor4 from "@/assets/sponsor-4.png";

export function SponsorsSection() {
  const sponsors = [
    { 
      name: "VetCare Center", 
      logo: sponsor2, 
      description: "Clínica veterinária de referência com mais de 20 anos cuidando da saúde dos seus pets."
    },
    { 
      name: "Petshop Premium", 
      logo: sponsor1, 
      description: "Produtos premium e acessórios exclusivos para o bem-estar do seu companheiro."
    },
    { 
      name: "Grooming Paradise", 
      logo: sponsor3, 
      description: "Salão de beleza especializado em pets com tratamentos exclusivos."
    },
    { 
      name: "NutriPet Foods", 
      logo: sponsor4, 
      description: "Alimentação natural e balanceada para uma vida saudável do seu pet."
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Nossos <span className="gradient-text">Parceiros</span>
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Empresas que acreditam na nossa missão e tornam o PETs DAY possível
            </p>
          </div>

          {/* Sponsors Carousel */}
          <div className="max-w-4xl mx-auto px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {sponsors.map((sponsor, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6 space-y-4">
                        <div className="w-24 h-24 mx-auto bg-background rounded-lg p-3 flex items-center justify-center border">
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <h4 className="text-lg font-heading font-semibold text-foreground">
                            {sponsor.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-body">
                            {sponsor.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button asChild variant="outline" size="lg" className="hover-lift">
              <Link to="/patrocinadores">
                Veja todos os parceiros
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}