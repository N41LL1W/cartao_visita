### Construtor de Templates (`template_builder.html`)

O projeto inclui uma aplicação dedicada para a criação e customização de novos templates de layout, que podem ser salvos e carregados como arquivos `.json`. A interface, em formato de dashboard com menu lateral, permite um fluxo de trabalho organizado e escalável.

**Funcionalidades Principais:**

*   **Interface Organizada:** Um menu lateral permite navegar facilmente entre as seções de edição: Informações, Grid, Fundo, Sobreposição, Conteúdo e Posicionamento.
*   **Editor de Grid Dinâmico:**
    *   Adição e remoção de colunas e linhas em tempo real.
    *   Controle total sobre o dimensionamento de cada trilha do grid (`fr`, `px`, etc.).
*   **Design de Fundo Avançado:**
    *   Suporte para fundos de **Cor Sólida**, **Gradiente** ou **Imagem**.
    *   Controle de opacidade (canal alfa) para cores e imagens.
*   **Sobreposição de Cor (Color Overlay):**
    *   Opção de ativar uma camada de cor semi-transparente sobre o fundo principal.
    *   A sobreposição pode ser uma cor sólida ou um gradiente, com controle total de cores e opacidade.
*   **Gradientes Dinâmicos:**
    *   Capacidade de adicionar e remover cores de um gradiente (com mais de 2 cores), tanto para o fundo quanto para a sobreposição.
*   **Posicionamento de Widgets Interativo:**
    *   Sistema de **Arrastar e Soltar (Drag & Drop)** para posicionar elementos (Nome, Logo, etc.) nas células do grid.
    *   Capacidade de **mover** um widget já posicionado e **remover** arrastando-o de volta ao painel.
    *   Botão para **limpar** todos os widgets do canvas.
*   **Pré-visualização 100% Dinâmica:** Todas as alterações de layout, design e conteúdo padrão são refletidas instantaneamente no canvas de pré-visualização.
*   **Salvar e Carregar Templates:**
    *   Exporta a estrutura completa do template em um arquivo `.json`.
    *   Permite carregar um `.json` de template salvo anteriormente para continuar a edição.
*   **Geração Automática de ID:** O ID do template é gerado automaticamente a partir do nome fornecido, garantindo um formato consistente.