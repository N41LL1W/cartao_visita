// builder.js (versão final, unificada e corrigida)

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO CENTRAL DA APLICAÇÃO ---
    let state = {
        colSizes: ['1fr'],
        rowSizes: ['1fr'],
        widgets: [],
    };

    // --- MAPEAMENTO DE ELEMENTOS ---
    const elements = {
        canvas: document.getElementById('canvas-template'),
        templateNomeInput: document.getElementById('template-nome'),
        templateIdInput: document.getElementById('template-id'),
        templateCategoriaSelect: document.getElementById('template-categoria'),
        contadorCaracteres: document.getElementById('contador-caracteres'),
        btnAddColuna: document.getElementById('btn-add-coluna'),
        btnRemoveColuna: document.getElementById('btn-remove-coluna'),
        colunaSizesContainer: document.getElementById('coluna-sizes-container'),
        btnAddLinha: document.getElementById('btn-add-linha'),
        btnRemoveLinha: document.getElementById('btn-remove-linha'),
        linhaSizesContainer: document.getElementById('linha-sizes-container'),
        tipoFundoSelect: document.getElementById('template-tipo-fundo'),
        inputCor: document.getElementById('fundo-cor'),
        inputCorOpacidade: document.getElementById('fundo-cor-opacidade'),
        inputGradienteAngulo: document.getElementById('fundo-gradiente-angulo'),
        listaCoresGradiente: document.getElementById('lista-cores-gradiente'),
        btnAddCorGradiente: document.getElementById('btn-add-cor-gradiente'),
        inputImagemUrl: document.getElementById('fundo-imagem-url'),
        inputImagemOpacidade: document.getElementById('fundo-imagem-opacidade'),
        ativarSobreposicaoCheck: document.getElementById('ativar-sobreposicao'),
        sobreposicaoTipoSelect: document.getElementById('sobreposicao-tipo'),
        inputSobreposicaoCor: document.getElementById('sobreposicao-cor-valor'),
        inputSobreposicaoOpacidade: document.getElementById('sobreposicao-cor-opacidade'),
        inputSobreposicaoGradienteAngulo: document.getElementById('sobreposicao-gradiente-angulo'),
        listaCoresSobreposicaoGradiente: document.getElementById('lista-cores-sobreposicao-gradiente'),
        btnAddCorSobreposicaoGradiente: document.getElementById('btn-add-cor-sobreposicao-gradiente'),
        btnAddElemento: document.getElementById('btn-add-elemento'),
        menuAddElemento: document.getElementById('menu-add-elemento'),
        listaElementosConfig: document.getElementById('lista-elementos-config'),
        btnSalvar: document.getElementById('btn-salvar-template'),
        painelRemocaoWidgets: document.getElementById('painel-remocao-widgets'),
        menuLinks: document.querySelectorAll('.dashboard-menu .menu-link'),
        secoesConteudo: document.querySelectorAll('.dashboard-conteudo .secao'),
        inputCarregarTemplate: document.getElementById('carregar-template-json'),
    };

    // --- FUNÇÕES AUXILIARES ---
    function hexToRgba(hex, alpha = 1) { let r=0,g=0,b=0;if(hex.length==4){r="0x"+hex[1]+hex[1];g="0x"+hex[2]+hex[2];b="0x"+hex[3]+hex[3];}else if(hex.length==7){r="0x"+hex[1]+hex[2];g="0x"+hex[3]+hex[4];b="0x"+hex[5]+hex[6];} return `rgba(${+r},${+g},${+b},${alpha})`; }

    // --- FUNÇÕES DE RENDERIZAÇÃO (UI) ---
    function renderCanvas() {
        renderGrid();
        renderWidgets();
        renderBackground();
    }
    function renderGrid() {
        elements.canvas.innerHTML = '';
        elements.canvas.style.gridTemplateColumns = state.colSizes.join(' ');
        elements.canvas.style.gridTemplateRows = state.rowSizes.join(' ');
        for (let i = 0; i < state.colSizes.length * state.rowSizes.length; i++) {
            const celula = document.createElement('div');
            celula.className = 'celula-grid-template'; celula.dataset.celulaId = i;
            celula.addEventListener('dragover', e => { e.preventDefault(); celula.classList.add('drag-over'); });
            celula.addEventListener('dragleave', () => celula.classList.remove('drag-over'));
            celula.addEventListener('drop', e => { e.preventDefault(); celula.classList.remove('drag-over'); actions.posicionarWidget(e.dataTransfer.getData('text/plain'), i); });
            elements.canvas.appendChild(celula);
        }
    }
    function renderWidgets() {
        state.widgets.forEach(widget => {
            if (widget.celulaId === -1) return;
            const celula = elements.canvas.querySelector(`[data-celula-id='${widget.celulaId}']`);
            if (celula) {
                const widgetElement = document.createElement('div');
                widgetElement.className = `widget-no-canvas widget-tipo-${widget.tipo}`;
                Object.assign(widgetElement.style, widget.estilos);
                if (['logo', 'qrcode'].includes(widget.tipo)) {
                    const img = document.createElement('img');
                    img.src = widget.conteudo || 'https://via.placeholder.com/150/f0f2f5/a0aec0?text=IMAGEM';
                    widgetElement.appendChild(img);
                } else { widgetElement.textContent = widget.conteudo || `[${widget.tipo}]`; }
                celula.innerHTML = ''; celula.appendChild(widgetElement);
            }
        });
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
        elements.colunaSizesContainer.innerHTML = ''; state.colSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.colSizes[i] = e.target.value; renderCanvas(); }); elements.colunaSizesContainer.appendChild(input); });
        elements.linhaSizesContainer.innerHTML = ''; state.rowSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { state.rowSizes[i] = e.target.value; renderCanvas(); }); elements.linhaSizesContainer.appendChild(input); });
    }
    function renderPainelDeControlesDeWidgets() {
        elements.listaElementosConfig.innerHTML = '';
        state.widgets.forEach(widget => {
            const bloco = document.createElement('div'); bloco.className = 'bloco-config-widget';
            const eImagem = ['logo', 'qrcode'].includes(widget.tipo);
            const cabecalho = document.createElement('div'); cabecalho.className = 'bloco-cabecalho'; cabecalho.draggable = true;
            cabecalho.innerHTML = `<h4><i class="fas fa-grip-vertical"></i> ${widget.tipo.charAt(0).toUpperCase() + widget.tipo.slice(1)}</h4><button type="button" class="btn-remover-widget">×</button>`;
            cabecalho.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', widget.id));
            const corpo = document.createElement('div'); corpo.className = 'bloco-corpo';
            const grupoConteudo = document.createElement('div'); grupoConteudo.className = `grupo-controle ${eImagem ? 'full-width' : ''}`;
            grupoConteudo.innerHTML = `<label>${eImagem ? `URL da Imagem` : 'Conteúdo Padrão'}</label>`;
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
        renderBackground();
    }
    function criarControleCorGradiente(lista, cor, opacidade, minCores) {
        const item = document.createElement('div'); item.className = 'cor-gradiente-item';
        const inputCor = document.createElement('input'); inputCor.type = 'color'; inputCor.value = cor;
        const inputOpacidade = document.createElement('input'); inputOpacidade.type = 'range'; inputOpacidade.min = 0; inputOpacidade.max = 1; inputOpacidade.step = 0.01; inputOpacidade.value = opacidade;
        const btnRemover = document.createElement('button'); btnRemover.type = 'button'; btnRemover.className = 'btn-remover-cor'; btnRemover.innerHTML = '×';
        btnRemover.onclick = () => { if (lista.querySelectorAll('.cor-gradiente-item').length > minCores) { item.remove(); renderBackground(); } else { alert(`O gradiente precisa de pelo menos ${minCores} cores.`); } };
        item.append(inputCor, inputOpacidade, btnRemover); lista.appendChild(item);
    }
    
    // --- FUNÇÕES DE AÇÃO (Lógica de Negócio) ---
    const actions = {
        adicionarColuna: () => { if (state.colSizes.length < 6) { state.colSizes.push('1fr'); renderGridControls(); renderCanvas(); } },
        removerColuna: () => { if (state.colSizes.length > 1) { state.colSizes.pop(); renderGridControls(); renderCanvas(); } },
        adicionarLinha: () => { if (state.rowSizes.length < 6) { state.rowSizes.push('1fr'); renderGridControls(); renderCanvas(); } },
        removerLinha: () => { if (state.rowSizes.length > 1) { state.rowSizes.pop(); renderGridControls(); renderCanvas(); } },
        adicionarNovoWidget: (tipo) => {
            if (state.widgets.find(w => w.tipo === tipo)) { alert(`O elemento "${tipo}" já foi adicionado.`); return; }
            const novoWidget = { id: Date.now(), tipo: tipo, conteudo: '', celulaId: -1, estilos: { color: '#333333', fontSize: '16px', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }};
            state.widgets.push(novoWidget);
            renderPainelDeControlesDeWidgets();
        },
        posicionarWidget: (widgetId, celulaId) => {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) { widget.celulaId = parseInt(celulaId, 10); }
            renderCanvas();
        },
        removerWidgetDoCanvas: (widgetId) => {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) {
                widget.celulaId = -1;
                renderCanvas();
            }
        },
        removerWidgetCompletamente: (widgetId) => {
            state.widgets = state.widgets.filter(w => w.id != widgetId);
            renderPainelDeControlesDeWidgets();
            renderCanvas();
        },
        gerarIdTemplate: () => {
            const nome = elements.templateNomeInput.value;
            const categoria = elements.templateCategoriaSelect.value;
            const nomeLimpo = nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            const numeroFixo = Math.floor(100 + Math.random() * 900);
            elements.templateIdInput.value = `${categoria}_${nomeLimpo || 'template'}_${numeroFixo}`;
        }
    };
    
    // --- FUNÇÕES DE I/O ---
    function gerarJSONdoTemplate() { /* ... código gerarJSONdoTemplate ... */ }
    function carregarTemplate(templateData) { /* ... código carregarTemplate ... */ }
    
    // --- EVENT LISTENERS ---
    function inicializarEventListeners() {
        elements.menuLinks.forEach(link => { link.addEventListener('click', (event) => { event.preventDefault(); elements.menuLinks.forEach(l => l.classList.remove('ativo')); link.classList.add('ativo'); elements.secoesConteudo.forEach(secao => secao.classList.add('escondido')); document.getElementById(link.dataset.secao)?.classList.remove('escondido'); }); });
        
        const controlesDesign = [elements.tipoFundoSelect, elements.ativarSobreposicaoCheck, elements.sobreposicaoTipoSelect];
        controlesDesign.forEach(el => el.addEventListener('change', atualizarVisibilidadeControles));
        
        const controlesInputDeDesign = [elements.inputCor, elements.inputCorOpacidade, elements.inputGradienteAngulo, elements.inputImagemUrl, elements.inputImagemOpacidade, elements.inputSobreposicaoCor, elements.inputSobreposicaoOpacidade, elements.inputSobreposicaoGradienteAngulo];
        controlesInputDeDesign.forEach(el => el.addEventListener('input', renderBackground));
        
        elements.btnAddCorGradiente.addEventListener('click', () => criarControleCorGradiente(elements.listaCoresGradiente, '#ffffff', 1.0, 2));
        elements.btnAddCorSobreposicaoGradiente.addEventListener('click', () => criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.5, 2));
        
        elements.btnAddColuna.addEventListener('click', actions.adicionarColuna);
        elements.btnRemoveColuna.addEventListener('click', actions.removerColuna);
        elements.btnAddLinha.addEventListener('click', actions.adicionarLinha);
        elements.btnRemoveLinha.addEventListener('click', actions.removerLinha);
        
        elements.btnAddElemento.addEventListener('click', () => elements.menuAddElemento.classList.toggle('escondido'));
        document.addEventListener('click', e => { if (!elements.btnAddElemento.contains(e.target) && !elements.menuAddElemento.contains(e.target)) elements.menuAddElemento.classList.add('escondido'); });
        elements.menuAddElemento.addEventListener('click', e => { e.preventDefault(); const link = e.target.closest('a'); if(link) { actions.adicionarNovoWidget(link.dataset.widgetTipo); elements.menuAddElemento.classList.add('escondido'); } });
        
        // Listener para a lixeira
        elements.painelRemocaoWidgets.addEventListener('dragover', e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); });
        elements.painelRemocaoWidgets.addEventListener('dragleave', () => e.currentTarget.classList.remove('drag-over'));
        elements.painelRemocaoWidgets.addEventListener('drop', e => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); actions.removerWidgetCompletamente(e.dataTransfer.getData('text/plain')); });

        elements.templateNomeInput.addEventListener('input', () => {
            const v = elements.templateNomeInput.value.replace(/[^a-zA-Z0-9\s]/g, '');
            elements.templateNomeInput.value = v;
            elements.contadorCaracteres.textContent = `(${v.length}/30)`;
            actions.gerarIdTemplate();
        });
        elements.templateCategoriaSelect.addEventListener('change', actions.gerarIdTemplate);
        
        elements.btnSalvar.addEventListener('click', () => { /* ... (código de salvar) ... */ });
        elements.inputCarregarTemplate.addEventListener('change', e => { /* ... (código de carregar) ... */ });
    }

    // --- INICIALIZAÇÃO ---
    inicializarEventListeners();
    criarControleCorGradiente(elements.listaCoresGradiente, '#6a89cc', 1.0, 2);
    criarControleCorGradiente(elements.listaCoresGradiente, '#3d3bbe', 1.0, 2);
    criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.1, 2);
    criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.6, 2);
    renderGridControls();
    atualizarVisibilidadeControles();
    actions.gerarIdTemplate();
    elements.menuLinks[0].click();
});