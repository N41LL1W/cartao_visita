// main.js - O Ponto de Entrada da Aplicação

import { initGridModule } from './modules/grid.js';
import { initBackgroundModule } from './modules/background.js';
import { initWidgetsModule } from './modules/widgets.js';
import { initIOModule } from './modules/io.js';

document.addEventListener('DOMContentLoaded', () => {
    // Objeto global da aplicação que guarda o estado e as referências
    const App = {
        // 1. Estado Central
        state: {
            colSizes: ['1fr'],
            rowSizes: ['1fr'],
            widgets: [],
        },
        // 2. Mapeamento de Elementos DOM
        elements: {
            canvas: document.getElementById('canvas-template'),
            // Adicione TODOS os outros elementos do DOM aqui
            btnAddColuna: document.getElementById('btn-add-coluna'),
            btnRemoveColuna: document.getElementById('btn-remove-coluna'),
            colunaSizesContainer: document.getElementById('coluna-sizes-container'),
            btnAddLinha: document.getElementById('btn-add-linha'),
            btnRemoveLinha: document.getElementById('btn-remove-linha'),
            linhaSizesContainer: document.getElementById('linha-sizes-container'),
            // ...e assim por diante para TODOS os seus inputs, botões e divs.
            menuLinks: document.querySelectorAll('.dashboard-menu .menu-link'),
            secoesConteudo: document.querySelectorAll('.dashboard-conteudo .secao'),
            // ...
        },
        // 3. Funções de Renderização (que serão preenchidas pelos módulos)
        render: {},
    };

    // 4. Inicializa cada módulo, passando o objeto App
    initGridModule(App);
    initBackgroundModule(App);
    initWidgetsModule(App);
    initIOModule(App);

    // --- Lógica de Navegação do Dashboard (pertence ao main.js) ---
    App.elements.menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            App.elements.menuLinks.forEach(l => l.classList.remove('ativo'));
            link.classList.add('ativo');
            App.elements.secoesConteudo.forEach(secao => secao.classList.add('escondido'));
            document.getElementById(link.dataset.secao)?.classList.remove('escondido');
        });
    });

    // --- INICIALIZAÇÃO GERAL ---
    console.log("Iniciando o Construtor...");
    App.render.grid();
    App.render.background();
    App.elements.menuLinks[0].click(); // Abre a primeira aba
    console.log("Construtor pronto!");
});