# Gerador de Cartões de Visita Digitais

Este é um projeto para a criação de cartões de visita digitais interativos e personalizáveis. O sistema é composto por um editor web que permite ao usuário inserir suas informações, customizar o design em tempo real e gerar um cartão final, tudo de forma visual e intuitiva.

## Funcionalidades Atuais

*   **Editor Web (`editor.html`):** Uma interface única para controlar todos os aspectos do cartão.
*   **Customização de Conteúdo:** Campos para nome, profissão, WhatsApp, QR Code, tagline e lista de serviços.
*   **Design Avançado do Verso:**
    *   Opção de cor sólida.
    *   Opção de gradiente com até 3 cores.
    *   Controle de ângulo (0-360°) para o gradiente.
*   **Design Avançado da Frente:**
    *   Galeria com 5 templates de design pré-definidos (Ondas, Faixa Diagonal, Círculos, etc.).
    *   Seletores de cor para customizar os elementos de cada template.
*   **Pré-visualização em Tempo Real:** Todas as alterações de design e cor são refletidas instantaneamente em caixas de pré-visualização no editor.
*   **Geração de Cartão:** O cartão final é gerado em uma nova aba, com a animação de virar e com todos os dados e estilos aplicados.
*   **Persistência de Dados (Local):**
    *   **Salvar Configuração:** Gera e baixa um arquivo `.json` com todas as informações e configurações de design do cartão.
    *   **Carregar Configuração:** Permite ao usuário carregar um arquivo `.json` salvo anteriormente para continuar a edição.

## Tecnologias Utilizadas

O projeto é construído com tecnologias 100% Front-end, o que significa que não requer um servidor ou banco de dados para funcionar em seu estado atual.

*   **HTML5**
*   **CSS3** (incluindo Flexbox, Variáveis CSS e Animações)
*   **JavaScript (ES6+)**

## Estrutura do Projeto

```
/
├── editor.html         # O painel de criação e edição do cartão.
├── gerador.js          # A lógica do editor (eventos, pré-visualização, salvar/carregar).
│
├── cartao.html         # O template do cartão final que será preenchido.
├── script-cartao.js    # Script que lê os dados da URL e monta o cartão final.
├── style.css           # Folha de estilo principal para o cartão e seus templates.
│
├── img/                  # Pasta para imagens (como QR codes).
└── README.md             # Este arquivo.
```

## Como Executar

Como este é um projeto puramente front-end, basta abrir o arquivo `editor.html` em qualquer navegador moderno (Chrome, Firefox, Edge, etc.).

## Próximos Passos (Roadmap)

- [ ] Expandir a galeria com mais templates para a frente do cartão (meta: 20+).
- [ ] Implementar um back-end e um banco de dados (ex: NeonDB) para salvar os cartões online.
- [ ] Criar um sistema de contas de usuário para que cada um possa gerenciar seus cartões salvos.
- [ ] Gerar URLs amigáveis para os cartões (ex: `meusite.com/nome-do-cliente`).