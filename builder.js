// builder.js (versão com sobreposição de cor)

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DO GRID ---
    let colSizes = ['1fr'];
    let rowSizes = ['1fr'];

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
    // Sobreposição (Overlay)
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
    // Ações
    const btnSalvar = document.getElementById('btn-salvar-template');
    
    // --- FUNÇÕES AUXILIARES ---
    function hexToRgba(hex, alpha = 1) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; } 
        else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
        return `rgba(${+r}, ${+g}, ${+b}, ${alpha})`;
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO DA UI ---
    function updateCanvas() {
        const [cols, rows] = [colSizes.length, rowSizes.length];
        if (canvas.children.length !== cols * rows) {
            canvas.innerHTML = '';
            canvas.style.gridTemplateColumns = colSizes.join(' ');
            canvas.style.gridTemplateRows = rowSizes.join(' ');
            for (let i = 0; i < cols * rows; i++) {
                const celula = document.createElement('div');
                celula.className = 'celula-grid-template';
                celula.textContent = i + 1;
                canvas.appendChild(celula);
            }
        } else {
            canvas.style.gridTemplateColumns = colSizes.join(' ');
            canvas.style.gridTemplateRows = rowSizes.join(' ');
        }

        // Constrói a string de background com múltiplas camadas
        let backgroundLayers = [];
        // Camada 1: Sobreposição (se ativa)
        if (ativarSobreposicaoCheck.checked) {
            const tipo = sobreposicaoTipoSelect.value;
            if (tipo === 'cor') {
                backgroundLayers.push(hexToRgba(inputSobreposicaoCor.value, inputSobreposicaoOpacidade.value));
            } else { // gradiente
                const coresItens = listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item');
                const coresArray = Array.from(coresItens).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value));
                backgroundLayers.push(`linear-gradient(${inputSobreposicaoGradienteAngulo.value}deg, ${coresArray.join(', ')})`);
            }
        }
        // Camada 2: Fundo Principal
        const tipoFundo = tipoFundoSelect.value;
        canvas.style.opacity = 1; // Reseta a opacidade, pois ela só se aplica a imagens
        switch (tipoFundo) {
            case 'cor': backgroundLayers.push(hexToRgba(inputCor.value, inputCorOpacidade.value)); break;
            case 'gradiente':
                const coresItens = listaCoresGradiente.querySelectorAll('.cor-gradiente-item');
                const coresArray = Array.from(coresItens).map(item => hexToRgba(item.querySelector('input[type="color"]').value, item.querySelector('input[type="range"]').value));
                backgroundLayers.push(`linear-gradient(${inputGradienteAngulo.value}deg, ${coresArray.join(', ')})`);
                break;
            case 'imagem':
                backgroundLayers.push(`url('${inputImagemUrl.value || ''}') no-repeat center center / cover`);
                canvas.style.opacity = inputImagemOpacidade.value; // Opacidade ainda se aplica ao elemento inteiro
                break;
        }
        canvas.style.background = backgroundLayers.join(', ');
    }
    
    function renderGridControls() {
        colunaSizesContainer.innerHTML = '';
        colSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { colSizes[i] = e.target.value; updateCanvas(); }); colunaSizesContainer.appendChild(input); });
        linhaSizesContainer.innerHTML = '';
        rowSizes.forEach((size, i) => { const input = document.createElement('input'); input.type = 'text'; input.value = size; input.addEventListener('input', e => { rowSizes[i] = e.target.value; updateCanvas(); }); linhaSizesContainer.appendChild(input); });
    }
    
    function atualizarVisibilidadeControles() {
        // Fundo
        const tipoFundo = tipoFundoSelect.value;
        controlesCor.classList.toggle('ativo', tipoFundo === 'cor');
        controlesGradiente.classList.toggle('ativo', tipoFundo === 'gradiente');
        controlesImagem.classList.toggle('ativo', tipoFundo === 'imagem');
        // Sobreposição
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
        const item = document.createElement('div'); item.className = 'cor-gradiente-item';
        const inputCor = document.createElement('input'); inputCor.type = 'color'; inputCor.value = cor;
        const inputOpacidade = document.createElement('input'); inputOpacidade.type = 'range'; inputOpacidade.min = 0; inputOpacidade.max = 1; inputOpacidade.step = 0.01; inputOpacidade.value = opacidade;
        const btnRemover = document.createElement('button'); btnRemover.type = 'button'; btnRemover.className = 'btn-remover-cor'; btnRemover.innerHTML = '×';
        btnRemover.onclick = () => { if (lista.querySelectorAll('.cor-gradiente-item').length > minCores) { item.remove(); updateCanvas(); } else { alert(`O gradiente precisa de pelo menos ${minCores} cores.`); } };
        item.append(inputCor, inputOpacidade, btnRemover); lista.appendChild(item);
    }
    
    function gerarJSONdoTemplate() {
        let fundoConfig = { tipo: tipoFundoSelect.value };
        switch (fundoConfig.tipo) {
            case 'cor': fundoConfig.cor = inputCor.value; fundoConfig.opacidade = inputCorOpacidade.value; break;
            case 'gradiente':
                fundoConfig.angulo = inputGradienteAngulo.value;
                fundoConfig.cores = Array.from(listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item => ({ cor: item.querySelector('input[type="color"]').value, opacidade: item.querySelector('input[type="range"]').value }));
                break;
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
        return {
            id: templateIdInput.value, nome: templateNomeInput.value, categoria: templateCategoriaSelect.value,
            estruturaGrid: { colunas: colSizes, linhas: rowSizes },
            fundo: fundoConfig,
            sobreposicao: sobreposicaoConfig,
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
        if(!dados.id || !dados.nome){ alert("Por favor, preencha o ID e o Nome do Template antes de salvar."); return; }
        const nomeArquivo = `${dados.id}.json`;
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nomeArquivo;
        a.click(); URL.revokeObjectURL(a.href);
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
    
    // --- INICIALIZAÇÃO ---
    criarControleCorGradiente(listaCoresGradiente, '#6a89cc', 1.0);
    criarControleCorGradiente(listaCoresGradiente, '#3d3bbe', 1.0);
    criarControleCorGradiente(listaCoresSobreposicaoGradiente, '#000000', 0.1);
    criarControleCorGradiente(listaCoresSobreposicaoGradiente, '#000000', 0.6);
    renderGridControls();
    atualizarVisibilidadeControles();
});