import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { TutorForm } from "@/components/forms/tutor-form";
import { PetsForm } from "@/components/forms/pets-form";
import { ColaboradorLogin } from "@/components/forms/colaborador-login";
import { RegistrationSuccess } from "@/components/RegistrationSuccess";
import { Card, CardContent } from "@/components/ui/card";
import { TutorData, PetData } from "@/types/form-types";
import { Check, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = "tutor" | "pets" | "success";

export default function CadastroPage() {
  const [currentStep, setCurrentStep] = useState<Step>("tutor");
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [petsData, setPetsData] = useState<PetData[]>([]);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [whatsappLink, setWhatsappLink] = useState<string>("");
  const { toast } = useToast();

  const handleTutorNext = (data: TutorData) => {
    setTutorData(data);
    setCurrentStep("pets");
  };

  const handlePetsBack = () => {
    setCurrentStep("tutor");
  };

  const handlePetsSubmit = async (data: PetData[]) => {
    try {
      if (!tutorData) return;

      setPetsData(data);

      // Buscar evento padrão
      const { data: eventos, error: eventoError } = await supabase
        .from("eventos")
        .select("*")
        .limit(1)
        .single();

      if (eventoError) throw eventoError;

      // Inserir tutor
      const { data: tutorInserted, error: tutorError } = await supabase
        .from("tutores")
        .insert({
          nome: tutorData.nomeCompleto,
          email: tutorData.email,
          telefone: tutorData.telefone || null,
        })
        .select()
        .single();

      if (tutorError) throw tutorError;

      const generatedNumbers: number[] = [];

      // Inserir pets (número da sorte gerado automaticamente pelo trigger)
      for (const pet of data) {
        const { data: petInserted, error: petError } = await supabase
          .from("pets")
          .insert({
            id_tutor: tutorInserted.id,
            nome_pet: pet.nomePet,
            especie: pet.tipo,
            raca: null,
            idade: null,
            numero_sorte: 0, // Será gerado automaticamente pelo trigger
          })
          .select()
          .single();

        if (petError) throw petError;

        generatedNumbers.push(petInserted.numero_sorte);
      }

      setLuckyNumbers(generatedNumbers);
      setWhatsappLink(eventos.whatsapp_link || "");

      toast({
        title: "Inscrição realizada com sucesso! 🎉",
        description: "Seus números da sorte foram gerados!",
      });

      setCurrentStep("success");
    } catch (error: any) {
      toast({
        title: "Erro ao processar inscrição",
        description: error.message,
        variant: "destructive",
      });
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
                
                {/* Login para Colaboradores */}
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

            {currentStep === "success" && tutorData && (
              <RegistrationSuccess
                tutorName={tutorData.nomeCompleto}
                petNames={petsData.map(pet => pet.nomePet)}
                luckyNumbers={luckyNumbers}
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