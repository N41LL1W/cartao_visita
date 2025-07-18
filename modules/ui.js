// modules/ui.js
import { hexToRgba } from './utils.js';

export function initUI(App) {
    const { state, elements, actions } = App;

    function renderCanvas() {
        elements.canvas.innerHTML = '';
        elements.canvas.style.gridTemplateColumns = state.colSizes.join(' ');
        elements.canvas.style.gridTemplateRows = state.rowSizes.join(' ');
        for (let i = 0; i < state.colSizes.length * state.rowSizes.length; i++) {
            const celula = document.createElement('div');
            celula.className = 'celula-grid-template';
            celula.dataset.celulaId = i;
            celula.addEventListener('dragover', e => { e.preventDefault(); celula.classList.add('drag-over'); });
            celula.addEventListener('dragleave', () => celula.classList.remove('drag-over'));
            celula.addEventListener('drop', e => { e.preventDefault(); celula.classList.remove('drag-over'); actions.posicionarWidget(e.dataTransfer.getData('text/plain'), i); });
            elements.canvas.appendChild(celula);
        }
        state.widgets.forEach(widget => {
            if (widget.celulaId === -1) return;
            const celula = elements.canvas.querySelector(`[data-celula-id='${widget.celulaId}']`);
            if (celula) {
                const widgetElement = document.createElement('div');
                widgetElement.className = `widget-no-canvas widget-tipo-${widget.tipo}`;
                widgetElement.draggable = true;
                widgetElement.dataset.widgetId = widget.id;
                widgetElement.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', widget.id); setTimeout(() => e.target.style.opacity = '0.5', 0); });
                widgetElement.addEventListener('dragend', e => { e.target.style.opacity = '1'; });
                Object.assign(widgetElement.style, widget.estilos);
                if (['logo', 'qrcode'].includes(widget.tipo)) {
                    const img = document.createElement('img');
                    img.src = widget.conteudo || 'https://via.placeholder.com/150/f0f2f5/a0aec0?text=IMAGEM';
                    widgetElement.appendChild(img);
                } else { widgetElement.textContent = widget.conteudo || `[${widget.tipo}]`; }
                celula.innerHTML = ''; celula.appendChild(widgetElement);
            }
        });
        renderBackground();
    }

    function renderBackground() {
        let backgroundLayers = [];
        if (elements.ativarSobreposicaoCheck.checked) {
            const tipo = elements.sobreposicaoTipoSelect.value;
            if (tipo === 'cor') { backgroundLayers.push(hexToRgba(elements.inputSobreposicaoCor.value, elements.inputSobreposicaoOpacidade.value)); } 
            else { const coresArray = Array.from(elements.listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item')).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value)); backgroundLayers.push(`linear-gradient(${elements.inputSobreposicaoGradienteAngulo.value}deg, ${coresArray.join(', ')})`); }
        }
        const tipoFundo = elements.tipoFundoSelect.value; elements.canvas.style.opacity = 1;
        switch (tipoFundo) {
            case 'cor': backgroundLayers.push(hexToRgba(elements.inputCor.value, elements.inputCorOpacidade.value)); break;
            case 'gradiente': const coresArray = Array.from(elements.listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value)); backgroundLayers.push(`linear-gradient(${elements.inputGradienteAngulo.value}deg, ${coresArray.join(', ')})`); break;
            case 'imagem': backgroundLayers.push(`url('${elements.inputImagemUrl.value || ''}') no-repeat center center / cover`); elements.canvas.style.opacity = elements.inputImagemOpacidade.value; break;
        }
        elements.canvas.style.background = backgroundLayers.join(', ');
    }

    function renderGridControls() {
        elements.colunaSizesContainer.innerHTML = '';
        state.colSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.colSizes[i] = e.target.value; renderCanvas(); }); elements.colunaSizesContainer.appendChild(input); });
        elements.linhaSizesContainer.innerHTML = '';
        state.rowSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.rowSizes[i] = e.target.value; renderCanvas(); }); elements.linhaSizesContainer.appendChild(input); });
    }
    
    function renderPainelDeControlesDeWidgets() {
        elements.listaElementosConfig.innerHTML = '';
        state.widgets.forEach(widget => {
            const bloco = document.createElement('div'); bloco.className = 'bloco-config-widget'; bloco.dataset.widgetId = widget.id;
            const eImagem = ['logo', 'qrcode'].includes(widget.tipo);
            const cabecalho = document.createElement('div'); cabecalho.className = 'bloco-cabecalho'; cabecalho.draggable = true;
            cabecalho.innerHTML = `<h4><i class="fas fa-grip-vertical"></i> ${widget.tipo.charAt(0).toUpperCase() + widget.tipo.slice(1)}</h4><button type="button" class="btn-remover-widget">×</button>`;
            cabecalho.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', widget.id));
            const corpo = document.createElement('div'); corpo.className = 'bloco-corpo';
            const grupoConteudo = document.createElement('div'); grupoConteudo.className = `grupo-controle ${eImagem ? 'full-width' : ''}`;
            grupoConteudo.innerHTML = `<label>${eImagem ? `URL da Imagem (${widget.tipo})` : 'Conteúdo do Texto'}</label>`;
            const inputConteudo = document.createElement('input'); inputConteudo.type = 'text'; inputConteudo.value = widget.conteudo;
            inputConteudo.oninput = e => { widget.conteudo = e.target.value; renderCanvas(); };
            grupoConteudo.appendChild(inputConteudo); corpo.appendChild(grupoConteudo);
            if (!eImagem) {
                const grupoEstilo = document.createElement('div'); grupoEstilo.className = 'grupo-controle';
                grupoEstilo.innerHTML = `<label>Estilo</label><div class="grupo-controle-composto"><input type="color" value="${widget.estilos.color}" data-prop="color"><input type="number" value="${parseInt(widget.estilos.fontSize)}" data-prop="fontSize" style="width: 70px; padding: 8px;"><div class="estilo-botoes"><button class="${widget.estilos.fontWeight === 'bold' ? 'ativo' : ''}" data-prop="fontWeight" data-valor="bold"><b>B</b></button><button class="${widget.estilos.fontStyle === 'italic' ? 'ativo' : ''}" data-prop="fontStyle" data-valor="italic"><i>I</i></button><button class="${widget.estilos.textDecoration === 'underline' ? 'ativo' : ''}" data-prop="textDecoration" data-valor="underline"><u>U</u></button></div></div>`;
                corpo.appendChild(grupoEstilo);
            }
            bloco.append(cabecalho, corpo); elements.listaElementosConfig.appendChild(bloco);
            bloco.querySelectorAll('[data-prop]').forEach(el => {
                if (el.tagName === 'BUTTON') { el.onclick = () => { const p = el.dataset.prop; widget.estilos[p] = widget.estilos[p] === el.dataset.valor ? {fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none'}[p] : el.dataset.valor; renderPainelDeControlesDeWidgets(); renderCanvas(); }; } 
                else { el.oninput = e => { widget.estilos[e.target.dataset.prop] = e.target.type === 'number' ? `${e.target.value}px` : e.target.value; renderCanvas(); }; }
            });
            bloco.querySelector('.btn-remover-widget').onclick = () => actions.removerWidgetCompletamente(widget.id);
        });
    }
    
    function atualizarVisibilidadeControles() {
        const tipoFundo = elements.tipoFundoSelect.value;
        document.getElementById('controles-fundo-cor').classList.toggle('ativo', tipoFundo === 'cor');
        document.getElementById('controles-fundo-gradiente').classList.toggle('ativo', tipoFundo === 'gradiente');
        document.getElementById('controles-fundo-imagem').classList.toggle('ativo', tipoFundo === 'imagem');
        const sobreposicaoAtiva = elements.ativarSobreposicaoCheck.checked;
        document.getElementById('controles-sobreposicao').classList.toggle('ativo', sobreposicaoAtiva);
        if (sobreposicaoAtiva) { const tipoSobreposicao = elements.sobreposicaoTipoSelect.value; document.getElementById('controles-sobreposicao-cor').classList.toggle('ativo', tipoSobreposicao === 'cor'); document.getElementById('controles-sobreposicao-gradiente').classList.toggle('ativo', tipoSobreposicao === 'gradiente');
        } else { document.getElementById('controles-sobreposicao-cor').classList.remove('ativo'); document.getElementById('controles-sobreposicao-gradiente').classList.remove('ativo'); }
        renderCanvas();
    }
    
    App.render = {
        canvas: renderCanvas,
        gridControls: renderGridControls,
        widgetControlPanel: renderPainelDeControlesDeWidgets,
        visibilidadeControles: atualizarVisibilidadeControles,
    };
}