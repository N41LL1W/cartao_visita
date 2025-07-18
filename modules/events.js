// modules/events.js (VERSÃO CORRIGIDA)

export function initEventListeners(App) {
    // Desestrutura o objeto App para ter acesso fácil ao que precisamos
    const { elements, actions } = App;
    
    // Navegação do Dashboard
    elements.menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            elements.menuLinks.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            elements.secoesConteudo.forEach(secao => secao.classList.add('escondido'));
            document.getElementById(link.dataset.secao)?.classList.remove('escondido');
        });
    });

    // Listener geral para atualizações de UI em tempo real
    elements.painelControles.addEventListener('input', actions.renderizarTudo);

    // Listeners específicos para mudanças que afetam a visibilidade dos controles
    elements.tipoFundoSelect.addEventListener('change', App.render.visibilidadeControles);
    elements.ativarSobreposicaoCheck.addEventListener('change', App.render.visibilidadeControles);
    elements.sobreposicaoTipoSelect.addEventListener('change', App.render.visibilidadeControles);

    // Grid
    elements.btnAddColuna.addEventListener('click', actions.adicionarColuna);
    elements.btnRemoveColuna.addEventListener('click', actions.removerColuna);
    elements.btnAddLinha.addEventListener('click', actions.adicionarLinha);
    elements.btnRemoveLinha.addEventListener('click', actions.removerLinha);

    // Gradientes
    elements.btnAddCorGradiente.addEventListener('click', () => actions.criarControleCorGradiente(elements.listaCoresGradiente, '#ffffff', 1.0));
    elements.btnAddCorSobreposicaoGradiente.addEventListener('click', () => actions.criarControleCorGradiente(elements.listaCoresSobreposicaoGradiente, '#000000', 0.5));
    
    // Widgets e Elementos
    elements.btnAddElemento.addEventListener('click', () => elements.menuAddElemento.classList.toggle('escondido'));
    document.addEventListener('click', e => {
        if (!elements.btnAddElemento.contains(e.target) && !elements.menuAddElemento.contains(e.target)) {
            elements.menuAddElemento.classList.add('escondido');
        }
    });
    elements.menuAddElemento.addEventListener('click', e => {
        e.preventDefault();
        const link = e.target.closest('a');
        if(link) {
            actions.adicionarNovoWidget(link.dataset.widgetTipo);
            elements.menuAddElemento.classList.add('escondido');
        }
    });
    elements.btnLimparCanvas.addEventListener('click', actions.limparWidgetsDoCanvas);

    // Drag & Drop para remover (Lixeira)
    // A linha abaixo era a causa do erro. `painelDeWidgetsArrastaveis` agora existe dentro de `elements`.
    elements.painelDeWidgetsArrastaveis.addEventListener('dragover', e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); });
    elements.painelDeWidgetsArrastaveis.addEventListener('dragleave', e => { e.currentTarget.classList.remove('drag-over'); });
    elements.painelDeWidgetsArrastaveis.addEventListener('drop', e => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const widgetId = e.dataTransfer.getData('text/plain');
        actions.removerWidgetDoCanvas(widgetId);
    });

    // Nome e ID do Template
    elements.templateNomeInput.addEventListener('input', () => {
        const nomeValido = elements.templateNomeInput.value.replace(/[^a-zA-Z0-9\s]/g,'');
        elements.templateNomeInput.value = nomeValido;
        elements.templateIdInput.value = (nomeValido.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'') || 'template') + '_001';
    });
    
    // Ações Finais de Salvar e Carregar
    elements.btnSalvar.addEventListener('click', actions.salvarTemplate);
    elements.inputCarregarTemplate.addEventListener('change', actions.lerArquivoDeTemplate);
}