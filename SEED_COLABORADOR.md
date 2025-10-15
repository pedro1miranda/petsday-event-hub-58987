# Seed: Criação do Colaborador Inicial

## Passo 1: Criar Usuário via Supabase Auth

Para criar o colaborador seed com email `pedromjorge2005@gmail.com`, siga estes passos:

### Via Backend (Lovable Cloud):

1. Clique em "View Backend" no chat do Lovable
2. Vá para Authentication > Users
3. Clique em "Add User" > "Create new user"
4. Preencha:
   - **Email**: `pedromjorge2005@gmail.com`
   - **Password**: escolha uma senha forte
   - **Auto Confirm User**: ✅ Marque esta opção
5. Clique em "Create User"
6. **IMPORTANTE**: Copie o UUID do usuário criado (você verá na lista de usuários)

## Passo 2: Vincular o auth_uid na Tabela colaboradores

Execute este SQL no SQL Editor do backend:

```sql
-- Inserir colaborador vinculado ao usuário do Auth
INSERT INTO public.colaboradores (
  auth_uid,
  nome,
  email,
  status
) VALUES (
  'COLE_AQUI_O_UUID_DO_USUARIO',  -- Substitua pelo UUID copiado no passo 1
  'Pedro Jorge',
  'pedromjorge2005@gmail.com',
  true
)
ON CONFLICT (email) DO UPDATE
SET auth_uid = EXCLUDED.auth_uid,
    status = true;
```

## Passo 3: Testar o Login

1. Acesse a página de cadastro: `/cadastro`
2. Role até o card "Acesso para Colaboradores"
3. Faça login com:
   - Email: `pedromjorge2005@gmail.com`
   - Senha: a senha que você definiu no Passo 1
4. Você deve ser **redirecionado automaticamente para `/busca`**

## Verificação

Para verificar se o colaborador foi criado corretamente, execute:

```sql
-- Verificar colaborador
SELECT c.id, c.nome, c.email, c.auth_uid, c.status, c.created_at
FROM public.colaboradores c
WHERE c.email = 'pedromjorge2005@gmail.com';

-- Verificar usuário no Auth
SELECT id, email, created_at
FROM auth.users
WHERE email = 'pedromjorge2005@gmail.com';
```

Ambas as queries devem retornar resultados, e o `auth_uid` da tabela `colaboradores` deve ser igual ao `id` da tabela `auth.users`.

## Troubleshooting

### Erro: "Acesso negado. Apenas colaboradores podem acessar."
- Verifique se o `auth_uid` na tabela `colaboradores` está correto
- Verifique se `status = true` na tabela `colaboradores`

### Erro: "Invalid login credentials"
- Verifique se a senha está correta
- Certifique-se de que marcou "Auto Confirm User" ao criar o usuário

### Não redireciona para /busca
- Verifique se o `auth_uid` está vinculado corretamente
- Abra o console do navegador e procure por erros
