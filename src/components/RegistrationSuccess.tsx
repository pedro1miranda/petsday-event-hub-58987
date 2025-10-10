import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Hash, MessageCircle } from "lucide-react";

interface RegistrationSuccessProps {
  tutorName: string;
  petName: string;
  luckyNumber: number;
  whatsappLink: string;
}

export function RegistrationSuccess({ 
  tutorName, 
  petName, 
  luckyNumber, 
  whatsappLink 
}: RegistrationSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl gradient-text">
            Inscrição Realizada com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg">
              Olá, <span className="font-bold text-primary">{tutorName}</span>!
            </p>
            <p className="text-muted-foreground">
              {petName} está oficialmente inscrito(a) no evento PETs Day!
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Hash className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Seu Número da Sorte
              </span>
            </div>
            <div className="text-6xl font-bold gradient-text">
              {String(luckyNumber).padStart(6, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Guarde este número! Ele será usado para o sorteio no dia do evento.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Entre no grupo do WhatsApp para ficar por dentro de todas as novidades do evento!
            </p>
            <Button
              asChild
              className="w-full hover-lift"
              size="lg"
            >
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Entrar no Grupo do WhatsApp
              </a>
            </Button>
          </div>

          <div className="text-center pt-4">
            <Button
              asChild
              variant="outline"
            >
              <a href="/">Voltar ao Início</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
