# User Manager

Sistema web distribuído para gerenciamento de usuários com frontend em React + Vite + TypeScript e dois serviços backend: Laravel (user-service) e Node.js (enrichment-service).

## Estrutura do Projeto

```
.
├── frontend/                 # Aplicação React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/       # Serviços de API
│   │   └── types/          # Definições de tipos TypeScript
│   ├── Dockerfile          # Configuração do Docker para o frontend
│   └── nginx.conf          # Configuração do Nginx
├── user-service/           # Serviço Laravel para dados principais
├── enrichment-service/     # Serviço Node.js para dados enriquecidos
├── docker-compose.yml      # Configuração dos containers
└── .env.example           # Exemplo de variáveis de ambiente
```

## Requisitos

- Docker
- Docker Compose
- Node.js 20+
- pnpm

## Instalação e Execução

1. Clone o repositório:

```bash
git clone <repository-url>
cd user-manager
```

2. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

3. Inicie os containers:

```bash
docker-compose up -d
```

4. Acesse a aplicação:

- Frontend: http://localhost:3000
- User Service API: http://localhost:8000
- Enrichment Service API: http://localhost:8001
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## API Contracts

### User Service (Laravel)

#### GET /users

Lista todos os usuários.

Resposta:

```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string"
  }
]
```

#### POST /users

Cria um novo usuário.

Request:

```json
{
  "name": "string",
  "email": "string"
}
```

Resposta:

```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

#### GET /users/{id}

Obtém detalhes de um usuário específico.

Resposta:

```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

### Enrichment Service (Node.js)

#### GET /users/enriched/{uuid}

Obtém dados enriquecidos de um usuário.

Resposta:

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "linkedin": "string",
  "github": "string",
  "status": "processing" | "completed" | "error"
}
```

## Decisões Técnicas

1. **Frontend**:

   - React + Vite + TypeScript para desenvolvimento rápido e tipagem forte
   - React Query para gerenciamento de estado e cache
   - Tailwind CSS para estilização rápida e responsiva
   - React Router para navegação
   - Zod para validação de formulários

2. **Backend**:

   - Laravel para o serviço principal de usuários (robustez e facilidade de desenvolvimento)
   - Node.js para o serviço de enriquecimento (flexibilidade e performance)
   - RabbitMQ para comunicação assíncrona entre serviços
   - MySQL para persistência de dados

3. **DevOps**:
   - Docker para containerização
   - Nginx como servidor web para o frontend
   - Docker Compose para orquestração dos serviços
   - Variáveis de ambiente para configuração

## Desenvolvimento

Para desenvolvimento local sem Docker:

1. Instale as dependências:

```bash
pnpm install
```

2. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

## Testes

Para executar os testes:

```bash
pnpm test
```
