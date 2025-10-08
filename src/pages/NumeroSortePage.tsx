import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, MessageCircle } from "lucide-react";

export default function NumeroSortePage() {
  // Simulando número da sorte - Em produção, virá do backend
  const numeroSorte = "PD-2025-1234";
  const linkWhatsApp = "https://chat.whatsapp.com/example";
  const nomePet = "Rex"; // Exemplo

  const handleWhatsAppClick = () => {
    window.open(linkWhatsApp, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-4">
                <Gift className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold">
                Número da <span className="gradient-text">Sorte</span>
              </h1>
              
              <p className="text-lg text-muted-foreground font-body max-w-xl mx-auto">
                Parabéns! Seu pet {nomePet} está inscrito no PETs DAY com direito a participar dos sorteios especiais.
              </p>
            </div>

            {/* Número da Sorte Card */}
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-xl font-heading">
                  Seu Número da Sorte
                </CardTitle>
                <CardDescription className="font-body">
                  Guarde este número para participar dos sorteios
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Número em destaque */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                  <div className="text-5xl md:text-6xl font-heading font-bold gradient-text tracking-wider">
                    {numeroSorte}
                  </div>
                </div>

                {/* Instruções */}
                <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                  <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Próximos Passos
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground font-body list-disc list-inside">
                    <li>Anote ou tire uma foto do seu número da sorte</li>
                    <li>Entre no grupo do WhatsApp para receber atualizações</li>
                    <li>Fique atento às datas e horários dos sorteios</li>
                    <li>Compareça ao evento com seu pet no dia marcado</li>
                  </ul>
                </div>

                {/* Botão WhatsApp */}
                <Button 
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="w-full hover-lift bg-[#25D366] hover:bg-[#20BD5A] text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Entrar no Grupo do WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-foreground">
                    Sobre os Sorteios
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground font-body">
                    <p>
                      Os sorteios acontecerão durante o evento PETs DAY, com diversos prêmios especiais
                      para você e seu pet.
                    </p>
                    <p>
                      Mantenha seu número da sorte em mãos e fique atento aos anúncios no grupo do WhatsApp
                      e durante o evento.
                    </p>
                    <p className="font-medium text-foreground">
                      Boa sorte! 🍀
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
