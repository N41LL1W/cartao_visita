// modules/grid.js

export function initGridModule(App) {
    const { state, elements, render } = App;

    // Adiciona a função de renderização do grid ao objeto App.render
    render.grid = () => {
        elements.canvas.innerHTML = '';
        elements.canvas.style.gridTemplateColumns = state.colSizes.join(' ');
        elements.canvas.style.gridTemplateRows = state.rowSizes.join(' ');
        
        const totalCells = state.colSizes.length * state.rowSizes.length;
        for (let i = 0; i < totalCells; i++) {
            const celula = document.createElement('div');
            celula.className = 'celula-grid-template';
            celula.dataset.celulaId = i;
            // Adicionamos o listener de drop aqui, que chama a ação de posicionar
            celula.addEventListener('dragover', e => e.preventDefault());
            celula.addEventListener('drop', e => {
                e.preventDefault();
                const widgetId = e.dataTransfer.getData('text/plain');
                App.actions.posicionarWidget(widgetId, i);
            });
            elements.canvas.appendChild(celula);
        }
        // Após desenhar o grid, redesenha os widgets
        if(render.widgets) render.widgets();
    };
    
    // Adiciona as ações do grid ao objeto App.actions
    App.actions = App.actions || {};
    App.actions.adicionarColuna = () => {
        if (state.colSizes.length < 6) {
            state.colSizes.push('1fr');
            render.gridControls();
            render.grid();
        }
    };
    App.actions.removerColuna = () => {
        if (state.colSizes.length > 1) {
            state.colSizes.pop();
            render.gridControls();
            render.grid();
        }
    };
    // ... (ações para adicionar/remover linha)

    // Função para renderizar os controles do grid
    render.gridControls = () => {
        elements.colunaSizesContainer.innerHTML = '';
        state.colSizes.forEach((size, i) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = size;
            input.oninput = (e) => { state.colSizes[i] = e.target.value; render.grid(); };
            elements.colunaSizesContainer.appendChild(input);
        });
        // ... (lógica para renderizar inputs de linha)
    };

    // Conecta os botões às ações
    elements.btnAddColuna.addEventListener('click', App.actions.adicionarColuna);
    elements.btnRemoveColuna.addEventListener('click', App.actions.removerColuna);
    // ... (listeners para botões de linha)
    
    // Renderização inicial
    render.gridControls();
}