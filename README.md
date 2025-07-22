### Construtor de Templates (`template_builder.html`)

O projeto inclui uma aplicação dedicada para a criação e customização de novos templates de layout, que podem ser salvos e carregados como arquivos `.json`.

*   **Arquitetura Modular (ES6):** Para garantir a manutenibilidade e escalabilidade, o código do construtor foi refatorado em múltiplos módulos JavaScript. Um script principal (`main.js`) orquestra módulos especializados em:
    *   **Estado:** Gerencia os dados do template (`state.js`).
    *   **UI:** Controla toda a renderização visual (`ui.js`).
    *   **Ações:** Define a lógica que modifica o estado (`actions.js`).
    *   **Eventos:** Conecta as interações do usuário às ações (`events.js`).
    *   **I/O:** Lida com o salvamento e carregamento de arquivos (`io.js`).
*   **Interface Estilo Dashboard:** Uma navegação com menu lateral permite alternar facilmente entre as seções de edição: Informações, Grid, Fundo, Sobreposição e Elementos.
*   **Editor de Grid Dinâmico:** Permite adicionar, remover e dimensionar colunas e linhas em tempo real.
*   **Sistema de Widgets Dinâmicos:**
    *   Elementos (Nome, Logo, etc.) podem ser adicionados dinamicamente ao projeto.
    *   Cada elemento gera um painel de controle para customizar seu conteúdo e estilo (cor, tamanho da fonte, negrito, etc.).
    *   Sistema de **Arrastar e Soltar (Drag & Drop)** para posicionar, mover e remover widgets do canvas de pré-visualização.
*   **Design de Fundo e Sobreposição Avançados:** Suporte completo para cores sólidas, gradientes com múltiplas cores e controle de opacidade.
*   **Pré-visualização 100% Dinâmica:** Todas as alterações são refletidas instantaneamente no canvas.
*   **Salvar e Carregar Templates:** Exporta e importa a estrutura completa do template em formato `.json`.
## Próximos Passos (Roadmap)

- [x] **Finalizar a Refatoração do Construtor de Templates:**
    - [x] Garantir que a arquitetura unificada (`builder.js`) funcione de forma estável.
    - [x] Implementar um sistema de widgets dinâmicos, onde elementos podem ser adicionados, configurados e estilizados individualmente.
    - [x] Corrigir a interatividade do Drag & Drop para posicionar e remover widgets no canvas.
- [ ] Implementar um back-end e um banco de dados (ex: NeonDB) para salvar os cartões online.
- [ ] Criar um sistema de contas de usuário.
- [ ] Gerar URLs amigáveis para os cartões.