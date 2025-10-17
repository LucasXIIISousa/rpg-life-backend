-- backend/database/scripts/create_tables.sql

-- =================================================================
-- SEÇÃO DE LIMPEZA (DROP)
-- Deleta as tabelas na ordem inversa de dependência se elas já existirem.
-- O CASCADE cuida de remover as dependências automaticamente.
-- =================================================================
DROP TABLE IF EXISTS generated_items CASCADE;
DROP TABLE IF EXISTS item_bases CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =================================================================
-- SEÇÃO DE CRIAÇÃO (CREATE)
-- Cria a estrutura de tabelas do zero.
-- =================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  last_login TIMESTAMP, -- <-- Adicionado para a mecânica de inatividade
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de personagens
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  max_xp INTEGER DEFAULT 1000,
  class VARCHAR(100) DEFAULT 'Life Adventurer',
  attributes JSONB NOT NULL,
  appearance JSONB, -- <-- Adicionado para a customização
  equipped_items JSONB DEFAULT '{}',
  gear_score INTEGER DEFAULT 0,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de quests
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tags JSONB NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  xp_base INTEGER NOT NULL,
  multiplier DECIMAL(3,2) NOT NULL,
  rewards JSONB NOT NULL,
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  time_limit VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- CAMPOS NOVOS PARA RECORRÊNCIA E CONSISTÊNCIA --
  recurrence_type VARCHAR(20) DEFAULT 'única', -- Ex: 'única', 'diária', 'semanal'
  consistency_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP
);

-- Tabela de bases de itens
CREATE TABLE item_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rarity VARCHAR(20) NOT NULL,
  slot VARCHAR(20) NOT NULL,
  tier INTEGER NOT NULL,
  icon TEXT,
  base_stats JSONB NOT NULL,
  stat_ranges JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens gerados (inventário)
CREATE TABLE generated_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  base_id UUID REFERENCES item_bases(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rarity VARCHAR(20) NOT NULL,
  slot VARCHAR(20) NOT NULL,
  tier INTEGER NOT NULL,
  icon TEXT,
  stats JSONB NOT NULL,
  enhancement_level INTEGER DEFAULT 0,
  is_equipped BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);