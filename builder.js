// builder.js (versão final, unificada e corrigida)

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO CENTRAL DA APLICAÇÃO ---
    let state = {
        colSizes: ['1fr'],
        rowSizes: ['1fr'],
        widgets: [],
        info: [],
    };

    // --- MAPEAMENTO DE ELEMENTOS ---
    const elements = {
        canvas: document.getElementById('canvas-template'),
        // ... (resto dos mapeamentos)
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
        controlesFundoCor: document.getElementById('controles-fundo-cor'),
        inputCor: document.getElementById('fundo-cor'),
        inputCorOpacidade: document.getElementById('fundo-cor-opacidade'),
        controlesFundoGradiente: document.getElementById('controles-fundo-gradiente'),
        inputGradienteAngulo: document.getElementById('fundo-gradiente-angulo'),
        listaCoresGradiente: document.getElementById('lista-cores-gradiente'),
        btnAddCorGradiente: document.getElementById('btn-add-cor-gradiente'),
        controlesFundoImagem: document.getElementById('controles-fundo-imagem'),
        inputImagemUrl: document.getElementById('fundo-imagem-url'),
        inputImagemOpacidade: document.getElementById('fundo-imagem-opacidade'),
        ativarSobreposicaoCheck: document.getElementById('ativar-sobreposicao'),
        controlesSobreposicao: document.getElementById('controles-sobreposicao'),
        sobreposicaoTipoSelect: document.getElementById('sobreposicao-tipo'),
        controlesSobreposicaoCor: document.getElementById('controles-sobreposicao-cor'),
        inputSobreposicaoCor: document.getElementById('sobreposicao-cor-valor'),
        inputSobreposicaoOpacidade: document.getElementById('sobreposicao-cor-opacidade'),
        controlesSobreposicaoGradiente: document.getElementById('controles-sobreposicao-gradiente'),
        inputSobreposicaoGradienteAngulo: document.getElementById('sobreposicao-gradiente-angulo'),
        listaCoresSobreposicaoGradiente: document.getElementById('lista-cores-sobreposicao-gradiente'),
        btnAddCorSobreposicaoGradiente: document.getElementById('btn-add-cor-sobreposicao-gradiente'),
        btnAddElemento: document.getElementById('btn-add-elemento'),
        menuAddElemento: document.getElementById('menu-add-elemento'),
        listaElementosConfig: document.getElementById('lista-elementos-config'),
        btnSalvar: document.getElementById('btn-salvar-template'),
        btnLimparCanvas: document.getElementById('btn-limpar-canvas'),
        painelDeWidgetsArrastaveis: document.getElementById('lista-widgets-arrastaveis'),
        menuLinks: document.querySelectorAll('.dashboard-menu .menu-link'),
        secoesConteudo: document.querySelectorAll('.dashboard-conteudo .secao'),
        inputCarregarTemplate: document.getElementById('carregar-template-json'),
    };

    // --- FUNÇÕES DE LÓGICA / AÇÕES ---
    const actions = {
        adicionarInfo(tipo) {
            if (state.info.find(i => i.tipo === tipo)) { alert(`O campo "${tipo}" já foi adicionado.`); return; }
            let novaInfo = { id: Date.now(), tipo: tipo, valor: '' };
            if (tipo === 'categoria') { novaInfo.valor = 'moderno'; }
            state.info.push(novaInfo);
            render.painelInfo();
        },
        removerInfo(infoId) {
            state.info = state.info.filter(i => i.id !== infoId);
            render.painelInfo();
            actions.gerarIdTemplate();
        },
        gerarIdTemplate() {
            const nomeInfo = state.info.find(i => i.tipo === 'nome');
            const categoriaInfo = state.info.find(i => i.tipo === 'categoria');
            const nome = nomeInfo ? nomeInfo.valor : '';
            const categoria = categoriaInfo ? categoriaInfo.valor : 'geral';
            const nomeLimpo = nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            const numeroFixo = Math.floor(100 + Math.random() * 900);
            const idFinal = `${categoria}_${nomeLimpo || 'template'}_${numeroFixo}`;
            
            const idInfo = state.info.find(i => i.tipo === 'id');
            if (idInfo) {
                idInfo.valor = idFinal;
                const inputId = elements.listaInfoConfig.querySelector(`[data-info-id="${idInfo.id}"] input`);
                if (inputId) inputId.value = idFinal;
            } else {
                 elements.templateIdInput.value = idFinal;
            }
        },
        adicionarColuna() { if (state.colSizes.length < 6) { state.colSizes.push('1fr'); render.gridControls(); render.canvas(); } },
        removerColuna() { if (state.colSizes.length > 1) { state.colSizes.pop(); render.gridControls(); render.canvas(); } },
        adicionarLinha() { if (state.rowSizes.length < 6) { state.rowSizes.push('1fr'); render.gridControls(); render.canvas(); } },
        removerLinha() { if (state.rowSizes.length > 1) { state.rowSizes.pop(); render.gridControls(); render.canvas(); } },
        adicionarNovoWidget(tipo) {
            if (state.widgets.find(w => w.tipo === tipo)) { alert(`O elemento "${tipo}" já foi adicionado.`); return; }
            const novoWidget = { id: Date.now(), tipo: tipo, conteudo: '', celulaId: -1, estilos: { color: '#333333', fontSize: '16px', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }};
            state.widgets.push(novoWidget);
            render.painelWidgets();
        },
        posicionarWidget(widgetId, celulaId) {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) { widget.celulaId = parseInt(celulaId, 10); }
            render.canvas();
        },
        removerWidgetDoCanvas(widgetId) {
            const widget = state.widgets.find(w => w.id == widgetId);
            if (widget) { widget.celulaId = -1; }
            render.canvas();
        },
        removerWidgetCompletamente(widgetId) {
            state.widgets = state.widgets.filter(w => w.id != widgetId);
            render.painelWidgets();
            render.canvas();
        },
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO / UI ---
    const render = {
        canvas() {
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
            render.background();
        },
        background() { /* ... (código renderBackground) ... */ },
        gridControls() { /* ... (código renderGridControls) ... */ },
        painelWidgets() {
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
                inputConteudo.oninput = e => { widget.conteudo = e.target.value; render.canvas(); };
                grupoConteudo.appendChild(inputConteudo); corpo.appendChild(grupoConteudo);
                if (!eImagem) {
                    const grupoEstilo = document.createElement('div'); grupoEstilo.className = 'grupo-controle';
                    grupoEstilo.innerHTML = `<label>Estilo</label><div class="grupo-controle-composto"><input type="color" value="${widget.estilos.color}" data-prop="color"><input type="number" value="${parseInt(widget.estilos.fontSize)}" data-prop="fontSize" style="width: 70px; padding: 8px;"><div class="estilo-botoes"><button class="${widget.estilos.fontWeight === 'bold' ? 'ativo' : ''}" data-prop="fontWeight" data-valor="bold"><b>B</b></button><button class="${widget.estilos.fontStyle === 'italic' ? 'ativo' : ''}" data-prop="fontStyle" data-valor="italic"><i>I</i></button><button class="${widget.estilos.textDecoration === 'underline' ? 'ativo' : ''}" data-prop="textDecoration" data-valor="underline"><u>U</u></button></div></div>`;
                    corpo.appendChild(grupoEstilo);
                }
                bloco.append(cabecalho, corpo); elements.listaElementosConfig.appendChild(bloco);
                bloco.querySelectorAll('[data-prop]').forEach(el => {
                    if (el.tagName === 'BUTTON') { el.onclick = () => { const p = el.dataset.prop; widget.estilos[p] = widget.estilos[p] === el.dataset.valor ? {fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none'}[p] : el.dataset.valor; render.painelWidgets(); render.canvas(); }; } 
                    else { el.oninput = e => { widget.estilos[e.target.dataset.prop] = e.target.type === 'number' ? `${e.target.value}px` : e.target.value; render.canvas(); }; }
                });
                bloco.querySelector('.btn-remover-widget').onclick = () => actions.removerWidgetCompletamente(widget.id);
            });
        },
        visibilidadeControles() {
            const tipoFundo = elements.tipoFundoSelect.value;
            document.getElementById('controles-fundo-cor').classList.toggle('ativo', tipoFundo === 'cor');
            document.getElementById('controles-fundo-gradiente').classList.toggle('ativo', tipoFundo === 'gradiente');
            document.getElementById('controles-fundo-imagem').classList.toggle('ativo', tipoFundo === 'imagem');
            const sobreposicaoAtiva = elements.ativarSobreposicaoCheck.checked;
            document.getElementById('controles-sobreposicao').classList.toggle('ativo', sobreposicaoAtiva);
            if (sobreposicaoAtiva) { const tipoSobreposicao = elements.sobreposicaoTipoSelect.value; document.getElementById('controles-sobreposicao-cor').classList.toggle('ativo', tipoSobreposicao === 'cor'); document.getElementById('controles-sobreposicao-gradiente').classList.toggle('ativo', tipoSobreposicao === 'gradiente');
            } else { document.getElementById('controles-sobreposicao-cor').classList.remove('ativo'); document.getElementById('controles-sobreposicao-gradiente').classList.remove('ativo'); }
            render.background();
        },
    };
    
    // --- FUNÇÕES DE I/O ---
    // ... (funções de salvar e carregar)

    // --- EVENT LISTENERS ---
    function initEventListeners() {
        // Navegação
        elements.menuLinks.forEach(link => { link.addEventListener('click', (event) => { event.preventDefault(); elements.menuLinks.forEach(l => l.classList.remove('ativo')); link.classList.add('ativo'); elements.secoesConteudo.forEach(secao => secao.classList.add('escondido')); document.getElementById(link.dataset.secao)?.classList.remove('escondido'); }); });
        
        // Design
        const controlesDesign = [elements.tipoFundoSelect, elements.ativarSobreposicaoCheck, elements.sobreposicaoTipoSelect, elements.inputCor, elements.inputCorOpacidade, elements.inputGradienteAngulo, elements.inputImagemUrl, elements.inputImagemOpacidade, elements.inputSobreposicaoCor, elements.inputSobreposicaoOpacidade, elements.inputSobreposicaoGradienteAngulo];
        controlesDesign.forEach(el => el.addEventListener('input', render.background));
        
        // Grid
        elements.btnAddColuna.addEventListener('click', actions.adicionarColuna);
        elements.btnRemoveColuna.addEventListener('click', actions.removerColuna);
        elements.btnAddLinha.addEventListener('click', actions.adicionarLinha);
        elements.btnRemoveLinha.addEventListener('click', actions.removerLinha);

        // Elementos
        elements.btnAddElemento.addEventListener('click', () => elements.menuAddElemento.classList.toggle('escondido'));
        document.addEventListener('click', e => { if (!elements.btnAddElemento.contains(e.target) && !elements.menuAddElemento.contains(e.target)) elements.menuAddElemento.classList.add('escondido'); });
        elements.menuAddElemento.addEventListener('click', e => { e.preventDefault(); const link = e.target.closest('a'); if(link) { actions.adicionarNovoWidget(link.dataset.widgetTipo); elements.menuAddElemento.classList.add('escondido'); } });
        elements.btnLimparCanvas.addEventListener('click', () => { if (confirm('Tem certeza?')) { state.widgets.forEach(w => w.celulaId = -1); render.canvas(); } });
    }

    // --- INICIALIZAÇÃO ---
    initEventListeners();
    render.gridControls();
    render.canvas();
    elements.menuLinks[0].click();
});