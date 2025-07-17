// modules/ui.js

import { state } from './state.js';
import { hexToRgba } from './utils.js';

let app; // Referência local para o objeto app

function updateCanvas() {
    const { canvas, widgetInputs, ativarSobreposicaoCheck, sobreposicaoTipoSelect, inputSobreposicaoCor, inputSobreposicaoOpacidade, listaCoresSobreposicaoGradiente, inputSobreposicaoGradienteAngulo, tipoFundoSelect, inputCor, inputCorOpacidade, listaCoresGradiente, inputGradienteAngulo, inputImagemUrl, inputImagemOpacidade } = app.elements;
    
    // 1. Limpa e desenha o grid
    canvas.innerHTML = '';
    canvas.style.gridTemplateColumns = state.colSizes.join(' ');
    canvas.style.gridTemplateRows = state.rowSizes.join(' ');
    for (let i = 0; i < state.colSizes.length * state.rowSizes.length; i++) {
        const celula = document.createElement('div');
        celula.className = 'celula-grid-template';
        celula.dataset.celulaId = i;
        celula.addEventListener('dragover', app.events.handleDragOver);
        celula.addEventListener('dragleave', app.events.handleDragLeave);
        celula.addEventListener('drop', app.events.handleDropOnCanvas);
        canvas.appendChild(celula);
    }

    // 2. Renderiza os widgets
    state.widgets.forEach(widget => {
        if (widget.celulaId === -1) return;
        const celula = canvas.querySelector(`[data-celula-id='${widget.celulaId}']`);
        if (celula) {
            const widgetElement = document.createElement('div');
            widgetElement.className = `widget-no-canvas widget-tipo-${widget.tipo}`;
            widgetElement.draggable = true;
            widgetElement.dataset.widgetId = widget.id;
            widgetElement.addEventListener('dragstart', app.events.handleDragStart);
            widgetElement.addEventListener('dragend', e => e.target.style.opacity = '1');
            Object.assign(widgetElement.style, widget.estilos);
            if (['logo', 'qrcode'].includes(widget.tipo)) {
                const img = document.createElement('img');
                img.src = widget.conteudo || 'https://via.placeholder.com/150/f0f2f5/a0aec0?text=IMAGEM';
                widgetElement.appendChild(img);
            } else { widgetElement.textContent = widget.conteudo || `[${widget.tipo}]`; }
            celula.innerHTML = ''; celula.appendChild(widgetElement);
        }
    });

    // 3. Atualiza o fundo
    let bgLayers = [];
    if(ativarSobreposicaoCheck.checked) {
        if(sobreposicaoTipoSelect.value === 'cor') { bgLayers.push(hexToRgba(inputSobreposicaoCor.value, inputSobreposicaoOpacidade.value)); }
        else { const cores = Array.from(listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item')).map(item=>hexToRgba(item.querySelector('input[type=color]').value,item.querySelector('input[type=range]').value)); bgLayers.push(`linear-gradient(${inputSobreposicaoGradienteAngulo.value}deg, ${cores.join(',')})`); }
    }
    if(tipoFundoSelect.value === 'cor') { bgLayers.push(hexToRgba(inputCor.value, inputCorOpacidade.value)); }
    else if(tipoFundoSelect.value === 'gradiente') { const cores = Array.from(listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item=>hexToRgba(item.querySelector('input[type=color]').value,item.querySelector('input[type=range]').value)); bgLayers.push(`linear-gradient(${inputGradienteAngulo.value}deg, ${cores.join(',')})`); }
    else if(tipoFundoSelect.value === 'imagem') { bgLayers.push(`url('${inputImagemUrl.value||''}') no-repeat center center/cover`); canvas.style.opacity = inputImagemOpacidade.value; }
    else { canvas.style.opacity = 1; }
    canvas.style.background = bgLayers.join(',');
}

function renderGridControls() {
    const { colunaSizesContainer, linhaSizesContainer } = app.elements;
    colunaSizesContainer.innerHTML = '';
    state.colSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.colSizes[i] = e.target.value; updateCanvas(); }); colunaSizesContainer.appendChild(input); });
    linhaSizesContainer.innerHTML = '';
    state.rowSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.rowSizes[i] = e.target.value; updateCanvas(); }); linhaSizesContainer.appendChild(input); });
}

// (Adicione aqui as outras funções de UI, como criarControleCorGradiente e renderizarPainelDeControlesDeWidgets)
// ...

export function init(appObject) {
    app = appObject;
    app.methods.updateCanvas = updateCanvas; // Anexa a função ao objeto app
    app.methods.renderGridControls = renderGridControls;
    // ... anexe outras funções de UI que precisam ser chamadas de fora
}