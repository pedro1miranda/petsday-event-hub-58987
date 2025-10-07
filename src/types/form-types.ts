import { z } from "zod";

// Esquema para dados do tutor
export const tutorSchema = z.object({
  nomeCompleto: z.string()
    .min(1, "Nome completo é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  
  telefone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato: (11) 99999-9999"),
  
  senha: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter ao menos uma letra minúscula, uma maiúscula e um número"),
  
  consentimentoLGPD: z.boolean()
    .refine(val => val === true, "Consentimento LGPD é obrigatório")
});

// Esquema para dados do pet
export const petSchema = z.object({
  nomePet: z.string()
    .min(1, "Nome do pet é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  
  tipo: z.enum(["Cachorro", "Gato", "Pássaro", "Outro"], {
    required_error: "Tipo do pet é obrigatório"
  }),
  
  fotoPet: z.instanceof(File, { message: "Foto do pet é obrigatória" })
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, 
      "Arquivo deve ter no máximo 5MB"
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Apenas arquivos JPG e PNG são aceitos"
    )
});

// Esquema completo do formulário
export const cadastroSchema = z.object({
  tutor: tutorSchema,
  pets: z.array(petSchema).min(1, "Pelo menos um pet deve ser cadastrado")
});

// Tipos TypeScript
export type TutorData = z.infer<typeof tutorSchema>;
export type PetData = z.infer<typeof petSchema>;
export type CadastroData = z.infer<typeof cadastroSchema>;