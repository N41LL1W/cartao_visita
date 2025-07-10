// gerador.js (versão CORRIGIDA com delegação de eventos)

document.addEventListener('DOMContentLoaded', () => {
    
    // --- BANCO DE DADOS DE TEMPLATES ---
    const todosTemplates = [
        { id: 'template-frente-01', nome: 'Ondas Clássicas', categoria: 'moderno', thumb: 'https://via.placeholder.com/120x72/6a89cc/fff?text=T1' },
        { id: 'template-frente-02', nome: 'Faixa Diagonal', categoria: 'moderno', thumb: 'https://via.placeholder.com/120x72/3d3bbe/fff?text=T2' },
        { id: 'template-frente-03', nome: 'Círculos', categoria: 'minimalista', thumb: 'https://via.placeholder.com/120x72/f4f4f4/333?text=T3' },
        { id: 'template-frente-04', nome: 'Barra Vertical', categoria: 'corporativo', thumb: 'https://via.placeholder.com/120x72/6a89cc/fff?text=T4' },
        { id: 'template-frente-05', nome: 'Linha Inferior', categoria: 'minimalista', thumb: 'https://via.placeholder.com/120x72/3d3bbe/fff?text=T5' },
        { id: 'template-frente-06', nome: 'Template 6', categoria: 'moderno', thumb: 'https://via.placeholder.com/120x72/2d3748/fff?text=T6' },
        { id: 'template-frente-07', nome: 'Template 7', categoria: 'corporativo', thumb: 'https://via.placeholder.com/120x72/2d3748/fff?text=T7' },
        { id: 'template-frente-08', nome: 'Template 8', categoria: 'minimalista', thumb: 'https://via.placeholder.com/120x72/2d3748/fff?text=T8' },
        { id: 'template-frente-09', nome: 'Template 9', categoria: 'moderno', thumb: 'https://via.placeholder.com/120x72/2d3748/fff?text=T9' },
    ];

    // --- VARIÁVEIS DE ESTADO ---
    let templatesFiltrados = [...todosTemplates];
    let paginaAtual = 1;
    const ITENS_POR_PAGINA = 6;
    let templateFrenteAtivo = 'template-frente-01';
    
    // --- MAPEAMENTO DE ELEMENTOS ---
    const form = document.getElementById('form-cartao');
    const inputs = {
        nome: document.getElementById('nome'),
        profissao: document.getElementById('profissao'),
        whatsapp: document.getElementById('whatsapp'),
        tagline: document.getElementById('tagline'),
        servicos: document.getElementById('servicos'),
        tipoCorVerso: document.getElementById('tipo-cor-verso'),
        versoCorSolida: document.getElementById('verso-cor-solida'),
        versoCorSolidaHex: document.getElementById('verso-cor-solida-hex'),
        versoGradienteAngulo: document.getElementById('verso-gradiente-angulo'),
        valorAnguloVerso: document.getElementById('valor-angulo-verso'),
        versoGradienteCor1: document.getElementById('verso-gradiente-cor1'),
        versoGradienteCor1Hex: document.getElementById('verso-gradiente-cor1-hex'),
        versoGradienteCor2: document.getElementById('verso-gradiente-cor2'),
        versoGradienteCor2Hex: document.getElementById('verso-gradiente-cor2-hex'),
        versoUsarCor3: document.getElementById('verso-usar-cor3'),
        versoGradienteCor3: document.getElementById('verso-gradiente-cor3'),
        versoGradienteCor3Hex: document.getElementById('verso-gradiente-cor3-hex'),
        frenteCor1: document.getElementById('frente-cor1'),
        frenteCor1Hex: document.getElementById('frente-cor1-hex'),
        frenteCor2: document.getElementById('frente-cor2'),
        frenteCor2Hex: document.getElementById('frente-cor2-hex'),
    };
    const previa = {
        frente: document.getElementById('previa-frente'),
        frenteNome: document.getElementById('previa-frente-nome'),
        frenteProfissao: document.getElementById('previa-frente-profissao'),
        frenteWhatsapp: document.getElementById('previa-frente-whatsapp'),
        verso: document.getElementById('previa-verso'),
        versoNome: document.getElementById('previa-verso-nome'),
        versoTagline: document.getElementById('previa-verso-tagline'),
        versoServicos: document.getElementById('previa-verso-servicos'),
        versoContato: document.getElementById('previa-verso-contato'),
    };
    const modalGaleria = document.getElementById('modal-galeria');
    const btnAbrirGaleria = document.getElementById('btn-abrir-galeria');
    const btnFecharGaleria = document.getElementById('btn-fechar-galeria');
    const galeriaGrid = document.getElementById('galeria-grid-modal');
    const btnPagAnterior = document.getElementById('paginacao-anterior');
    const btnPagProxima = document.getElementById('paginacao-proxima');
    const paginacaoInfo = document.getElementById('paginacao-info');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const thumbSelecionadoImg = document.getElementById('thumb-selecionado');
    const nomeTemplateSelecionado = document.getElementById('nome-template-selecionado');
    const inputCarregar = document.getElementById('carregar-config');
    const modalBuilder = document.getElementById('modal-builder');
    const btnAbrirBuilder = document.getElementById('btn-abrir-builder');
    const btnFecharBuilder = document.getElementById('btn-fechar-builder');
    const seletorGrid = document.getElementById('builder-seleciona-grid');
    const canvas = document.getElementById('builder-canvas');
    const widgets = document.querySelectorAll('#builder-widgets .widget');
    const btnGerar = document.getElementById('btn-gerar');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnSalvarTemplateCustomizado = document.getElementById('btn-salvar-template-customizado');
    
    // --- FUNÇÕES DE LÓGICA DE DADOS ---
    function getDadosDoForm() {
        return {
            nome: inputs.nome.value, profissao: inputs.profissao.value, whatsapp: inputs.whatsapp.value, tagline: inputs.tagline.value,
            servicos: inputs.servicos.value.split('\n').filter(s => s.trim() !== ''),
            design: {
                verso: {
                    tipo: inputs.tipoCorVerso.value, solida: inputs.versoCorSolida.value,
                    gradiente: { angulo: inputs.versoGradienteAngulo.value, cor1: inputs.versoGradienteCor1.value, cor2: inputs.versoGradienteCor2.value, usarCor3: inputs.versoUsarCor3.checked, cor3: inputs.versoGradienteCor3.value, }
                },
                frente: { template: templateFrenteAtivo, cor1: inputs.frenteCor1.value, cor2: inputs.frenteCor2.value, }
            }
        };
    }
    function setDadosNoForm(dados) {
        inputs.nome.value = dados.nome || '';
        inputs.profissao.value = dados.profissao || '';
        inputs.whatsapp.value = dados.whatsapp || '';
        inputs.tagline.value = dados.tagline || '';
        inputs.servicos.value = (dados.servicos || []).join('\n');
        if (dados.design) {
            const d = dados.design;
            if (d.verso) {
                inputs.tipoCorVerso.value = d.verso.tipo || 'gradiente';
                inputs.versoCorSolida.value = inputs.versoCorSolidaHex.value = d.verso.solida || '#3d3bbe';
                if (d.verso.gradiente) {
                    inputs.versoGradienteAngulo.value = d.verso.gradiente.angulo || '135';
                    inputs.versoGradienteCor1.value = inputs.versoGradienteCor1Hex.value = d.verso.gradiente.cor1 || '#6a89cc';
                    inputs.versoGradienteCor2.value = inputs.versoGradienteCor2Hex.value = d.verso.gradiente.cor2 || '#3d3bbe';
                    inputs.versoUsarCor3.checked = d.verso.gradiente.usarCor3 || false;
                    inputs.versoGradienteCor3.value = inputs.versoGradienteCor3Hex.value = d.verso.gradiente.cor3 || '#2e4f6e';
                }
            }
            if (d.frente) {
                inputs.frenteCor1.value = inputs.frenteCor1Hex.value = d.frente.cor1 || '#3d3bbe';
                inputs.frenteCor2.value = inputs.frenteCor2Hex.value = d.frente.cor2 || '#6a89cc';
                selecionarTemplate(d.frente.template || 'template-frente-01', false);
            }
        }
        atualizarUIDesignVerso();
        inputs.versoUsarCor3.dispatchEvent(new Event('change'));
        atualizarPreviaCompleta();
    }
    function getLayoutDoBuilder() {
        const [cols, rows] = seletorGrid.value.split('x').map(Number);
        const layout = { nomeTemplate: "Meu Layout Customizado", estruturaGrid: { valor: seletorGrid.value, colunas: cols, linhas: rows }, widgets: [], };
        canvas.querySelectorAll('.celula-grid').forEach(celula => {
            const widgetElement = celula.querySelector('.widget-no-cartao');
            if (widgetElement) { layout.widgets.push({ tipo: widgetElement.dataset.tipo, celulaId: parseInt(celula.dataset.celulaId, 10) }); }
        });
        return layout;
    }
    function salvarArquivoJSON(dados, nomeArquivo) {
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = nomeArquivo;
        a.click();
        URL.revokeObjectURL(a.href);
    }
    
    // --- FUNÇÕES DE ATUALIZAÇÃO DA UI ---
    function atualizarPreviaCompleta() {
        const nome = inputs.nome.value || inputs.nome.placeholder;
        previa.frenteNome.textContent = nome; previa.versoNome.textContent = nome;
        previa.frenteProfissao.textContent = inputs.profissao.value || inputs.profissao.placeholder;
        const whatsapp = inputs.whatsapp.value || inputs.whatsapp.placeholder;
        previa.frenteWhatsapp.textContent = whatsapp; previa.versoContato.textContent = whatsapp;
        previa.versoTagline.textContent = inputs.tagline.value || inputs.tagline.placeholder;
        const servicosTexto = inputs.servicos.value || inputs.servicos.placeholder;
        previa.versoServicos.innerHTML = '';
        servicosTexto.split('\n').forEach(s => { if (s.trim() !== '') { const li = document.createElement('li'); li.textContent = s; previa.versoServicos.appendChild(li); } });
        if (inputs.tipoCorVerso.value === 'solida') { previa.verso.style.background = inputs.versoCorSolida.value; } 
        else {
            const angulo = inputs.versoGradienteAngulo.value;
            inputs.valorAnguloVerso.textContent = angulo;
            const cores = [inputs.versoGradienteCor1.value, inputs.versoGradienteCor2.value];
            if (inputs.versoUsarCor3.checked) cores.push(inputs.versoGradienteCor3.value);
            previa.verso.style.background = `linear-gradient(${angulo}deg, ${cores.join(', ')})`;
        }
        previa.frente.style.setProperty('--cor-frente-1', inputs.frenteCor1.value);
        previa.frente.style.setProperty('--cor-frente-2', inputs.frenteCor2.value);
    }
    function linkColorInputs(colorInput, hexInput) {
        colorInput.addEventListener('input', () => hexInput.value = colorInput.value);
        hexInput.addEventListener('input', () => { if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) colorInput.value = hexInput.value; });
    }
    function atualizarUIDesignVerso() {
        document.getElementById('grupo-cor-solida-verso').classList.toggle('ativo', inputs.tipoCorVerso.value === 'solida');
        document.getElementById('grupo-gradiente-verso').classList.toggle('ativo', inputs.tipoCorVerso.value === 'gradiente');
    }
    function abrirModal(modal) { modal.classList.remove('escondido'); }
    function fecharModal(modal) { modal.classList.add('escondido'); }
    function selecionarTemplate(templateId, renderizar = true) {
        templateFrenteAtivo = templateId;
        const templateInfo = todosTemplates.find(t => t.id === templateId);
        if (templateInfo) { thumbSelecionadoImg.src = templateInfo.thumb; nomeTemplateSelecionado.textContent = templateInfo.nome; }
        previa.frente.className = 'lado frente';
        previa.frente.classList.add(templateId);
        if(renderizar) renderizarGaleria();
        atualizarPreviaCompleta();
    }
    
    // --- FUNÇÕES DA GALERIA ---
    function renderizarGaleria() {
        galeriaGrid.innerHTML = '';
        const totalPaginas = Math.ceil(templatesFiltrados.length / ITENS_POR_PAGINA);
        paginaAtual = Math.max(1, Math.min(paginaAtual, totalPaginas || 1));
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        templatesFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA).forEach(template => {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'template-thumb';
            if (template.id === templateFrenteAtivo) thumbDiv.classList.add('ativo');
            thumbDiv.dataset.templateId = template.id;
            thumbDiv.title = template.nome;
            const img = document.createElement('img');
            img.src = template.thumb; img.alt = template.nome;
            thumbDiv.appendChild(img);
            galeriaGrid.appendChild(thumbDiv);
        });
        paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas || 1}`;
        btnPagAnterior.disabled = (paginaAtual === 1);
        btnPagProxima.disabled = (paginaAtual === totalPaginas || totalPaginas === 0);
    }
    
    // --- FUNÇÕES DO CONSTRUTOR DE LAYOUT ---
    function atualizarGrid() {
        const valor = seletorGrid.value;
        canvas.innerHTML = '';
        const [cols, rows] = valor.split('x').map(Number);
        canvas.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        canvas.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        for (let i = 0; i < cols * rows; i++) {
            const celula = document.createElement('div');
            celula.className = 'celula-grid';
            celula.dataset.celulaId = i; celula.textContent = `Arraste para cá`;
            celula.addEventListener('dragover', e => { e.preventDefault(); celula.classList.add('drag-over'); });
            celula.addEventListener('dragleave', () => celula.classList.remove('drag-over'));
            celula.addEventListener('drop', e => {
                e.preventDefault(); celula.classList.remove('drag-over');
                const tipoWidget = e.dataTransfer.getData('text/plain');
                if (!celula.querySelector('.widget-no-cartao')) {
                    celula.textContent = '';
                    const widgetElement = document.createElement('div');
                    widgetElement.className = 'widget-no-cartao';
                    widgetElement.dataset.tipo = tipoWidget;
                    if (['logo', 'qrcode'].includes(tipoWidget)) {
                        const icone = document.createElement('i');
                        icone.className = `fas fa-${tipoWidget === 'logo' ? 'image' : 'qrcode'}`;
                        widgetElement.appendChild(icone);
                        const texto = document.createElement('span');
                        texto.textContent = ` ${tipoWidget.charAt(0).toUpperCase() + tipoWidget.slice(1)}`;
                        widgetElement.appendChild(texto);
                    } else {
                        const inputOriginal = document.getElementById(tipoWidget);
                        widgetElement.textContent = `[${inputOriginal ? inputOriginal.placeholder : tipoWidget}]`;
                    }
                    celula.appendChild(widgetElement);
                }
            });
            canvas.appendChild(celula);
        }
    }
    
    // --- EVENT LISTENERS ---
    form.addEventListener('input', atualizarPreviaCompleta);
    form.addEventListener('change', atualizarPreviaCompleta);
    Object.keys(inputs).forEach(key => { if (key.endsWith('Hex')) linkColorInputs(inputs[key.replace('Hex', '')], inputs[key]); });
    inputs.versoUsarCor3.addEventListener('change', () => { const d = !inputs.versoUsarCor3.checked; inputs.versoGradienteCor3.disabled = d; inputs.versoGradienteCor3Hex.disabled = d; });
    inputCarregar.addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = evt => { try { setDadosNoForm(JSON.parse(evt.target.result)); alert('Configuração carregada!'); } catch (err) { alert('Erro ao carregar o arquivo.'); } }; r.readAsText(f); e.target.value = ''; });
    btnGerar.addEventListener('click', e => { e.preventDefault(); window.open(`cartao.html?data=${encodeURIComponent(JSON.stringify(getDadosDoForm()))}`, '_blank'); });
    btnSalvar.addEventListener('click', () => salvarArquivoJSON(getDadosDoForm(), 'configuracao_cartao.json'));
    
    // Galeria
    btnAbrirGaleria.addEventListener('click', () => abrirModal(modalGaleria));
    btnFecharGaleria.addEventListener('click', () => fecharModal(modalGaleria));
    modalGaleria.addEventListener('click', e => { if (e.target === modalGaleria) fecharModal(modalGaleria); });
    btnPagAnterior.addEventListener('click', () => { if (paginaAtual > 1) { paginaAtual--; renderizarGaleria(); } });
    btnPagProxima.addEventListener('click', () => { if (paginaAtual < Math.ceil(templatesFiltrados.length / ITENS_POR_PAGINA)) { paginaAtual++; renderizarGaleria(); } });
    filtroCategoria.addEventListener('change', () => { const c = filtroCategoria.value; templatesFiltrados = (c === 'todos') ? [...todosTemplates] : todosTemplates.filter(t => t.categoria === c); paginaAtual = 1; renderizarGaleria(); });
    // DELEGAÇÃO DE EVENTO PARA A GALERIA
    galeriaGrid.addEventListener('click', e => {
        const thumb = e.target.closest('.template-thumb');
        if (thumb) {
            selecionarTemplate(thumb.dataset.templateId);
            fecharModal(modalGaleria);
        }
    });

    // Builder
    btnAbrirBuilder.addEventListener('click', () => abrirModal(modalBuilder));
    btnFecharBuilder.addEventListener('click', () => fecharModal(modalBuilder));
    seletorGrid.addEventListener('change', atualizarGrid);
    widgets.forEach(widget => widget.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', widget.dataset.tipo)));
    btnSalvarTemplateCustomizado.addEventListener('click', () => { salvarArquivoJSON(getLayoutDoBuilder(), 'meu_template.json'); alert('Template salvo!'); });

    // --- INICIALIZAÇÃO ---
    atualizarUIDesignVerso();
    selecionarTemplate(templateFrenteAtivo);
    atualizarGrid();
});