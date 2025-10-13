import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const colaboradorSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  
  senha: z.string()
    .min(1, "Senha é obrigatória")
});

type ColaboradorData = z.infer<typeof colaboradorSchema>;

export function ColaboradorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<ColaboradorData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      email: "",
      senha: ""
    }
  });

  const onSubmit = async (data: ColaboradorData) => {
    try {
      // Autenticar via Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });

      if (authError) throw authError;

      // Verificar se é colaborador ativo
      const { data: colaborador, error: colabError } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("auth_uid", authData.user.id)
        .eq("status", true)
        .maybeSingle();

      if (colabError) throw colabError;

      if (!colaborador) {
        await supabase.auth.signOut();
        throw new Error("Acesso negado. Apenas colaboradores podem acessar.");
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para área de gestão...",
      });

      navigate("/busca");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-2 border-accent/30 mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-heading flex items-center gap-2">
          <Lock className="w-5 h-5 text-accent" />
          Acesso para Colaboradores
        </CardTitle>
        <CardDescription className="font-body">
          Área restrita para equipe de organização e gestão do evento
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="colaborador-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              E-mail
            </Label>
            <Input
              id="colaborador-email"
              type="email"
              placeholder="colaborador@petsday.com.br"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive font-body">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="colaborador-senha" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="colaborador-senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                {...form.register("senha")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {form.formState.errors.senha && (
              <p className="text-sm text-destructive font-body">
                {form.formState.errors.senha.message}
              </p>
            )}
          </div>

          {/* Botão de Login */}
          <Button 
            type="submit" 
            variant="outline"
            className="w-full border-accent hover:bg-accent hover:text-accent-foreground"
            disabled={form.formState.isSubmitting}
          >
            Entrar como Colaborador
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
