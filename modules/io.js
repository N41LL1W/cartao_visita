// modules/io.js
export function initIO(App) {
    const { state, elements, actions } = App;

    function gerarJSONdoTemplate() {
        let fundoConfig = { tipo: elements.tipoFundoSelect.value }; 
        switch (fundoConfig.tipo) {case 'cor': fundoConfig.cor = elements.inputCor.value; fundoConfig.opacidade = elements.inputCorOpacidade.value; break; case 'gradiente': fundoConfig.angulo = elements.inputGradienteAngulo.value; fundoConfig.cores = Array.from(elements.listaCoresGradiente.querySelectorAll('.cor-gradiente-item')).map(item => ({ cor: item.querySelector('input[type="color"]').value, opacidade: item.querySelector('input[type="range"]').value })); break; case 'imagem': fundoConfig.url = elements.inputImagemUrl.value; fundoConfig.opacidade = elements.inputImagemOpacidade.value; break; }
        let sobreposicaoConfig = { ativa: elements.ativarSobreposicaoCheck.checked };
        if (sobreposicaoConfig.ativa) { sobreposicaoConfig.tipo = elements.sobreposicaoTipoSelect.value; if (sobreposicaoConfig.tipo === 'cor') { sobreposicaoConfig.cor = elements.inputSobreposicaoCor.value; sobreposicaoConfig.opacidade = elements.inputSobreposicaoOpacidade.value; } else { sobreposicaoConfig.angulo = elements.inputSobreposicaoGradienteAngulo.value; sobreposicaoConfig.cores = Array.from(elements.listaCoresSobreposicaoGradiente.querySelectorAll('.cor-gradiente-item')).map(item => ({ cor: item.querySelector('input[type="color"]').value, opacidade: item.querySelector('input[type="range"]').value })); } }
        return {id:elements.templateIdInput.value,nome:elements.templateNomeInput.value,categoria:elements.templateCategoriaSelect.value,estruturaGrid:{colunas:state.colSizes,linhas:state.rowSizes},fundo:fundoConfig,sobreposicao:sobreposicaoConfig,widgets:state.widgets};
    }

    function carregarTemplate(templateData) {
        elements.templateNomeInput.value = templateData.nome || '';
        elements.templateIdInput.value = templateData.id || '';
        elements.templateCategoriaSelect.value = templateData.categoria || 'moderno';
        state.colSizes = templateData.estruturaGrid.colunas || ['1fr'];
        state.rowSizes = templateData.estruturaGrid.linhas || ['1fr'];
        state.widgets = templateData.widgets || [];
        const fundo = templateData.fundo;
        if (fundo) {
            elements.tipoFundoSelect.value = fundo.tipo;
            if (fundo.tipo === 'cor') { elements.inputCor.value = fundo.cor; elements.inputCorOpacidade.value = fundo.opacidade; } 
            else if (fundo.tipo === 'gradiente') {
                elements.inputGradienteAngulo.value = fundo.angulo;
                elements.listaCoresGradiente.innerHTML = '';
                fundo.cores.forEach(c => actions.criarControleCorGradiente(elements.listaCoresGradiente, c.cor, c.opacidade));
            } else if (fundo.tipo === 'imagem') { elements.inputImagemUrl.value = fundo.url; elements.inputImagemOpacidade.value = fundo.opacidade; }
        }
        const sobreposicao = templateData.sobreposicao;
        if (sobreposicao && sobreposicao.ativa) {
            elements.ativarSobreposicaoCheck.checked = true;
            elements.sobreposicaoTipoSelect.value = sobreposicao.tipo;
            if (sobreposicao.tipo === 'cor') { elements.inputSobreposicaoCor.value = sobreposicao.cor; elements.inputSobreposicaoOpacidade.value = sobreposicao.opacidade; } 
            else if (sobreposicao.tipo === 'gradiente') {
                elements.inputSobreposicaoGradienteAngulo.value = sobreposicao.angulo;
                elements.listaCoresSobreposicaoGradiente.innerHTML = '';
                sobreposicao.cores.forEach(c => actions.criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, c.cor, c.opacidade));
            }
        } else { elements.ativarSobreposicaoCheck.checked = false; }
        actions.renderizarTudo();
        alert('Template carregado com sucesso!');
    }

    App.actions.salvarTemplate = () => {
        const dados = gerarJSONdoTemplate();
        if(!dados.id || !dados.nome){alert("Por favor, preencha o Nome do Template.");return;}
        const nomeArquivo = `${dados.id}.json`;
        const blob = new Blob([JSON.stringify(dados, null, 2)],{type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nomeArquivo;
        a.click(); URL.revokeObjectURL(a.href);
    };

    App.actions.lerArquivoDeTemplate = (event) => {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => { try { carregarTemplate(JSON.parse(evt.target.result)); } catch(err){ alert('Arquivo de design inválido.'); console.error(err); } };
        reader.readAsText(file); event.target.value = '';
    };
}