# Documentação do Schema do Banco de Dados

## 📋 Visão Geral

Este documento descreve as tabelas iniciais do banco de dados PostgreSQL para o projeto RPG Gamification. As tabelas foram projetadas para armazenar informações de usuários, personagens, missões e itens.

---

### Tabela: `users`
- **Finalidade:** Armazena as informações básicas de autenticação do usuário.
- **Campos:**
    - `id`: UUID, chave primária. Identificador único para cada usuário.
    - `email`: VARCHAR(255), único. Usado para login e notificação.
    - `password_hash`: VARCHAR(255). Versão com hash da senha para segurança.
    - `name`: VARCHAR(255). Nome de exibição do usuário.
    - `created_at`: TIMESTAMP. Data de criação do registro.
    - `updated_at`: TIMESTAMP. Data da última atualização do registro.

---

### Tabela: `characters`
- **Finalidade:** Armazena os dados do personagem de cada usuário, como nível, XP e atributos.
- **Relacionamento:** `user_id` referencia `users(id)` com `ON DELETE CASCADE`.
- **Campos:**
    - `id`: UUID, chave primária.
    - `user_id`: UUID. Chave estrangeira para a tabela `users`.
    - `name`: VARCHAR(255).
    - `level`: INTEGER.
    - `xp`: INTEGER.
    - `max_xp`: INTEGER.
    - `class`: VARCHAR(100).
    - `attributes`: JSONB. Armazena os atributos do personagem de forma flexível.
    - `equipped_items`: JSONB. Armazena os IDs dos itens equipados.
    - `gear_score`: INTEGER.
    - `avatar`: TEXT.
    - `created_at`: TIMESTAMP.
    - `updated_at`: TIMESTAMP.

---

### Tabela: `quests`
- **Finalidade:** Armazena as tarefas e missões criadas pelos usuários.
- **Relacionamento:** `user_id` referencia `users(id)` com `ON DELETE CASCADE`.
- **Campos:**
    - `id`: UUID, chave primária.
    - `user_id`: UUID.
    - `title`: VARCHAR(255).
    - `description`: TEXT.
    - `tags`: JSONB.
    - `difficulty`: VARCHAR(20).
    - `xp_base`: INTEGER.
    - `multiplier`: DECIMAL(3,2).
    - `rewards`: JSONB.
    - `progress`: INTEGER.
    - `max_progress`: INTEGER.
    - `is_completed`: BOOLEAN.
    - `time_limit`: VARCHAR(50).
    - `created_at`: TIMESTAMP.
    - `completed_at`: TIMESTAMP.
    - `updated_at`: TIMESTAMP.

---

### Tabela: `item_bases`
- **Finalidade:** Atua como um "template" para a geração de itens.
- **Campos:**
    - `id`: UUID, chave primária.
    - `name`: VARCHAR(255).
    - `description`: TEXT.
    - `rarity`: VARCHAR(20).
    - `slot`: VARCHAR(20).
    - `tier`: INTEGER.
    - `icon`: TEXT.
    - `base_stats`: JSONB.
    - `stat_ranges`: JSONB.
    - `created_at`: TIMESTAMP.

---

### Tabela: `generated_items`
- **Finalidade:** Armazena os itens únicos gerados para cada usuário (inventário).
- **Relacionamento:**
    - `user_id` referencia `users(id)` com `ON DELETE CASCADE`.
    - `character_id` referencia `characters(id)` com `ON DELETE CASCADE`.
    - `base_id` referencia `item_bases(id)`.
- **Campos:**
    - `id`: UUID, chave primária.
    - `user_id`: UUID.
    - `character_id`: UUID.
    - `base_id`: UUID.
    - `name`: VARCHAR(255).
    - `description`: TEXT.
    - `rarity`: VARCHAR(20).
    - `slot`: VARCHAR(20).
    - `tier`: INTEGER.
    - `icon`: TEXT.
    - `stats`: JSONB.
    - `enhancement_level`: INTEGER.
    - `is_equipped`: BOOLEAN.
    - `generated_at`: TIMESTAMP.
    - `created_at`: TIMESTAMP.