# Mural de Oportunidades

Aplicação web que reúne bolsas, estágios, monitorias, iniciações científicas e eventos voltados a estudantes de **Engenharia de Computação · UFC Sobral**. O estudante pode buscar e filtrar oportunidades, descobrir quais combinam com seu perfil por meio de um quiz e consultar o calendário de eventos do campus.

## Funcionalidades

- **Início (mural):** lista as oportunidades com prazo em aberto, com busca por título, filtros (tipo, instituição e modalidade) e ordenação por prazo. Oportunidades com prazo de até 7 dias recebem destaque de urgência.
- **Detalhes da oportunidade:** descrição completa, área, natureza, habilidades, painel de prazo e links externos.
- **Quiz de recomendação:** 5 perguntas (área, tipo, natureza, habilidades e modalidade). As oportunidades são pontuadas pelas respostas e ordenadas da mais à menos compatível.
- **Calendário de eventos:** grade mensal com navegação entre meses, seleção de dia, lista de eventos do dia e navegação por teclado (setas).
- **Estados de interface:** carregamento, erro com botão de tentar novamente, "nenhum resultado" e "oportunidade não encontrada".

## Tecnologias

| Tecnologia                                                                  | Uso                                 |
| --------------------------------------------------------------------------- | ----------------------------------- |
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Interface e tipagem                 |
| [Vite](https://vite.dev/)                                                   | Servidor de desenvolvimento e build |
| [React Router](https://reactrouter.com/) (v7)                               | Rotas, com `createHashRouter`       |
| [Tailwind CSS](https://tailwindcss.com/) (v4)                               | Estilização                         |
| [lucide-react](https://lucide.dev/)                                         | Ícones                              |

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. Clonar o repositório
git clone <URL-DO-REPOSITORIO>
cd <NOME-DA-PASTA>

# 2. Instalar as dependências
npm install

# 3. Iniciar em modo de desenvolvimento
npm run dev
```

Depois, acesse o endereço exibido no terminal (normalmente `http://localhost:5173`).

### Outros comandos

| Comando           | O que faz                                                |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento                     |
| `npm run build`   | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão gerada pelo build              |

## Estrutura do projeto

```
src/
├── app
│   ├── App.tsx
│   ├── components
│   │   ├── AccessCard.tsx
│   │   ├── DeadlinePanel.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ExternalLinks.tsx
│   │   ├── FilterBar.tsx
│   │   ├── LoadingCards.tsx
│   │   ├── OpportunityCard.tsx
│   │   └── PageLayout.tsx
│   ├── data.tsx
│   ├── pages
│   │   ├── Calendar.tsx
│   │   ├── Home.tsx
│   │   ├── OpportunityDetails.tsx
│   │   └── Quiz.tsx
│   ├── routes.tsx
│   └── types.ts
├── App.tsx
├── data
│   ├── eventos.json
│   └── oportunidades.json
├── index.css
└── main.tsx
```

### Rotas

| Rota                | Página                          |
| ------------------- | ------------------------------- |
| `/`                 | Início (mural de oportunidades) |
| `/oportunidade/:id` | Detalhes da oportunidade        |
| `/quiz`             | Quiz de recomendação            |
| `/calendario`       | Calendário de eventos           |

O projeto usa roteamento por hash (`/#/quiz`), o que permite hospedar em serviços estáticos, como GitHub Pages, sem configuração extra de servidor.

## Dados

Os dados ficam em arquivos JSON e são carregados pelo `DataProvider` em `src/app/data.tsx`. Qualquer página acessa os dados com o hook `useData()`, que retorna `opportunities`, `events`, `loading`, `error` e `retry`.

### Oportunidade (`oportunidades.json`)

| Campo           | Descrição                                                               |
| --------------- | ----------------------------------------------------------------------- |
| `id`            | Identificador único, usado na URL                                       |
| `titulo`        | Título da oportunidade                                                  |
| `tipo`          | Ex.: `monitoria`, `bolsa`, `estágio`, `iniciação científica`, `auxílio` |
| `instituicao`   | Instituição ou laboratório responsável                                  |
| `modalidade`    | `presencial` ou `remoto`                                                |
| `dataLimite`    | Prazo de inscrição, no formato `AAAA-MM-DD`                             |
| `descricao`     | Texto descritivo                                                        |
| `area`          | Ex.: `software`, `hardware`, `dados`, `redes`                           |
| `natureza`      | `pratica`, `pesquisa` ou `teorica`                                      |
| `habilidades`   | Lista de habilidades relacionadas                                       |
| `linksExternos` | Lista de links para edital ou inscrição                                 |

### Evento (`eventos.json`)

| Campo                          | Descrição                               |
| ------------------------------ | --------------------------------------- |
| `id`                           | Identificador único                     |
| `titulo`                       | Título do evento                        |
| `tipo`                         | Ex.: `palestra`, `workshop`             |
| `data`                         | Data do evento, no formato `AAAA-MM-DD` |
| `horarioInicio` / `horarioFim` | Horários no formato `HH:MM`             |
| `local`                        | Local do evento                         |
| `instituicao`                  | Organizador                             |
| `descricao`                    | Texto descritivo                        |
| `linksExternos`                | Lista de links relacionados             |

## Deploy

O projeto gera arquivos estáticos em `dist/` com `npm run build`, e pode ser publicado em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages). Para GitHub Pages em um repositório que não seja `usuario.github.io`, defina `base: "/<nome-do-repositorio>/"` no `vite.config.ts`.

## Equipe

- Pedro Rickson Fernandes Aragão.
- Leticia Araújo Sousa
- Clarisse Mesquita Lima
