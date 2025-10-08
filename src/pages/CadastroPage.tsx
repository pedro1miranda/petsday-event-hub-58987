import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { TutorForm } from "@/components/forms/tutor-form";
import { PetsForm } from "@/components/forms/pets-form";
import { ColaboradorLogin } from "@/components/forms/colaborador-login";
import { Card, CardContent } from "@/components/ui/card";
import { TutorData, PetData } from "@/types/form-types";
import { Check, User, Heart, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Step = "tutor" | "pets" | "success";

export default function CadastroPage() {
  const [currentStep, setCurrentStep] = useState<Step>("tutor");
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [petsData, setPetsData] = useState<PetData[]>([]);
  const { toast } = useToast();

  const handleTutorNext = (data: TutorData) => {
    setTutorData(data);
    setCurrentStep("pets");
  };

  const handlePetsBack = () => {
    setCurrentStep("tutor");
  };

  const handlePetsSubmit = (data: PetData[]) => {
    setPetsData(data);
    
    // Simulate form submission
    toast({
      title: "Inscrição realizada com sucesso! 🎉",
      description: "Nos vemos no PETs DAY!",
    });
    
    setCurrentStep("success");
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

            {currentStep === "success" && (
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
                      Em breve entraremos em contato com mais informações sobre o evento.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-xl p-6 max-w-md mx-auto space-y-4">
                    <h3 className="font-heading font-semibold text-foreground">
                      Resumo da Inscrição
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tutor:</span>
                        <span className="font-medium">{tutorData?.nomeCompleto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{tutorData?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pets cadastrados:</span>
                        <span className="font-medium">{petsData.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" className="hover-lift">
                      <Link to="/">Voltar ao Início</Link>
                    </Button>
                    <Button asChild className="hover-lift">
                      <Link to="/patrocinadores">Conhecer Parceiros</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}