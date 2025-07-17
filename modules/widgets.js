// modules/widgets.js

export function initWidgetsModule(App) {
    const { state, elements, render } = App;
    
    // Adiciona a função de renderização de widgets ao objeto App.render
    render.widgets = () => {
        // Primeiro, limpa widgets antigos das células
        elements.canvas.querySelectorAll('.widget-no-canvas').forEach(w => w.remove());
        
        state.widgets.forEach(widget => {
            if (widget.celulaId === -1) return;
            const celula = elements.canvas.querySelector(`[data-celula-id='${widget.celulaId}']`);
            if (celula) {
                const widgetElement = document.createElement('div');
                widgetElement.className = 'widget-no-canvas';
                widgetElement.draggable = true;
                widgetElement.dataset.widgetId = widget.id;
                widgetElement.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', widget.id));
                // ... (lógica para criar o conteúdo do widget com base em widget.conteudo)
                celula.appendChild(widgetElement);
            }
        });
    };
    
    // Adiciona as ações de widget ao objeto App.actions
    App.actions = App.actions || {};
    App.actions.adicionarNovoWidget = (tipo) => {
        if (state.widgets.find(w => w.tipo === tipo)) { /* ... */ }
        const novoWidget = { id: Date.now(), tipo, /* ... */ };
        state.widgets.push(novoWidget);
        render.widgetControlPanel();
    };
    App.actions.posicionarWidget = (widgetId, celulaId) => {
        const widget = state.widgets.find(w => w.id == widgetId);
        if (widget) { widget.celulaId = celulaId; }
        render.widgets();
    };
    // ... (outras ações de widget)

    // Função para renderizar o painel de configuração
    render.widgetControlPanel = () => {
        // ... (lógica para criar o painel de configuração para cada widget no array state.widgets)
    };
    
    // Conecta os botões e menus às ações
    elements.btnAddElemento.addEventListener('click', () => { /* ... */ });
    // ... (outros listeners de widget)
    
    // Renderização inicial
    render.widgetControlPanel();
}