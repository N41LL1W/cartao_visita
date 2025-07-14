// builder.js (versão completa com todas as funcionalidades)

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DO PROJETO ---
    let colSizes = ['1fr'];
    let rowSizes = ['1fr'];
    let widgetsNoCanvas = []; // Armazena os widgets que estão no canvas [{ tipo: 'nome', celulaId: 0 }]

    // --- MAPEAMENTO DE ELEMENTOS ---
    const canvas = document.getElementById('canvas-template');
    const painelControles = document.querySelector('.painel-controles');
    // Info Template
    const templateIdInput = document.getElementById('template-id');
    const templateNomeInput = document.getElementById('template-nome');
    const templateCategoriaSelect = document.getElementById('template-categoria');
    // Grid
    const btnAddColuna = document.getElementById('btn-add-coluna');
    const btnRemoveColuna = document.getElementById('btn-remove-coluna');
    const colunaSizesContainer = document.getElementById('coluna-sizes-container');
    const btnAddLinha = document.getElementById('btn-add-linha');
    const btnRemoveLinha = document.getElementById('btn-remove-linha');
    const linhaSizesContainer = document.getElementById('linha-sizes-container');
    // Fundo
    const tipoFundoSelect = document.getElementById('template-tipo-fundo');
    const controlesCor = document.getElementById('controles-fundo-cor');
    const inputCor = document.getElementById('fundo-cor');
    const inputCorOpacidade = document.getElementById('fundo-cor-opacidade');
    const controlesGradiente = document.getElementById('controles-fundo-gradiente');
    const inputGradienteAngulo = document.getElementById('fundo-gradiente-angulo');
    const listaCoresGradiente = document.getElementById('lista-cores-gradiente');
    const btnAddCorGradiente = document.getElementById('btn-add-cor-gradiente');
    const controlesImagem = document.getElementById('controles-fundo-imagem');
    const inputImagemUrl = document.getElementById('fundo-imagem-url');
    const inputImagemOpacidade = document.getElementById('fundo-imagem-opacidade');
    // Sobreposição
    const ativarSobreposicaoCheck = document.getElementById('ativar-sobreposicao');
    const controlesSobreposicao = document.getElementById('controles-sobreposicao');
    const sobreposicaoTipoSelect = document.getElementById('sobreposicao-tipo');
    const controlesSobreposicaoCor = document.getElementById('controles-sobreposicao-cor');
    const inputSobreposicaoCor = document.getElementById('sobreposicao-cor-valor');
    const inputSobreposicaoOpacidade = document.getElementById('sobreposicao-cor-opacidade');
    const controlesSobreposicaoGradiente = document.getElementById('controles-sobreposicao-gradiente');
    const inputSobreposicaoGradienteAngulo = document.getElementById('sobreposicao-gradiente-angulo');
    const listaCoresSobreposicaoGradiente = document.getElementById('lista-cores-sobreposicao-gradiente');
    const btnAddCorSobreposicaoGradiente = document.getElementById('btn-add-cor-sobreposicao-gradiente');
    // Widgets e Conteúdo
    const widgetsArrastaveis = document.querySelectorAll('.widget-arrastavel');
    const widgetInputs = {
        nome: document.getElementById('widget-nome'),
        profissao: document.getElementById('widget-profissao'),
        contato: document.getElementById('widget-contato'),
        endereco: document.getElementById('widget-endereco'),
        logo: document.getElementById('widget-logo'),
        qrcode: document.getElementById('widget-qrcode'),
    };
    // Ações
    const btnSalvar = document.getElementById('btn-salvar-template');
    const btnLimparCanvas = document.getElementById('btn-limpar-canvas');
    const painelDeWidgets = document.getElementById('lista-widgets-arrastaveis');

    // --- FUNÇÕES AUXILIARES ---
    function hexToRgba(hex, alpha = 1) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; } 
        else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
        return `rgba(${+r}, ${+g}, ${+b}, ${alpha})`;
    }

    // --- FUNÇÃO CENTRAL DE RENDERIZAÇÃO ---
    function updateCanvas() {
        // 1. Limpa o canvas e desenha o Grid
        canvas.innerHTML = '';
        canvas.style.gridTemplateColumns = colSizes.join(' ');
        canvas.style.gridTemplateRows = rowSizes.join(' ');
        const totalCells = colSizes.length * rowSizes.length;
        for (let i = 0; i < totalCells; i++) {
            const celula = document.createElement('div');
            celula.className = 'celula-grid-template';
            celula.dataset.celulaId = i;
            celula.addEventListener('dragover', e => { e.preventDefault(); celula.classList.add('drag-over'); });
            celula.addEventListener('dragleave', () => celula.classList.remove('drag-over'));
            celula.addEventListener('drop', e => { e.preventDefault(); celula.classList.remove('drag-over'); const tipoWidget = e.dataTransfer.getData('text/plain'); adicionarWidgetAoCanvas(tipoWidget, i); });
            canvas.appendChild(celula);
        }

        // 2. Renderiza os widgets que já estão no estado `widgetsNoCanvas` com o conteúdo atual
        widgetsNoCanvas.forEach(widget => {
            const celula = canvas.querySelector(`[data-celula-id='${widget.celulaId}']`);
            if (celula) {
                const tipo = widget.tipo;
                const widgetElement = document.createElement('div');
                widgetElement.className = `widget-no-canvas widget-tipo-${tipo}`;
                widgetElement.draggable = true;
                widgetElement.dataset.widgetTipo = tipo;
                widgetElement.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', tipo);
                    setTimeout(() => e.target.style.opacity = '0.5', 0);
                });
                widgetElement.addEventListener('dragend', e => {
                    e.target.style.opacity = '1'; // Restaura a opacidade ao final do arrasto
                });
                const inputOrigem = widgetInputs[tipo];
                const conteudo = inputOrigem.value || inputOrigem.placeholder;
                if (tipo === 'logo' || tipo === 'qrcode') {
                    const img = document.createElement('img');
                    img.src = conteudo || 'https://via.placeholder.com/150/f0f2f5/a0aec0?text=IMAGEM';
                    img.alt = tipo;
                    widgetElement.appendChild(img);
                } else {
                    widgetElement.textContent = conteudo;
                }
                celula.innerHTML = '';
                celula.appendChild(widgetElement);
            }
        });

        // 3. Atualiza o Fundo e a Sobreposição
        let backgroundLayers = [];
        if (ativarSobreposicaoCheck.checked) {
            const tipo = sobreposicaoTipoSelect.value;
            if (tipo === 'cor') {
                backgroundLayers.push(hexToRgba(inputSobreposicaoCor.value, inputSobreposicaoOpacidade.value));
            } else {
                const coresArray = Array.from(listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item')).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value));
                backgroundLayers.push(`linear-gradient(${inputSobreposicaoGradienteAngulo.value}deg, ${coresArray.join(', ')})`);
            }
        }
        const tipoFundo = tipoFundoSelect.value;
        canvas.style.opacity = 1;
        switch (tipoFundo) {
            case 'cor':
                backgroundLayers.push(hexToRgba(inputCor.value, inputCorOpacidade.value));
                break;
            case 'gradiente':
                const coresArray = Array.from(listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value));
                backgroundLayers.push(`linear-gradient(${inputGradienteAngulo.value}deg, ${coresArray.join(', ')})`);
                break;
            case 'imagem':
                backgroundLayers.push(`url('${inputImagemUrl.value || ''}') no-repeat center center / cover`);
                canvas.style.opacity = inputImagemOpacidade.value;
                break;
        }
        canvas.style.background = backgroundLayers.join(', ');
    }

    function renderGridControls() {
        colunaSizesContainer.innerHTML = '';
        colSizes.forEach((size, i) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = size;
            input.addEventListener('input', e => { colSizes[i] = e.target.value; updateCanvas(); });
            colunaSizesContainer.appendChild(input);
        });
        linhaSizesContainer.innerHTML = '';
        rowSizes.forEach((size, i) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = size;
            input.addEventListener('input', e => { rowSizes[i] = e.target.value; updateCanvas(); });
            linhaSizesContainer.appendChild(input);
        });
    }

    function atualizarVisibilidadeControles() {
        const tipoFundo = tipoFundoSelect.value;
        controlesCor.classList.toggle('ativo', tipoFundo === 'cor');
        controlesGradiente.classList.toggle('ativo', tipoFundo === 'gradiente');
        controlesImagem.classList.toggle('ativo', tipoFundo === 'imagem');
        const sobreposicaoAtiva = ativarSobreposicaoCheck.checked;
        controlesSobreposicao.classList.toggle('ativo', sobreposicaoAtiva);
        if (sobreposicaoAtiva) {
            const tipoSobreposicao = sobreposicaoTipoSelect.value;
            controlesSobreposicaoCor.classList.toggle('ativo', tipoSobreposicao === 'cor');
            controlesSobreposicaoGradiente.classList.toggle('ativo', tipoSobreposicao === 'gradiente');
        } else {
            controlesSobreposicaoCor.classList.remove('ativo');
            controlesSobreposicaoGradiente.classList.remove('ativo');
        }
        updateCanvas();
    }

    function criarControleCorGradiente(lista, cor = '#000000', opacidade = 1.0, minCores = 2) {
        const item = document.createElement('div');
        item.className = 'cor-gradiente-item';
        const inputCor = document.createElement('input');
        inputCor.type = 'color';
        inputCor.value = cor;
        const inputOpacidade = document.createElement('input');
        inputOpacidade.type = 'range';
        inputOpacidade.min = 0;
        inputOpacidade.max = 1;
        inputOpacidade.step = 0.01;
        inputOpacidade.value = opacidade;
        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.className = 'btn-remover-cor';
        btnRemover.innerHTML = '×';
        btnRemover.onclick = () => {
            if (lista.querySelectorAll('.cor-gradiente-item').length > minCores) {
                item.remove();
                updateCanvas();
            } else {
                alert(`O gradiente precisa de pelo menos ${minCores} cores.`);
            }
        };
        item.append(inputCor, inputOpacidade, btnRemover);
        lista.appendChild(item);
    }
    
    // --- LÓGICA DO CONSTRUTOR ---
    function adicionarWidgetAoCanvas(tipo, celulaId) {
        widgetsNoCanvas = widgetsNoCanvas.filter(w => w.tipo !== tipo);
        widgetsNoCanvas.push({ tipo: tipo, celulaId: parseInt(celulaId, 10) });
        updateCanvas();
    }

    function removerWidgetDoCanvas(tipo) {
        widgetsNoCanvas = widgetsNoCanvas.filter(w => w.tipo !== tipo);
        updateCanvas();
    }
    
    // --- FUNÇÃO PARA SALVAR O TEMPLATE ---
    function gerarJSONdoTemplate() {
        let fundoConfig = { tipo: tipoFundoSelect.value };
        switch (fundoConfig.tipo) {
            case 'cor': fundoConfig.cor = inputCor.value; fundoConfig.opacidade = inputCorOpacidade.value; break;
            case 'gradiente': fundoConfig.angulo = inputGradienteAngulo.value; fundoConfig.cores = Array.from(listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item => ({ cor: item.querySelector('input[type="color"]').value, opacidade: item.querySelector('input[type="range"]').value })); break;
            case 'imagem': fundoConfig.url = inputImagemUrl.value; fundoConfig.opacidade = inputImagemOpacidade.value; break;
        }
        let sobreposicaoConfig = { ativa: ativarSobreposicaoCheck.checked };
        if (sobreposicaoConfig.ativa) {
            sobreposicaoConfig.tipo = sobreposicaoTipoSelect.value;
            if (sobreposicaoConfig.tipo === 'cor') {
                sobreposicaoConfig.cor = inputSobreposicaoCor.value;
                sobreposicaoConfig.opacidade = inputSobreposicaoOpacidade.value;
            } else {
                sobreposicaoConfig.angulo = inputSobreposicaoGradienteAngulo.value;
                sobreposicaoConfig.cores = Array.from(listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item')).map(item => ({ cor: item.querySelector('input[type="color"]').value, opacidade: item.querySelector('input[type="range"]').value }));
            }
        }
        let conteudoPadrao = {};
        for (const [key, input] of Object.entries(widgetInputs)) {
            if (input.value) conteudoPadrao[key] = input.value;
        }
        return {
            id: templateIdInput.value,
            nome: templateNomeInput.value,
            categoria: templateCategoriaSelect.value,
            estruturaGrid: { colunas: colSizes, linhas: rowSizes },
            fundo: fundoConfig,
            sobreposicao: sobreposicaoConfig,
            widgets: widgetsNoCanvas,
            conteudoPadrao: conteudoPadrao,
        };
    }
    
    // --- EVENT LISTENERS ---
    painelControles.addEventListener('input', updateCanvas);
    tipoFundoSelect.addEventListener('change', atualizarVisibilidadeControles);
    ativarSobreposicaoCheck.addEventListener('change', atualizarVisibilidadeControles);
    sobreposicaoTipoSelect.addEventListener('change', atualizarVisibilidadeControles);
    btnAddCorGradiente.addEventListener('click', () => criarControleCorGradiente(listaCoresGradiente, '#ffffff', 1.0));
    btnAddCorSobreposicaoGradiente.addEventListener('click', () => criarControleCorGradiente(listaCoresSobreposicaoGradiente, '#000000', 0.5));
    btnSalvar.addEventListener('click', () => {
        const dados = gerarJSONdoTemplate();
        if (!dados.id || !dados.nome) {
            alert("Por favor, preencha o Nome do Template para gerar o ID antes de salvar.");
            return;
        }
        const nomeArquivo = `${dados.id}.json`;
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nomeArquivo;
        a.click();
        URL.revokeObjectURL(a.href);
    });
    btnAddColuna.addEventListener('click', () => { if (colSizes.length < 6) { colSizes.push('1fr'); renderGridControls(); updateCanvas(); } });
    btnRemoveColuna.addEventListener('click', () => { if (colSizes.length > 1) { colSizes.pop(); renderGridControls(); updateCanvas(); } });
    btnAddLinha.addEventListener('click', () => { if (rowSizes.length < 6) { rowSizes.push('1fr'); renderGridControls(); updateCanvas(); } });
    btnRemoveLinha.addEventListener('click', () => { if (rowSizes.length > 1) { rowSizes.pop(); renderGridControls(); updateCanvas(); } });
    templateNomeInput.addEventListener('input', () => {
        const nomeValido = templateNomeInput.value.replace(/[^a-zA-Z0-9\s]/g, '');
        templateNomeInput.value = nomeValido;
        templateIdInput.value = (nomeValido.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'template') + '_001';
    });
    widgetsArrastaveis.forEach(widget => {
        widget.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', e.target.dataset.widgetTipo); });
    });
    btnLimparCanvas.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja remover todos os widgets do cartão?')) {
            widgetsNoCanvas = [];
            updateCanvas();
        }
    });
    painelDeWidgets.addEventListener('dragover', e => {
        e.preventDefault();
        painelDeWidgets.classList.add('drag-over');
    });
    painelDeWidgets.addEventListener('dragleave', () => {
        painelDeWidgets.classList.remove('drag-over');
    });
    painelDeWidgets.addEventListener('drop', e => {
        e.preventDefault();
        painelDeWidgets.classList.remove('drag-over');
        const tipoWidget = e.dataTransfer.getData('text/plain');
        removerWidgetDoCanvas(tipoWidget);
    });

    // --- INICIALIZAÇÃO ---
    criarControleCorGradiente(listaCoresGradiente, '#6a89cc', 1.0);
    criarControleCorGradiente(listaCoresGradiente, '#3d3bbe', 1.0);
    criarControleCorGradiente(listaCoresSobreposicaoGradiente, '#000000', 0.1);
    criarControleCorGradiente(listaCoresSobreposicaoGradiente, '#000000', 0.6);
    renderGridControls();
    atualizarVisibilidadeControles();
});