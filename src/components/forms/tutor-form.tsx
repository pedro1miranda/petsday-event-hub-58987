import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TutorData, tutorSchema } from "@/types/form-types";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

interface TutorFormProps {
  onNext: (data: TutorData) => void;
  initialData?: TutorData;
}

export function TutorForm({ onNext, initialData }: TutorFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TutorData>({
    resolver: zodResolver(tutorSchema),
    defaultValues: initialData || {
      nomeCompleto: "",
      email: "",
      telefone: "",
      senha: "",
      consentimentoLGPD: false,
    },
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setValue("telefone", formatted);
  };

  const onSubmit = (data: TutorData) => {
    onNext(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Dados do <span className="gradient-text">Tutor</span>
        </h2>
        <p className="text-muted-foreground font-body">
          Primeiro, vamos precisar de algumas informações suas
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome Completo */}
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Nome Completo</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite seu nome completo"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Telefone</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(11) 99999-9999"
                    {...field}
                    onChange={handlePhoneChange}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Senha */}
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Senha</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      {...field}
                      className="h-12 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consentimento LGPD */}
          <FormField
            control={form.control}
            name="consentimentoLGPD"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-body">
                    Consentimento LGPD
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Concordo com o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            size="lg" 
            className="w-full hover-lift"
          >
            Próximo: Cadastrar Pet(s)
          </Button>
        </form>
      </Form>
    </div>
  );
}