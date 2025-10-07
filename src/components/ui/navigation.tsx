import { Link } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b", className)}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-heading font-bold gradient-text">
            PETs DAY
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/#sobre" 
            className="text-muted-foreground hover:text-primary transition-colors font-body"
          >
            Sobre
          </Link>
          <Link 
            to="/patrocinadores" 
            className="text-muted-foreground hover:text-primary transition-colors font-body"
          >
            Patrocinadores
          </Link>
          <Button asChild variant="default" className="hover-lift">
            <Link to="/cadastro">Inscreva-se</Link>
          </Button>
        </nav>

        {/* Mobile menu button - simplified for MVP */}
        <div className="md:hidden">
          <Button asChild variant="default" size="sm">
            <Link to="/cadastro">Inscreva-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}