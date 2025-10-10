import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { TutorForm } from "@/components/forms/tutor-form";
import { PetsForm } from "@/components/forms/pets-form";
import { ColaboradorLogin } from "@/components/forms/colaborador-login";
import { RegistrationSuccess } from "@/components/RegistrationSuccess";
import { Card, CardContent } from "@/components/ui/card";
import { TutorData, PetData } from "@/types/form-types";
import { supabase } from "@/integrations/supabase/client";
import { Check, User, Heart } from "lucide-react";
import { toast } from "sonner";

type Step = "tutor" | "pets" | "success";

export default function CadastroPage() {
  const [currentStep, setCurrentStep] = useState<Step>("tutor");
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [petsData, setPetsData] = useState<PetData[]>([]);
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string>("");

  const handleTutorNext = (data: TutorData) => {
    setTutorData(data);
    setCurrentStep("pets");
  };

  const handlePetsBack = () => {
    setCurrentStep("tutor");
  };

  const handlePetsSubmit = async (data: PetData[]) => {
    setPetsData(data);
    
    if (!tutorData) {
      toast.error("Dados do tutor não encontrados");
      return;
    }

    try {
      // 1. Inserir tutor
      const { data: tutorInserted, error: tutorError } = await supabase
        .from("tutores")
        .insert({
          full_name: tutorData.nomeCompleto,
          email: tutorData.email,
          telefone: tutorData.telefone,
          redes_sociais: tutorData.redesSociais,
          lgpd_consent: tutorData.consentimentoLGPD,
          image_publication_consent: tutorData.autorizacaoPublicacao,
        })
        .select()
        .single();

      if (tutorError) throw tutorError;

      // 2. Buscar evento ativo
      const { data: evento, error: eventoError } = await supabase
        .from("eventos")
        .select("id, whatsapp_link")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (eventoError) throw eventoError;
      setWhatsappLink(evento.whatsapp_link || "https://chat.whatsapp.com/seu-link-aqui");

      // 3. Inserir pets e gerar números da sorte
      for (const pet of data) {
        const { data: petInserted, error: petError } = await supabase
          .from("pets_novo")
          .insert({
            tutor_id: tutorInserted.id,
            pet_name: pet.nomePet,
            especie: pet.tipo,
            breed: "",
          })
          .select()
          .single();

        if (petError) throw petError;

        // 4. Gerar número da sorte
        const { data: luckyNum, error: luckyError } = await supabase
          .rpc("gerar_numero_sorte", {
            pet_uuid: petInserted.id,
            evento_uuid: evento.id,
          });

        if (luckyError) throw luckyError;
        
        // Usar o número do primeiro pet para exibição
        if (!luckyNumber) {
          setLuckyNumber(luckyNum);
        }
      }

      toast.success("Inscrição realizada com sucesso!");
      setCurrentStep("success");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao realizar inscrição. Tente novamente.");
    }
  };

  const steps = [
    { id: "tutor", label: "Dados do Tutor", icon: User },
    { id: "pets", label: "Cadastro dos Pets", icon: Heart },
    { id: "success", label: "Sucesso", icon: Check }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = 
                  (step.id === "tutor" && tutorData) ||
                  (step.id === "pets" && petsData.length > 0) ||
                  step.id === "success";
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                      ${isActive 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : isCompleted 
                        ? 'bg-secondary text-secondary-foreground border-secondary'
                        : 'bg-background text-muted-foreground border-muted'
                      }
                    `}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    
                    <div className="ml-3 hidden sm:block">
                      <div className={`
                        text-sm font-heading font-medium
                        ${isActive ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-muted-foreground'}
                      `}>
                        {step.label}
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-4 transition-colors
                        ${isCompleted ? 'bg-secondary' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto">
            {currentStep === "tutor" && (
              <>
                <Card className="border-2">
                  <CardContent className="p-8">
                    <TutorForm 
                      onNext={handleTutorNext}
                      initialData={tutorData || undefined}
                    />
                  </CardContent>
                </Card>
                
                <ColaboradorLogin />
              </>
            )}

            {currentStep === "pets" && (
              <PetsForm
                onSubmit={handlePetsSubmit}
                onBack={handlePetsBack}
                initialData={petsData}
              />
            )}

            {currentStep === "success" && tutorData && petsData.length > 0 && luckyNumber && (
              <RegistrationSuccess
                tutorName={tutorData.nomeCompleto}
                petName={petsData[0].nomePet}
                luckyNumber={luckyNumber}
                whatsappLink={whatsappLink}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
