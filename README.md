# CEMU - Sistema de Gestão de Estágios

## Descrição

O CEMU é um sistema completo para a gestão de estágios, desenvolvido com o objetivo de facilitar a conexão entre estudantes, empresas e instituições de ensino. A plataforma oferece funcionalidades para registro de estudantes e empresas, gerenciamento de estágios e geração de relatórios.

## Tecnologias Utilizadas

*   **Frontend:**
    *   React
    *   Axios
    *   React Router
    *   Tailwind CSS
    *   Vite
    *   jsPDF
    *   Toastify
*   **Backend:**
    *   Node.js
    *   Express
    *   MySQL
    *   Sequelize
    *   JSON Web Tokens (JWT)
    *   CORS
    *   dotenv
    *   node-cron
    *   socket.io
    *   bcrypt

## Pré-requisitos

*   Node.js (v18 ou superior)
*   npm ou yarn
*   MySQL

## Configuração

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd CEMU
    ```

2.  **Configurar o Backend:**

    *   Navegue até o diretório `backend`:

        ```bash
        cd backend
        ```

    *   Instale as dependências:

        ```bash
        npm install
        ```

        ou

        ```bash
        yarn install
        ```

    *   Crie um arquivo `.env` na raiz do diretório `backend` e configure as variáveis de ambiente:

        ```
        PORT=5001
        JWT_SECRET=sua_key_sectra
        REFRESH_SECRET=sua_refresh_key_secrets
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=password_da_db
        DB_DATABASE=cemu
        DB_PORT=3306
        ```

        Substitua os valores `your_jwt_secret_key`, `your_refresh_secret_key` e `your_db_password` com suas próprias chaves secretas e senha do banco de dados.

    *   Inicie o servidor backend:

        ```bash
        npm run dev
        ```

        ou

        ```bash
        yarn dev
        ```

3.  **Configurar o Frontend:**

    *   Navegue até o diretório `frontend`:

        ```bash
        cd ../frontend
        ```

    *   Instale as dependências:

        ```bash
        npm install
        ```

        ou

        ```bash
        yarn install
        ```

    *   Inicie o servidor frontend:

        ```bash
        npm run dev
        ```

        ou

        ```bash
        yarn dev
        ```

## Estrutura do Projeto

*   `backend/`: Contém o código do servidor Node.js.
    *   `config/`: Configurações do banco de dados e outros serviços.
        *   [`db.js`](backend/config/db.js ): Configuração da conexão com o banco de dados MySQL.
    *   `controllers/`: Lógica de controle das rotas.
        *   [`authController.js`](backend/controllers/authController.js ): Lógica de autenticação e autorização de usuários.
        *   [`cursoController.js`](backend/controllers/cursoController.js ): Lógica para gerenciamento de cursos.
        *   [`dashboardController.js`](backend/controllers/dashboardController.js ): Lógica para geração de dados do painel administrativo.
        *   [`empresaCursoController.js`](backend/controllers/empresaCursoController.js ): Lógica para gerenciamento da relação entre empresas e cursos.
        *   [`empresasController.js`](backend/controllers/empresasController.js ): Lógica para gerenciamento de empresas.
        *   [`estagiosController.js`](backend/controllers/estagiosController.js ): Lógica para gerenciamento de estágios.
    *   `middlewares/`: Middlewares para autenticação e autorização.
        *   [`authMiddleware.js`](backend/middlewares/authMiddleware.js ): Middleware para autenticação de tokens JWT.
    *   `models/`: Modelos de dados.
        *   [`LoginLog.js`](backend/models/LoginLog.js ): Modelo para logs de login.
        *   [`estudante.js`](backend/models/estudante.js ): Modelo para estudantes.
    *   `routes/`: Definição das rotas da API.
        *   [`authRoutes.js`](backend/routes/authRoutes.js ): Rotas de autenticação.
        *   [`curso.js`](backend/routes/curso.js ): Rotas para gerenciamento de cursos.
        *   [`estagios.js`](backend/routes/estagios.js ): Rotas para gerenciamento de estágios.
        *   [`userRoutes.js`](backend/routes/userRoutes.js ): Rotas para gerenciamento de usuários.
    *   [`server.js`](backend/server.js ): Arquivo principal do servidor.
*   `frontend/`: Contém o código da aplicação React.
    *   `src/`: Código fonte da aplicação.
        *   `components/`: Componentes React reutilizáveis.
            *   [`ListarRegistros.jsx`](frontend/src/components/ListarRegistros.jsx ): Componente para listar registros de estudantes e empresas.
            *   [`Perfil.jsx`](frontend/src/components/Perfil.jsx ): Componente para exibir e editar o perfil do usuário.
            *   [`LogsLogin.jsx`](frontend/src/components/LogsLogin.jsx ): Componente para exibir os logs de login.
        *   `utils/`: Utilitários.
            *   [`axiosInstance.js`](frontend/src/utils/axiosInstance.js ): Configuração do Axios para as requisições à API.
    *   [`App.jsx`](frontend/src/App.jsx ): Componente principal da aplicação.
    *   [`tailwind.config.cjs`](frontend/tailwind.config.cjs ): Arquivo de configuração do Tailwind CSS.
    *   [`vite.config.js`](frontend/vite.config.js ): Arquivo de configuração do Vite.

## Funcionalidades

*   **Autenticação e Autorização:**
    *   Registro de usuários.
    *   Login com JWT.
    *   Controle de acesso baseado em roles (Administrador, Funcionário, Leitor).
*   **Gerenciamento de Estudantes:**
    *   Registro de estudantes com informações detalhadas.
    *   Listagem, edição e exclusão de estudantes.
*   **Gerenciamento de Empresas:**
    *   Registro de empresas com informações detalhadas.
    *   Listagem, edição e exclusão de empresas.
*   **Gerenciamento de Cursos:**
    *   Registro de cursos.
    *   Listagem, edição e exclusão de cursos.
*   **Gerenciamento de Estágios:**
    *   Registro de estágios com informações detalhadas.
    *   Listagem, edição e exclusão de estágios.
    *   Emissão de notificações sobre estágios próximos do início ou término.
*   **Painel Administrativo:**
    *   Visualização de dados estatísticos sobre estudantes, empresas e estágios.
*   **Logs de Login:**
    *   Registro de logs de login para auditoria e segurança.
    *   Filtro de logs por role e período.
*   **Perfil do Usuário:**
    *   Visualização e edição de informações do perfil.
    *   Alteração de senha.

## Rotas da API

*   `POST /api/auth/register`: Registra um novo usuário.
*   `POST /api/auth/login`: Autentica um usuário e retorna um token JWT.
*   `GET /api/usuarios/perfil`: Retorna as informações do perfil do usuário autenticado.
*   `PUT /api/usuarios/alterar-senha`: Altera a senha do usuário autenticado.
*   `GET /api/estudantes`: Retorna a lista de estudantes.
*   `POST /api/estudantes`: Cria um novo estudante.
*   `PUT /api/estudantes/:id`: Atualiza um estudante existente.
*   `DELETE /api/estudantes/:id`: Exclui um estudante.
*   `GET /api/empresas`: Retorna a lista de empresas.
*   `POST /api/empresas`: Cria uma nova empresa.
*   `PUT /api/empresas/:id`: Atualiza uma empresa existente.
*   `DELETE /api/empresas/:id`: Exclui uma empresa.
*   `GET /api/estagios`: Retorna a lista de estágios.
*   `POST /api/estagios`: Cria um novo estágio.
*   `PUT /api/estagios/:id`: Atualiza um estágio existente.
*   `DELETE /api/estagios/:id`: Exclui um estágio.
*   `GET /api/usuarios/login-logs`: Retorna os logs de login.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.
