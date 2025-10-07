import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold">
              PETs DAY
            </h3>
            <p className="text-background/80 font-body leading-relaxed">
              O maior encontro de pets da cidade. 
              Criando memórias especiais para você e seu companheiro.
            </p>
            <div className="flex items-center space-x-2 text-background/80">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-body">Feito com amor para pets</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">
              Contato
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span className="text-background/80 font-body">contato@petsday.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span className="text-background/80 font-body">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span className="text-background/80 font-body">São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">
              Redes Sociais
            </h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-background/60 font-body text-sm">
              Siga-nos para novidades e fotos fofas!
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 font-body text-sm">
            © 2024 PETs DAY. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}