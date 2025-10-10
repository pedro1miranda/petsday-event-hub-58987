import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer } from "@/components/ui/footer";
import { Navigation } from "@/components/ui/navigation";
import { Search, User, Heart, Hash, Phone, Mail, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SearchType = "all" | "tutor" | "pet" | "luckyNumber";

interface SearchResult {
  tutor_id: string;
  tutor_nome: string;
  pet_id: string;
  pet_nome: string;
  especie: string | null;
  breed: string | null;
  numero_sorte: number | null;
  telefone: string | null;
  email: string | null;
  redes_sociais: string | null;
  lgpd_consent: boolean;
  image_publication_consent: boolean;
}

export default function BuscaPage() {
  const { isStaff, loading, signOut } = useAuth(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc('buscar_usuarios', {
        search_term: searchTerm
      });

      if (error) {
        console.error("Search error:", error);
        toast.error("Erro ao realizar busca");
        setResults([]);
        return;
      }

      setResults(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Erro inesperado ao buscar");
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-4 flex justify-end">
        <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold">
              Busca de <span className="gradient-text">Participantes</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Encontre tutores, pets ou números da sorte cadastrados no evento
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Pesquisar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Digite o nome do tutor, pet ou número da sorte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {searchTerm && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-semibold">
                  Resultados ({results.length})
                </h2>
                
                {isSearching ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Buscando...
                    </CardContent>
                  </Card>
                ) : results.length > 0 ? (
                  <div className="grid gap-4">
                    {results.map((result, index) => (
                      <Card key={`${result.pet_id}-${index}`} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-lg">{result.tutor_nome}</h3>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                  {result.pet_nome} ({result.especie || "N/A"})
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <Hash className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                  Número da Sorte: <span className="font-bold text-primary">
                                    {result.numero_sorte ? String(result.numero_sorte).padStart(6, '0') : "N/A"}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDetail(result)}
                            >
                              Ver detalhes
                            </Button>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span>{result.telefone || "Não informado"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span>{result.email || "Não informado"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Nenhum registro encontrado
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {!searchTerm && (
            <div className="max-w-2xl mx-auto text-center space-y-4 py-12">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto" />
              <h3 className="text-xl font-heading font-medium text-muted-foreground">
                Digite algo para começar a busca
              </h3>
              <p className="text-muted-foreground font-body">
                Pesquise por nome do tutor, pet ou número da sorte
              </p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cadastro</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Informações do Tutor</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nome:</span> {selectedDetail.tutor_nome}</p>
                  <p><span className="font-medium">Email:</span> {selectedDetail.email || "Não informado"}</p>
                  <p><span className="font-medium">Telefone:</span> {selectedDetail.telefone || "Não informado"}</p>
                  <p><span className="font-medium">Redes Sociais:</span> {selectedDetail.redes_sociais || "Não informado"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Informações do Pet</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nome:</span> {selectedDetail.pet_nome}</p>
                  <p><span className="font-medium">Espécie:</span> {selectedDetail.especie || "Não informado"}</p>
                  <p><span className="font-medium">Raça:</span> {selectedDetail.breed || "Não informado"}</p>
                  <p><span className="font-medium">Número da Sorte:</span> {selectedDetail.numero_sorte ? String(selectedDetail.numero_sorte).padStart(6, '0') : "Não gerado"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Consentimentos</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">LGPD:</span>{" "}
                    <span className={selectedDetail.lgpd_consent ? "text-green-600" : "text-red-600"}>
                      {selectedDetail.lgpd_consent ? "Aceito" : "Não aceito"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Publicação de Imagens:</span>{" "}
                    <span className={selectedDetail.image_publication_consent ? "text-green-600" : "text-red-600"}>
                      {selectedDetail.image_publication_consent ? "Aceito" : "Não aceito"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
