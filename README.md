### Ferramentas de Criação de Templates (`template_builder.html`)

O projeto agora inclui uma página dedicada para a criação e customização de novos templates de layout, que podem ser salvos como arquivos `.json`. As principais funcionalidades são:

*   **Editor de Grid Dinâmico:**
    *   Adição e remoção de colunas e linhas em tempo real.
    *   Controle total sobre o dimensionamento de cada trilha do grid, suportando unidades flexíveis (`fr`) e fixas (`px`).
*   **Design de Fundo Avançado:**
    *   Suporte para fundos de **Cor Sólida**, **Gradiente** ou **Imagem**.
    *   Controle de opacidade (canal alfa) para cores e imagens.
*   **Sobreposição de Cor (Color Overlay):**
    *   Opção de ativar uma camada de cor semi-transparente sobre o fundo principal.
    *   A sobreposição pode ser uma cor sólida ou um gradiente, ambos com controle total de opacidade e cores.
    *   Permite a criação de efeitos modernos (como o "duotone" do Instagram) e garante a legibilidade do texto sobre qualquer fundo.
*   **Gradientes Dinâmicos:**
    *   Capacidade de adicionar e remover cores de um gradiente, indo além do padrão de duas cores.
*   **Pré-visualização em Tempo Real:** Todas as alterações de layout e design são refletidas instantaneamente em um canvas de pré-visualização.
*   **Exportação de Template:** Salva a estrutura completa do layout, fundo e sobreposição em um arquivo `.json` bem definido.
*   **Geração Automática de ID:** O ID do template é gerado automaticamente a partir do nome fornecido, garantindo um formato consistente.