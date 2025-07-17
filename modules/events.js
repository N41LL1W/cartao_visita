// modules/events.js
import { state } from './state.js';

let app; // Referência local

// Funções de handler para os eventos
export function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.widgetId);
    setTimeout(() => event.target.style.opacity = '0.5', 0);
}
export function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}
export function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}
export function handleDropOnCanvas(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const widgetId = event.dataTransfer.getData('text/plain');
    const celulaId = parseInt(event.currentTarget.dataset.celulaId, 10);
    app.methods.adicionarWidgetAoCanvas(widgetId, celulaId);
}
// (Adicione aqui outras funções de evento: remover, limpar, etc.)

function setupDashboardNavigation() {
    const { menuLinks, secoesConteudo } = app.elements;
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            secoesConteudo.forEach(s => s.classList.add('escondido'));
            document.getElementById(link.dataset.secao)?.classList.remove('escondido');
        });
    });
}

export function init(appObject) {
    app = appObject;
    
    // Anexa as funções de handler ao objeto app para que o ui.js possa usá-las
    app.events.handleDragStart = handleDragStart;
    app.events.handleDragOver = handleDragOver;
    app.events.handleDragLeave = handleDragLeave;
    app.events.handleDropOnCanvas = handleDropOnCanvas;

    // Configura todos os listeners da página
    const { painelControles, btnAddColuna, btnSalvar } = app.elements;
    painelControles.addEventListener('input', app.methods.updateCanvas);
    btnAddColuna.addEventListener('click', app.methods.adicionarColuna);
    btnSalvar.addEventListener('click', app.methods.salvarTemplate);
    setupDashboardNavigation();

    // Ativa a primeira aba
    app.elements.menuLinks[0].click();
}