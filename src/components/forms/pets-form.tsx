import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetData } from "@/types/form-types";
import { Plus, Trash2, Heart } from "lucide-react";
import { z } from "zod";

const petsFormSchema = z.object({
  pets: z.array(z.object({
    nomePet: z.string().min(1, "Nome do pet é obrigatório"),
    tipo: z.enum(["Cachorro", "Gato", "Pássaro", "Outro"])
  })).min(1, "Pelo menos um pet deve ser cadastrado")
});

type PetsFormData = z.infer<typeof petsFormSchema>;

interface PetsFormProps {
  onSubmit: (data: PetData[]) => void;
  onBack: () => void;
  initialData?: PetData[];
}

export function PetsForm({ onSubmit, onBack, initialData }: PetsFormProps) {
  const form = useForm<PetsFormData>({
    resolver: zodResolver(petsFormSchema),
    defaultValues: {
      pets: initialData?.length ? initialData : [{ nomePet: "", tipo: "Cachorro" as const }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pets"
  });

  const addPet = () => {
    append({ nomePet: "", tipo: "Cachorro" as const });
  };

  const removePet = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleSubmit = (data: PetsFormData) => {
    onSubmit(data.pets);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Cadastre seu(s) <span className="gradient-text">Pet(s)</span>
        </h2>
        <p className="text-muted-foreground font-body">
          Agora vamos conhecer seus companheiros especiais
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="font-heading">Pet {index + 1}</span>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePet(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome do Pet */}
                  <FormField
                    control={form.control}
                    name={`pets.${index}.nomePet`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pet</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Rex, Mimi, Thor..."
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo do Pet */}
                  <FormField
                    control={form.control}
                    name={`pets.${index}.tipo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo do Pet</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cachorro">🐕 Cachorro</SelectItem>
                            <SelectItem value="Gato">🐱 Gato</SelectItem>
                            <SelectItem value="Pássaro">🐦 Pássaro</SelectItem>
                            <SelectItem value="Outro">🐾 Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Pet Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={addPet}
              className="hover-lift"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Outro Pet
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="hover-lift"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="hover-lift animate-bounce-gentle"
            >
              Finalizar Inscrição
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}