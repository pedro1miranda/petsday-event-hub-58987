import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import sponsor1 from "@/assets/sponsor-1.png";
import sponsor2 from "@/assets/sponsor-2.png";
import sponsor3 from "@/assets/sponsor-3.png";
import sponsor4 from "@/assets/sponsor-4.png";

export function SponsorsSection() {
  const diamondSponsors = [
    { name: "VetCare Center", logo: sponsor2, website: "#" },
    { name: "Petshop Premium", logo: sponsor1, website: "#" }
  ];

  const goldSponsors = [
    { name: "Grooming Paradise", logo: sponsor3, website: "#" },
    { name: "NutriPet Foods", logo: sponsor4, website: "#" }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Nossos <span className="gradient-text">Parceiros</span>
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Empresas que acreditam na nossa missão e tornam o PETs DAY possível
            </p>
          </div>

          {/* Diamond Sponsors */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Parceiros Diamante
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {diamondSponsors.map((sponsor, index) => (
                <div 
                  key={index}
                  className="group bg-card rounded-xl p-8 hover:bg-card/80 transition-all duration-300 hover-lift"
                >
                  <div className="w-32 h-32 mx-auto mb-4 bg-background rounded-lg p-4 flex items-center justify-center">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h4 className="text-xl font-heading font-semibold text-foreground">
                    {sponsor.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Parceiros Ouro
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-8 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {goldSponsors.map((sponsor, index) => (
                <div 
                  key={index}
                  className="group bg-card rounded-lg p-6 hover:bg-card/80 transition-all duration-300 hover-lift"
                >
                  <div className="w-20 h-20 mx-auto mb-3 bg-background rounded-lg p-3 flex items-center justify-center">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-heading font-medium text-foreground text-center">
                    {sponsor.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
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