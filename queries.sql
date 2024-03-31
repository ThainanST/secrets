-- Criando tabela
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    secret VARCHAR(100)
)

-- Inserindo dados
INSERT INTO users(email, password, secret)
VALUES('joao@example.com', '123456', 'Segredo do João');

INSERT INTO users(email, password, secret)
VALUES('pedro@example.com', '123456', 'Segredo do Pedro');

-- Atualizando segredo para um usuário específico
UPDATE users
SET secret = 'Segredo do Tales'
WHERE id = 12;