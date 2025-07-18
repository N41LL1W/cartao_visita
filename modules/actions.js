// modules/actions.js
export function initActions(App) {
    const { state, render, elements } = App;

    const actions = {
        renderizarTudo: () => {
            render.gridControls();
            render.widgetControlPanel();
            render.canvas();
        },
        adicionarColuna: () => { if (state.colSizes.length < 6) { state.colSizes.push('1fr'); actions.renderizarTudo(); } },
        removerColuna: () => { if (state.colSizes.length > 1) { state.colSizes.pop(); actions.renderizarTudo(); } },
        adicionarLinha: () => { if (state.rowSizes.length < 6) { state.rowSizes.push('1fr'); actions.renderizarTudo(); } },
        removerLinha: () => { if (state.rowSizes.length > 1) { state.rowSizes.pop(); actions.renderizarTudo(); } },
        adicionarNovoWidget: (tipo) => {
            if (state.widgets.find(w => w.tipo === tipo)) { alert(`O elemento "${tipo}" já foi adicionado.`); return; }
            const novoWidget = { id: Date.now(), tipo: tipo, conteudo: '', celulaId: -1, estilos: { color: '#333333', fontSize: '16px', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }};
            state.widgets.push(novoWidget);
            render.widgetControlPanel();
        },
        posicionarWidget: (widgetId, celulaId) => {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) { widget.celulaId = parseInt(celulaId, 10); }
            render.canvas();
        },
        removerWidgetDoCanvas: (widgetId) => {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) { widget.celulaId = -1; }
            render.canvas();
        },
        removerWidgetCompletamente: (widgetId) => {
            state.widgets = state.widgets.filter(w => w.id !== widgetId);
            actions.renderizarTudo();
        },
        limparWidgetsDoCanvas: () => {
            if (confirm('Tem certeza que deseja remover todos os itens posicionados?')) {
                state.widgets.forEach(w => w.celulaId = -1);
                render.canvas();
            }
        },
        criarControleCorGradiente: (lista, cor, opacidade, minCores = 2) => {
            const item = document.createElement('div'); item.className = 'cor-gradiente-item';
            const inputCor = document.createElement('input'); inputCor.type = 'color'; inputCor.value = cor;
            const inputOpacidade = document.createElement('input'); inputOpacidade.type = 'range'; inputOpacidade.min = 0; inputOpacidade.max = 1; inputOpacidade.step = 0.01; inputOpacidade.value = opacidade;
            const btnRemover = document.createElement('button'); btnRemover.type = 'button'; btnRemover.className = 'btn-remover-cor'; btnRemover.innerHTML = '×';
            btnRemover.onclick = () => { if (lista.querySelectorAll('.cor-gradiente-item').length > minCores) { item.remove(); actions.renderizarTudo(); } else { alert(`O gradiente precisa de pelo menos ${minCores} cores.`); } };
            item.append(inputCor, inputOpacidade, btnRemover); lista.appendChild(item);
        },
        inicializarControlesDeCor: () => {
            actions.criarControleCorGradiente(elements.listaCoresGradiente, '#6a89cc', 1.0);
            actions.criarControleCorGradiente(elements.listaCoresGradiente, '#3d3bbe', 1.0);
            actions.criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.1);
            actions.criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.6);
        }
    };
    App.actions = actions;
}