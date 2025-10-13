import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartyPopper, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface RegistrationSuccessProps {
  tutorName: string;
  petNames: string[];
  luckyNumbers: number[];
  whatsappLink: string;
}

export function RegistrationSuccess({
  tutorName,
  petNames,
  luckyNumbers,
  whatsappLink,
}: RegistrationSuccessProps) {
  return (
    <Card className="border-2 border-secondary">
      <CardContent className="p-12 text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
            <PartyPopper className="w-12 h-12 text-secondary" />
          </div>

          <h2 className="text-3xl font-heading font-bold text-foreground">
            Inscrição realizada com <span className="gradient-text">sucesso!</span>
          </h2>

          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Parabéns! Você e seu(s) pet(s) estão oficialmente inscritos no PETs DAY.
          </p>
        </div>

        {/* Lucky Numbers */}
        <div className="bg-muted/50 rounded-xl p-6 max-w-md mx-auto space-y-4">
          <h3 className="font-heading font-semibold text-foreground">
            Seus Números da Sorte 🍀
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tutor:</span>
              <span className="font-medium">{tutorName}</span>
            </div>
            
            {petNames.map((petName, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground">{petName}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {String(luckyNumbers[index]).padStart(6, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="space-y-4">
          <Button 
            asChild 
            size="lg"
            className="hover-lift bg-gradient-to-r from-primary to-secondary"
          >
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Entrar no Grupo do WhatsApp
            </a>
          </Button>

          <p className="text-sm text-muted-foreground">
            Não perca as novidades do evento! Entre no grupo para ficar por dentro de tudo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild variant="outline" className="hover-lift">
            <Link to="/">Voltar ao Início</Link>
          </Button>
          <Button asChild variant="outline" className="hover-lift">
            <Link to="/patrocinadores">Conhecer Parceiros</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
