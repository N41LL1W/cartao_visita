// main.js (VERSÃO FINAL E CORRETA)

import { state } from './modules/state.js';
import { initUI } from './modules/ui.js';
import { initActions } from './modules/actions.js';
import { initEventListeners } from './modules/events.js';
import { initIO } from './modules/io.js';

document.addEventListener('DOMContentLoaded', () => {
    const App = {
        state: state,
        elements: {
            canvas: document.getElementById('canvas-template'),
            painelControles: document.querySelector('.painel-controles'),
            templateIdInput: document.getElementById('template-id'),
            templateNomeInput: document.getElementById('template-nome'),
            templateCategoriaSelect: document.getElementById('template-categoria'),
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
        },
        actions: {},
        render: {},
    };

    // Inicializa os módulos, passando o objeto App
    initUI(App);
    initActions(App);
    initIO(App);
    initEventListeners(App); // Os listeners são os últimos a serem inicializados

    // Executa a primeira renderização e configurações
    App.actions.inicializarControlesDeCor();
    App.actions.renderizarTudo();
    App.elements.menuLinks[0].click();

    console.log("Construtor de Templates inicializado.");
});