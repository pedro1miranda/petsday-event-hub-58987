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

  const fetchDefaultEvent = async () => {
    const { data, error } = await supabase
      .from("eventos")
      .select("whatsapp_link")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return data;
  };

  const createTutor = async (data: TutorData) => {
    const tutorId = crypto.randomUUID();

    const { error } = await supabase.from("tutores").insert({
      id: tutorId,
      nome: data.nomeCompleto,
      email: data.email,
      telefone: data.telefone || null,
    });

    if (error) throw error;

    return tutorId;
  };

  const createPet = async (tutorId: string, pet: PetData) => {
    const { data: luckyNumber, error: luckyNumberError } = await supabase.rpc(
      "gerar_numero_sorte_simples"
    );

    if (luckyNumberError) throw luckyNumberError;
    if (typeof luckyNumber !== "number") {
      throw new Error("Não foi possível gerar o número da sorte.");
    }

    const { error: petError } = await supabase.from("pets").insert({
      id: crypto.randomUUID(),
      id_tutor: tutorId,
      nome_pet: pet.nomePet,
      especie: pet.tipo,
      raca: null,
      idade: null,
      numero_sorte: luckyNumber,
    });

    if (petError) throw petError;

    return luckyNumber;
  };

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

      const [evento, tutorId] = await Promise.all([
        fetchDefaultEvent(),
        createTutor(tutorData),
      ]);

      const generatedNumbers: number[] = [];

      for (const pet of data) {
        const luckyNumber = await createPet(tutorId, pet);
        generatedNumbers.push(luckyNumber);
      }

      setPetsData(data);
      setLuckyNumbers(generatedNumbers);
      setWhatsappLink(evento?.whatsapp_link || "");

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