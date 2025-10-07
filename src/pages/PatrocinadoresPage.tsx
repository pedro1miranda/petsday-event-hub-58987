import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Award, Medal, Trophy } from "lucide-react";
import sponsor1 from "@/assets/sponsor-1.png";
import sponsor2 from "@/assets/sponsor-2.png";
import sponsor3 from "@/assets/sponsor-3.png";
import sponsor4 from "@/assets/sponsor-4.png";

export default function PatrocinadoresPage() {
  const sponsors = {
    diamante: [
      {
        name: "VetCare Center",
        logo: sponsor2,
        website: "https://vetcare.com.br",
        social: "@vetcarecenter",
        description: "Clínica veterinária de referência com mais de 20 anos cuidando da saúde dos seus pets.",
        location: "São Paulo, SP"
      },
      {
        name: "Petshop Premium",
        logo: sponsor1,
        website: "https://petshoppremium.com.br",
        social: "@petshoppremium",
        description: "Produtos premium e acessórios exclusivos para o bem-estar do seu companheiro.",
        location: "São Paulo, SP"
      }
    ],
    ouro: [
      {
        name: "Grooming Paradise",
        logo: sponsor3,
        website: "https://groomingparadise.com.br",
        social: "@groomingparadise",
        description: "Salão de beleza especializado em pets com tratamentos exclusivos.",
        location: "São Paulo, SP"
      },
      {
        name: "NutriPet Foods",
        logo: sponsor4,
        website: "https://nutripet.com.br",
        social: "@nutripetfoods",
        description: "Alimentação natural e balanceada para uma vida saudável do seu pet.",
        location: "São Paulo, SP"
      }
    ],
    prata: [
      {
        name: "Pet Walker SP",
        logo: sponsor1,
        website: "#",
        social: "@petwalkersp",
        description: "Passeadores profissionais para manter seu pet ativo e feliz.",
        location: "São Paulo, SP"
      },
      {
        name: "Adote um Amigo",
        logo: sponsor2,
        website: "#",
        social: "@adoteumamigosp",
        description: "ONG dedicada ao resgate e adoção responsável de animais.",
        location: "São Paulo, SP"
      },
      {
        name: "Pet Care 24h",
        logo: sponsor3,
        website: "#",
        social: "@petcare24h",
        description: "Atendimento veterinário de emergência 24 horas.",
        location: "São Paulo, SP"
      }
    ],
    bronze: [
      {
        name: "Brinquedos & Cia",
        logo: sponsor4,
        website: "#",
        social: "@brinquedosecia"
      },
      {
        name: "Pet Taxi Express",
        logo: sponsor1,
        website: "#",
        social: "@pettaxiexpress"
      },
      {
        name: "Casinhas & Camas",
        logo: sponsor2,
        website: "#",
        social: "@casinhascamas"
      },
      {
        name: "Pet Photo Studio",
        logo: sponsor3,
        website: "#",
        social: "@petphotostudio"
      },
      {
        name: "Dogueria Gourmet",
        logo: sponsor4,
        website: "#",
        social: "@dogueriagourmet"
      },
      {
        name: "Veterinária Amigos",
        logo: sponsor1,
        website: "#",
        social: "@vetamigos"
      }
    ]
  };

  const categoryConfig = {
    diamante: {
      title: "Patrocinadores Diamante",
      icon: Crown,
      color: "from-blue-500 to-purple-600",
      description: "Nossos principais parceiros que tornam o PETs DAY possível"
    },
    ouro: {
      title: "Patrocinadores Ouro",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      description: "Parceiros de excelência que apoiam nossa missão"
    },
    prata: {
      title: "Patrocinadores Prata",
      icon: Award,
      color: "from-gray-400 to-gray-600",
      description: "Empresas comprometidas com o bem-estar animal"
    },
    bronze: {
      title: "Patrocinadores Bronze",
      icon: Medal,
      color: "from-amber-600 to-amber-800",
      description: "Parceiros locais que fazem a diferença"
    }
  };

  const SponsorCard = ({ sponsor, category }: { sponsor: any, category: keyof typeof sponsors }) => {
    const isDetailed = category === 'diamante' || category === 'ouro' || category === 'prata';
    
    if (category === 'bronze') {
      return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover-lift">
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-background rounded-lg p-2 flex items-center justify-center border">
              <img 
                src={sponsor.logo} 
                alt={sponsor.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h4 className="text-sm font-heading font-medium text-foreground">
              {sponsor.name}
            </h4>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover-lift">
        <CardContent className={`p-6 ${category === 'diamante' ? 'space-y-6' : 'space-y-4'}`}>
          <div className={`${category === 'diamante' ? 'w-32 h-32' : 'w-24 h-24'} mx-auto bg-background rounded-xl p-4 flex items-center justify-center border-2`}>
            <img 
              src={sponsor.logo} 
              alt={sponsor.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h4 className={`${category === 'diamante' ? 'text-xl' : 'text-lg'} font-heading font-semibold text-foreground`}>
              {sponsor.name}
            </h4>
            
            {sponsor.description && (
              <p className="text-sm text-muted-foreground font-body">
                {sponsor.description}
              </p>
            )}
            
            {sponsor.location && (
              <p className="text-xs text-muted-foreground">
                📍 {sponsor.location}
              </p>
            )}
          </div>

          {(sponsor.website !== "#" || sponsor.social) && (
            <div className="flex justify-center space-x-3">
              {sponsor.website !== "#" && (
                <Button variant="outline" size="sm" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Site
                </Button>
              )}
              {sponsor.social && (
                <Button variant="outline" size="sm" className="text-xs">
                  📱 {sponsor.social}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Patrocinadores Oficiais do <span className="gradient-text">PETs DAY</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
              Conheça as empresas e organizações que acreditam na nossa missão e 
              tornam este evento especial possível para toda a comunidade pet.
            </p>
          </div>

          {/* Sponsors by Category */}
          <div className="space-y-16">
            {Object.entries(sponsors).map(([category, sponsorList]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const IconComponent = config.icon;
              
              return (
                <section key={category} className="space-y-8">
                  {/* Category Header */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-heading font-bold text-foreground">
                        {config.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground font-body">
                      {config.description}
                    </p>
                    <div className={`w-24 h-1 bg-gradient-to-r ${config.color} mx-auto rounded-full`} />
                  </div>

                  {/* Sponsors Grid */}
                  <div className={`
                    grid gap-6
                    ${category === 'diamante' 
                      ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                      : category === 'ouro' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto'
                      : category === 'prata'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                    }
                  `}>
                    {sponsorList.map((sponsor, index) => (
                      <SponsorCard 
                        key={index} 
                        sponsor={sponsor} 
                        category={category as keyof typeof sponsors}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center space-y-8">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                Quer ser nosso parceiro?
              </h3>
              <p className="text-muted-foreground font-body mb-6">
                Junte-se a nós nesta missão de promover o bem-estar animal e 
                fortalecer a comunidade pet da nossa cidade.
              </p>
              <Button size="lg" className="hover-lift">
                Entre em Contato
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}