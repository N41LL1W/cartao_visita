### Ferramentas de Criação de Templates (`template_builder.html`)

O projeto agora inclui uma página dedicada para a criação e customização de novos templates de layout, que podem ser salvos como arquivos `.json`. As principais funcionalidades são:

*   **Editor de Grid Dinâmico:**
    *   Adição e remoção de colunas e linhas em tempo real com botões `+` e `-`.
    *   Controle total sobre o dimensionamento de cada trilha do grid, suportando unidades flexíveis (`fr`) e fixas (`px`).
*   **Posicionamento de Widgets Interativo:**
    *   Sistema de **Arrastar e Soltar (Drag & Drop)** para posicionar elementos (Nome, Logo, QR Code, etc.) nas células do grid.
    *   Capacidade de **mover** um widget já posicionado para outra célula.
    *   Capacidade de **remover** um widget do cartão, arrastando-o de volta para o painel de ferramentas.
    *   Botão para **limpar** todos os widgets do canvas de uma vez.
*   **Design de Fundo Avançado:**
    *   Suporte para fundos de **Cor Sólida**, **Gradiente** ou **Imagem**.
    *   Controle de opacidade (canal alfa) para cores e imagens.
*   **Sobreposição de Cor (Color Overlay):**
    *   Opção de ativar uma camada de cor semi-transparente sobre o fundo principal para criar efeitos visuais e garantir legibilidade.
    *   A sobreposição pode ser uma cor sólida ou um gradiente, ambos com controle total de opacidade e cores.
*   **Gradientes Dinâmicos:**
    *   Capacidade de adicionar e remover cores de um gradiente, tanto para o fundo quanto para a sobreposição.
*   **Pré-visualização 100% Dinâmica:** Todas as alterações de layout, design e conteúdo padrão são refletidas instantaneamente no canvas de pré-visualização, criando um fluxo de trabalho WYSIWYG ("What You See Is What You Get").
*   **Exportação e Conteúdo Padrão:**
    *   Salva a estrutura completa do layout, design, posição dos widgets e o conteúdo padrão definido em um arquivo `.json`.
    *   Geração automática de ID para o template a partir do nome fornecido.