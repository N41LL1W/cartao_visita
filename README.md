## Funcionalidades Atuais

O sistema é dividido em duas ferramentas principais: o **Editor de Cartões** e o **Construtor de Templates**.

### Editor de Cartões (`editor.html`)

*   **Interface Intuitiva:** Um painel de controle com pré-visualização ao vivo do cartão (frente e verso).
*   **Preenchimento de Dados:** Campos para todas as informações do usuário (nome, profissão, contato, etc.).
*   **Seleção de Templates:**
    *   Uma galeria com templates de design pré-definidos para a frente do cartão, com paginação e filtros.
    *   **Carregamento de Template Customizado:** Permite carregar um arquivo `.json` (criado no Construtor) para usar um layout totalmente personalizado.
*   **Customização de Design:** Controles avançados para cores, gradientes e opacidade do fundo e dos elementos do template.
*   **Exportação:**
    *   **Salvar Configuração:** Gera um arquivo `.json` com todos os dados do usuário e as configurações de design escolhidas.
    *   **Gerar Cartão:** Abre o cartão final em uma nova aba, pronto para ser compartilhado.

### Construtor de Templates (`template_builder.html`)

Uma ferramenta poderosa para criar e exportar novos layouts de cartão.

*   **Editor de Grid Dinâmico:** Adição, remoção e dimensionamento de colunas e linhas em tempo real.
*   **Posicionamento de Widgets:** Sistema de "Arrastar e Soltar" para posicionar elementos (Nome, Logo, etc.) nas células do grid. Permite mover, remover e limpar os widgets do canvas.
*   **Design de Fundo e Sobreposição:** Controle total sobre o fundo (cor, gradiente, imagem) e uma camada de sobreposição opcional para criar efeitos visuais e garantir legibilidade.
*   **Pré-visualização Dinâmica:** Todas as alterações são refletidas instantaneamente no canvas de pré-visualização.
*   **Exportação de Template:** Salva a estrutura completa do layout (grid, fundo, widgets, conteúdo padrão) em um arquivo `.json` otimizado para ser usado no Editor de Cartões.