import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Heart, Ticket } from "lucide-react";
import { useState } from "react";

export default function BuscaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"tutor" | "pet" | "numero">("tutor");

  // Dados de exemplo - serão substituídos por dados reais do banco de dados
  const mockData = {
    tutores: [
      { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 98765-4321", pets: 2 },
      { id: 2, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 91234-5678", pets: 1 },
    ],
    pets: [
      { id: 1, nome: "Rex", tipo: "Cachorro", tutor: "João Silva", numeroSorte: "001234" },
      { id: 2, nome: "Mimi", tipo: "Gato", tutor: "Maria Santos", numeroSorte: "001235" },
    ]
  };

  const filteredTutores = mockData.tutores.filter(tutor => 
    tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPets = mockData.pets.filter(pet => 
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.numeroSorte.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Busca de <span className="gradient-text">Participantes</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Encontre tutores, pets ou números da sorte cadastrados no evento
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Pesquisar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Type Selector */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={searchType === "tutor" ? "default" : "outline"}
                    onClick={() => setSearchType("tutor")}
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Tutor</span>
                  </Button>
                  <Button
                    variant={searchType === "pet" ? "default" : "outline"}
                    onClick={() => setSearchType("pet")}
                    className="flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Pet</span>
                  </Button>
                  <Button
                    variant={searchType === "numero" ? "default" : "outline"}
                    onClick={() => setSearchType("numero")}
                    className="flex items-center space-x-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Número da Sorte</span>
                  </Button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      searchType === "tutor" ? "Digite o nome ou e-mail do tutor..." :
                      searchType === "pet" ? "Digite o nome do pet..." :
                      "Digite o número da sorte..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {searchTerm && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Resultados da Busca
              </h2>

              {/* Tutores Results */}
              {(searchType === "tutor" || searchType === "numero") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-medium text-foreground flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Tutores ({filteredTutores.length})</span>
                  </h3>
                  {filteredTutores.length > 0 ? (
                    <div className="grid gap-4">
                      {filteredTutores.map((tutor) => (
                        <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h4 className="text-xl font-heading font-semibold text-foreground">
                                  {tutor.nome}
                                </h4>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>📧 {tutor.email}</p>
                                  <p>📱 {tutor.telefone}</p>
                                </div>
                              </div>
                              <div className="bg-primary/10 rounded-lg px-4 py-2">
                                <p className="text-sm font-medium text-primary">
                                  {tutor.pets} {tutor.pets === 1 ? 'Pet' : 'Pets'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Nenhum tutor encontrado
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Pets Results */}
              {(searchType === "pet" || searchType === "numero") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-medium text-foreground flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span>Pets ({filteredPets.length})</span>
                  </h3>
                  {filteredPets.length > 0 ? (
                    <div className="grid gap-4">
                      {filteredPets.map((pet) => (
                        <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h4 className="text-xl font-heading font-semibold text-foreground">
                                  {pet.nome}
                                </h4>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>🐾 {pet.tipo}</p>
                                  <p>👤 Tutor: {pet.tutor}</p>
                                </div>
                              </div>
                              <div className="bg-secondary/10 rounded-lg px-4 py-2">
                                <p className="text-xs text-muted-foreground mb-1">Número da Sorte</p>
                                <p className="text-lg font-bold font-heading text-secondary">
                                  {pet.numeroSorte}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Nenhum pet encontrado
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!searchTerm && (
            <div className="max-w-2xl mx-auto text-center space-y-4 py-12">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto" />
              <h3 className="text-xl font-heading font-medium text-muted-foreground">
                Digite algo para começar a busca
              </h3>
              <p className="text-muted-foreground font-body">
                Selecione o tipo de busca e digite o termo desejado
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
