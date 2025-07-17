// modules/io.js
import { state } from './state.js';
import { elements } from '../main.js';
import { updateCanvas, renderGridControls, renderWidgetControlPanel } from './ui.js';

export function gerarJSONdoTemplate() {
    // Pega os valores dos inputs de design
    // ...
    return {
        estruturaGrid: { colunas: state.colSizes, linhas: state.rowSizes },
        widgets: state.widgets,
        // ...fundo, sobreposição, etc.
    };
}

export function carregarTemplate(templateData) {
    state.colSizes = templateData.estruturaGrid.colunas || ['1fr'];
    state.rowSizes = templateData.estruturaGrid.linhas || ['1fr'];
    state.widgets = templateData.widgets || [];

    // Preenche os inputs de design e conteúdo
    // ...

    renderGridControls();
    renderWidgetControlPanel();
    updateCanvas();
    alert('Template carregado!');
}

export function salvarTemplate() {
    const dados = gerarJSONdoTemplate();
    if (!dados.id) { /* ... validação ... */ }
    // ... lógica de download
}