import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Heart, Ticket, LogOut, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SearchResult = {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorSocialMedia: string;
  lgpdConsent: boolean;
  imagePublicationConsent: boolean;
  petId: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  luckyNumber: number | null;
};

export default function BuscaPage() {
  const { user, isStaff, loading, signOut } = useAuth(true);
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
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Call the RPC function instead of direct table queries
      const { data, error } = await supabase
        .rpc('buscar_usuarios', { search_term: searchTerm });

      if (error) throw error;

      // Transform RPC results to SearchResult format
      const transformedResults: SearchResult[] = (data || []).map((item: any) => ({
        id: `${item.tutor_id}-${item.pet_id}`,
        tutorId: item.tutor_id,
        tutorName: item.tutor_nome,
        tutorEmail: item.email,
        tutorPhone: item.telefone,
        tutorSocialMedia: item.redes_sociais,
        lgpdConsent: item.lgpd_consent,
        imagePublicationConsent: item.image_publication_consent,
        petId: item.pet_id,
        petName: item.pet_nome,
        petSpecies: item.especie,
        petBreed: item.breed || "",
        luckyNumber: item.numero_sorte,
      }));

      setResults(transformedResults);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Erro ao buscar dados: " + error.message);
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
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
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Pesquise por nome do tutor, nome do pet ou número da sorte
                </p>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Digite o termo de busca (nome do tutor, pet ou número)..."
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
                <h2 className="text-2xl font-heading font-semibold text-foreground">
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
                    {results.map((result) => (
                      <Card key={result.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 flex-1">
                                <h4 className="text-xl font-heading font-semibold text-foreground">
                                  {result.tutorName}
                                </h4>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  {result.tutorEmail && (
                                    <p className="flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      {result.tutorEmail}
                                    </p>
                                  )}
                                  {result.tutorPhone && (
                                    <p className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      {result.tutorPhone}
                                    </p>
                                  )}
                                </div>
                                {result.petName && (
                                  <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-foreground">
                                      Pet: {result.petName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {result.petSpecies} {result.petBreed && `- ${result.petBreed}`}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {result.luckyNumber && (
                                  <div className="bg-secondary/10 rounded-lg px-4 py-2">
                                    <p className="text-xs text-muted-foreground mb-1">Número da Sorte</p>
                                    <p className="text-lg font-bold font-heading text-secondary">
                                      {result.luckyNumber}
                                    </p>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedDetail(result)}
                                >
                                  Ver detalhes
                                </Button>
                              </div>
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
                Selecione o tipo de busca e digite o termo desejado
              </p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cadastro</DialogTitle>
            <DialogDescription>
              Informações completas sobre o tutor
            </DialogDescription>
          </DialogHeader>
          {selectedDetail && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Informações do Tutor</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nome:</span> {selectedDetail.tutorName}</p>
                  {selectedDetail.tutorEmail && (
                    <p><span className="font-medium">E-mail:</span> {selectedDetail.tutorEmail}</p>
                  )}
                  {selectedDetail.tutorPhone && (
                    <p><span className="font-medium">Telefone:</span> {selectedDetail.tutorPhone}</p>
                  )}
                  {selectedDetail.tutorSocialMedia && (
                    <p><span className="font-medium">Redes Sociais:</span> {selectedDetail.tutorSocialMedia}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Permissões</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">LGPD:</span>{" "}
                    {selectedDetail.lgpdConsent ? "✅ Aceito" : "❌ Não aceito"}
                  </p>
                  <p>
                    <span className="font-medium">Publicação de Imagens:</span>{" "}
                    {selectedDetail.imagePublicationConsent ? "✅ Autorizado" : "❌ Não autorizado"}
                  </p>
                </div>
              </div>

              {selectedDetail.petName && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Informações do Pet</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Nome:</span> {selectedDetail.petName}</p>
                    <p><span className="font-medium">Espécie:</span> {selectedDetail.petSpecies}</p>
                    {selectedDetail.petBreed && (
                      <p><span className="font-medium">Raça:</span> {selectedDetail.petBreed}</p>
                    )}
                    {selectedDetail.luckyNumber && (
                      <p><span className="font-medium">Número da Sorte:</span> {selectedDetail.luckyNumber}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
