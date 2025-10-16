# Instruções: Criar Colaborador Inicial

## ⚠️ IMPORTANTE

O sistema foi normalizado conforme o escopo solicitado. A autenticação de colaboradores agora usa verificação direta no banco de dados (sem Supabase Auth).

## Estrutura do Banco de Dados

### Tabelas Principais:

1. **colaboradores**
   - id (UUID)
   - nome (TEXT)
   - email (TEXT, único)
   - senha_hash (TEXT) - hash bcrypt da senha
   - created_at, updated_at

2. **tutores**
   - id (UUID)
   - nome (TEXT)
   - email (TEXT, único)
   - telefone (TEXT)
   - created_at, updated_at

3. **pets**
   - id (UUID)
   - nome_pet (TEXT)
   - especie (TEXT)
   - raca (TEXT, nullable)
   - idade (INTEGER, nullable)
   - id_tutor (UUID, FK)
   - **numero_sorte (INTEGER)** - gerado automaticamente por trigger (1-99999)
   - created_at

4. **eventos**
   - id (UUID)
   - nome_evento, data_evento, local_evento
   - whatsapp_link
   - descricao

## Criar Colaborador Inicial

### Via SQL no Backend (Lovable Cloud):

```sql
-- Criar colaborador com senha em hash bcrypt
-- IMPORTANTE: Substitua 'SUA_SENHA_AQUI' pela senha desejada

INSERT INTO public.colaboradores (
  nome,
  email,
  senha_hash
) VALUES (
  'Pedro Jorge',
  'pedromjorge2005@gmail.com',
  crypt('SUA_SENHA_AQUI', gen_salt('bf'))
);
```

### Exemplo com senha "admin123":

```sql
INSERT INTO public.colaboradores (
  nome,
  email,
  senha_hash
) VALUES (
  'Pedro Jorge',
  'pedromjorge2005@gmail.com',
  crypt('admin123', gen_salt('bf'))
);
```

## Testar o Sistema

### 1. Cadastro de Tutor + Pet

1. Acesse `/cadastro`
2. Preencha os dados do tutor (nome, email, telefone)
3. Adicione pelo menos 1 pet (nome e tipo)
4. Clique em "Finalizar Cadastro"
5. **Resultado esperado:**
   - Tutor inserido em `tutores`
   - Pet inserido em `pets` com `numero_sorte` gerado automaticamente
   - Card de sucesso exibindo:
     - Nome do tutor e pet
     - Número da sorte
     - Link do WhatsApp do evento

### 2. Login de Colaborador

1. Na página `/cadastro`, role até "Acesso para Colaboradores"
2. Faça login com:
   - **Email:** pedromjorge2005@gmail.com
   - **Senha:** (a senha que você definiu no SQL)
3. **Resultado esperado:**
   - Mensagem de sucesso
   - Redirecionamento automático para `/busca`

### 3. Busca de Usuários

1. Após login, você estará em `/busca`
2. Digite na busca:
   - Nome do tutor
   - Nome do pet
   - Ou número da sorte
3. **Resultado esperado:**
   - Lista com dados completos: tutor, pet, espécie, raça, idade, número da sorte, contatos

## Verificações no Banco

### Verificar colaborador criado:

```sql
SELECT id, nome, email, created_at 
FROM public.colaboradores 
WHERE email = 'pedromjorge2005@gmail.com';
```

### Verificar tutores cadastrados:

```sql
SELECT id, nome, email, telefone, created_at 
FROM public.tutores 
ORDER BY created_at DESC;
```

### Verificar pets com números da sorte:

```sql
SELECT 
  p.id,
  p.nome_pet,
  p.especie,
  p.numero_sorte,
  t.nome as tutor_nome
FROM public.pets p
JOIN public.tutores t ON t.id = p.id_tutor
ORDER BY p.created_at DESC;
```

### Testar função de busca:

```sql
-- Buscar por nome
SELECT * FROM public.buscar_usuarios('João');

-- Buscar por número da sorte
SELECT * FROM public.buscar_usuarios('12345');

-- Ver todos
SELECT * FROM public.buscar_usuarios('');
```

## Número da Sorte - Como Funciona

O **número da sorte é gerado automaticamente** quando um pet é inserido:

1. Trigger `trigger_auto_numero_sorte` detecta INSERT em `pets`
2. Se `numero_sorte` é 0 ou NULL, chama `gerar_numero_sorte_simples()`
3. Função gera número aleatório entre 1 e 99999
4. Verifica se já existe (loop até encontrar único)
5. Retorna e insere o número

**Importante:** Números são únicos globalmente (não repetidos entre pets).

## Troubleshooting

### Erro: "Credenciais inválidas"
- Verifique se o colaborador foi criado no banco
- Verifique se o email está correto
- Verifique se a senha foi hasheada com bcrypt

### Erro: "Acesso restrito"
- Verifique se está logado (localStorage tem 'colaborador_email')
- Faça logout e login novamente

### Número da sorte não gerado:
```sql
-- Verificar trigger existe
SELECT tgname FROM pg_trigger WHERE tgrelid = 'public.pets'::regclass;

-- Testar geração manual
SELECT public.gerar_numero_sorte_simples();
```

### Cadastro de tutor/pet falha:
- Verifique logs do console no navegador
- Verifique se email do tutor não está duplicado
- Verifique políticas RLS:

```sql
SELECT * FROM pg_policies WHERE tablename IN ('tutores', 'pets');
```

## Próximos Passos

✅ Backend normalizado conforme escopo
✅ Número da sorte gerado automaticamente
✅ Login de colaborador funcional
✅ Busca de usuários implementada
✅ Redirecionamento pós-login corrigido

🔲 TODO: Implementar verificação de senha bcrypt no backend (recomendado usar Edge Function)
🔲 TODO: Melhorar segurança do login (adicionar rate limiting, tokens JWT)
