document.addEventListener('DOMContentLoaded', () => {
    // --- MAPEAMENTO DE ELEMENTOS ---
    const form = document.getElementById('form-cartao');
    const btnSalvar = document.getElementById('btn-salvar');
    const inputCarregar = document.getElementById('carregar-config');

    const inputs = {
        nome: document.getElementById('nome'),
        profissao: document.getElementById('profissao'),
        whatsapp: document.getElementById('whatsapp'),
        qrcode: document.getElementById('qrcode'),
        tagline: document.getElementById('tagline'),
        servicos: document.getElementById('servicos'),
        
        tipoCorVerso: document.getElementById('tipo-cor-verso'),
        versoCorSolida: document.getElementById('verso-cor-solida'),
        versoCorSolidaHex: document.getElementById('verso-cor-solida-hex'),
        versoGradienteAngulo: document.getElementById('verso-gradiente-angulo'),
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
    
    const galeriaThumbs = document.querySelectorAll('.template-thumb');
    const previaFrente = document.getElementById('previa-frente');
    let templateFrenteAtivo = 'template-frente-01';

    // --- LÓGICA DE UI E PRÉ-VISUALIZAÇÃO ---

    function linkColorInputs(colorInput, hexInput) {
        colorInput.addEventListener('input', () => {
            hexInput.value = colorInput.value;
            hexInput.dispatchEvent(new Event('input', { bubbles: true })); // Dispara evento para prévia
        });
        hexInput.addEventListener('input', () => {
            if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
                 colorInput.value = hexInput.value;
            }
        });
    }

    function atualizarUIDesignVerso() {
        const tipo = inputs.tipoCorVerso.value;
        document.getElementById('grupo-cor-solida-verso').classList.toggle('ativo', tipo === 'solida');
        document.getElementById('grupo-gradiente-verso').classList.toggle('ativo', tipo === 'gradiente');
        atualizarPreviaVerso();
    }

    function toggleTerceiraCor() {
        const desabilitado = !inputs.versoUsarCor3.checked;
        inputs.versoGradienteCor3.disabled = desabilitado;
        inputs.versoGradienteCor3Hex.disabled = desabilitado;
        atualizarPreviaVerso();
    }

    function atualizarPreviaVerso() {
        const previa = document.getElementById('previa-verso');
        if (inputs.tipoCorVerso.value === 'solida') {
            previa.style.background = inputs.versoCorSolida.value;
        } else {
            const angulo = inputs.versoGradienteAngulo.value;
            document.getElementById('valor-angulo-verso').textContent = angulo;
            const cores = [inputs.versoGradienteCor1.value, inputs.versoGradienteCor2.value];
            if (inputs.versoUsarCor3.checked) {
                cores.push(inputs.versoGradienteCor3.value);
            }
            previa.style.background = `linear-gradient(${angulo}deg, ${cores.join(', ')})`;
        }
    }

    function atualizarPreviaFrente() {
        previaFrente.style.setProperty('--cor-frente-1', inputs.frenteCor1.value);
        previaFrente.style.setProperty('--cor-frente-2', inputs.frenteCor2.value);
    }
    
    function selecionarTemplate(templateId) {
        if (!templateId) return;
        templateFrenteAtivo = templateId;
        galeriaThumbs.forEach(thumb => thumb.classList.toggle('ativo', thumb.dataset.templateId === templateId));
        previaFrente.className = 'previa-box lado frente'; // Reseta
        previaFrente.classList.add(templateId);
        atualizarPreviaFrente();
    }

    // --- LÓGICA DE DADOS (GET, SET, SALVAR, CARREGAR) ---

    function getDadosDoForm() {
        return {
            nome: inputs.nome.value,
            profissao: inputs.profissao.value,
            whatsapp: inputs.whatsapp.value,
            qrcode: inputs.qrcode.value,
            tagline: inputs.tagline.value,
            servicos: inputs.servicos.value.split('\n').filter(s => s.trim() !== ''),
            design: {
                verso: {
                    tipo: inputs.tipoCorVerso.value,
                    solida: inputs.versoCorSolida.value,
                    gradiente: {
                        angulo: inputs.versoGradienteAngulo.value,
                        cor1: inputs.versoGradienteCor1.value,
                        cor2: inputs.versoGradienteCor2.value,
                        usarCor3: inputs.versoUsarCor3.checked,
                        cor3: inputs.versoGradienteCor3.value,
                    }
                },
                frente: {
                    template: templateFrenteAtivo,
                    cor1: inputs.frenteCor1.value,
                    cor2: inputs.frenteCor2.value,
                }
            }
        };
    }

    function setDadosNoForm(dados) {
        inputs.nome.value = dados.nome || '';
        inputs.profissao.value = dados.profissao || '';
        inputs.whatsapp.value = dados.whatsapp || '';
        inputs.qrcode.value = dados.qrcode || '';
        inputs.tagline.value = dados.tagline || '';
        inputs.servicos.value = (dados.servicos || []).join('\n');

        if (dados.design) {
            const dVerso = dados.design.verso || {};
            inputs.tipoCorVerso.value = dVerso.tipo || 'gradiente';
            inputs.versoCorSolida.value = inputs.versoCorSolidaHex.value = dVerso.solida || '#3d3bbe';
            if (dVerso.gradiente) {
                inputs.versoGradienteAngulo.value = dVerso.gradiente.angulo || '135';
                inputs.versoGradienteCor1.value = inputs.versoGradienteCor1Hex.value = dVerso.gradiente.cor1 || '#6a89cc';
                inputs.versoGradienteCor2.value = inputs.versoGradienteCor2Hex.value = dVerso.gradiente.cor2 || '#3d3bbe';
                inputs.versoUsarCor3.checked = dVerso.gradiente.usarCor3 || false;
                inputs.versoGradienteCor3.value = inputs.versoGradienteCor3Hex.value = dVerso.gradiente.cor3 || '#2e4f6e';
            }
            
            const dFrente = dados.design.frente || {};
            inputs.frenteCor1.value = inputs.frenteCor1Hex.value = dFrente.cor1 || '#3d3bbe';
            inputs.frenteCor2.value = inputs.frenteCor2Hex.value = dFrente.cor2 || '#6a89cc';
            
            selecionarTemplate(dFrente.template || 'template-frente-01');
        }
        
        atualizarUIDesignVerso();
        toggleTerceiraCor();
        atualizarPreviaFrente();
    }

    // --- EVENTOS PRINCIPAIS ---

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const dadosCartao = getDadosDoForm();
        const dadosComoString = encodeURIComponent(JSON.stringify(dadosCartao));
        const urlFinal = `cartao.html?data=${dadosComoString}`;
        window.open(urlFinal, '_blank');
    });

    btnSalvar.addEventListener('click', function() {
        const dadosCartao = getDadosDoForm();
        const blob = new Blob([JSON.stringify(dadosCartao, null, 2)], { type: 'application/json' });
        const urlDownload = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nomeBase = dadosCartao.nome.split(' ')[0].toLowerCase() || 'cartao';
        a.href = urlDownload;
        a.download = `config_${nomeBase}.json`;
        a.click();
        URL.revokeObjectURL(urlDownload);
    });

    inputCarregar.addEventListener('change', function(event) {
        const arquivo = event.target.files[0];
        if (!arquivo) return;
        const leitor = new FileReader();
        leitor.onload = (e) => {
            try {
                setDadosNoForm(JSON.parse(e.target.result));
                alert('Configuração carregada com sucesso!');
            } catch (error) {
                alert('Erro ao carregar o arquivo. Verifique se é válido.');
            }
        };
        leitor.readAsText(arquivo);
        inputCarregar.value = '';
    });

    // --- INICIALIZAÇÃO E LISTENERS DE UI ---
    
    Object.keys(inputs).forEach(key => {
        if (key.endsWith('Hex')) {
            const colorKey = key.replace('Hex', '');
            linkColorInputs(inputs[colorKey], inputs[key]);
        }
    });
    
    inputs.tipoCorVerso.addEventListener('change', atualizarUIDesignVerso);
    inputs.versoUsarCor3.addEventListener('change', toggleTerceiraCor);
    
    [inputs.versoCorSolida, inputs.versoGradienteAngulo, inputs.versoGradienteCor1, inputs.versoGradienteCor2, inputs.versoGradienteCor3].forEach(el => el.addEventListener('input', atualizarPreviaVerso));
    [inputs.frenteCor1, inputs.frenteCor2].forEach(el => el.addEventListener('input', atualizarPreviaFrente));
    
    galeriaThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => selecionarTemplate(thumb.dataset.templateId));
    });

    selecionarTemplate(templateFrenteAtivo);
    atualizarUIDesignVerso();
});