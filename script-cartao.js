// script-cartao.js (versão que renderiza layouts customizados)

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const dadosCodificados = params.get('data');

    if (!dadosCodificados) {
        document.body.innerHTML = "<h1>Nenhum dado fornecido.</h1>";
        return;
    }

    try {
        const dados = JSON.parse(decodeURIComponent(dadosCodificados));
        
        // Função auxiliar para converter hex para rgba
        const hexToRgba = (hex, alpha = 1) => {
            let r=0,g=0,b=0;if(hex.length==4){r="0x"+hex[1]+hex[1];g="0x"+hex[2]+hex[2];b="0x"+hex[3]+hex[3];}else if(hex.length==7){r="0x"+hex[1]+hex[2];g="0x"+hex[3]+hex[4];b="0x"+hex[5]+hex[6];} return `rgba(${+r},${+g},${+b},${alpha})`;
        };

        const frenteDiv = document.querySelector('.lado.frente');
        
        // Verifica se é um template customizado do builder
        if (dados.template && dados.conteudo) {
            const layout = dados.template;
            const conteudo = dados.conteudo;

            frenteDiv.innerHTML = ''; // Limpa o conteúdo padrão
            
            // 1. Aplica o fundo e sobreposição
            let backgroundLayers = [];
            if (layout.sobreposicao && layout.sobreposicao.ativa) {
                if (layout.sobreposicao.tipo === 'cor') {
                    backgroundLayers.push(hexToRgba(layout.sobreposicao.cor, layout.sobreposicao.opacidade));
                } else { // gradiente
                    const coresArray = layout.sobreposicao.cores.map(c => hexToRgba(c.cor, c.opacidade));
                    backgroundLayers.push(`linear-gradient(${layout.sobreposicao.angulo}deg, ${coresArray.join(', ')})`);
                }
            }
            if (layout.fundo.tipo === 'imagem') {
                backgroundLayers.push(`url('${layout.fundo.url || ''}') no-repeat center center / cover`);
                frenteDiv.style.opacity = layout.fundo.opacidade;
            } else if (layout.fundo.tipo === 'gradiente') {
                const coresArray = layout.fundo.cores.map(c => hexToRgba(c.cor, c.opacidade));
                backgroundLayers.push(`linear-gradient(${layout.fundo.angulo}deg, ${coresArray.join(', ')})`);
            } else { // cor sólida
                backgroundLayers.push(hexToRgba(layout.fundo.cor, layout.fundo.opacidade));
            }
            frenteDiv.style.background = backgroundLayers.join(', ');

            // 2. Cria o Grid
            frenteDiv.style.display = 'grid';
            frenteDiv.style.gridTemplateColumns = layout.estruturaGrid.colunas.join(' ');
            frenteDiv.style.gridTemplateRows = layout.estruturaGrid.linhas.join(' ');
            frenteDiv.style.padding = '10px'; // Um padding base

            // 3. Renderiza os Widgets
            layout.widgets.forEach(widgetInfo => {
                const celula = document.createElement('div');
                celula.style.gridRowStart = Math.floor(widgetInfo.celulaId / layout.estruturaGrid.colunas.length) + 1;
                celula.style.gridColumnStart = (widgetInfo.celulaId % layout.estruturaGrid.colunas.length) + 1;
                celula.style.display = 'flex';
                celula.style.justifyContent = 'center';
                celula.style.alignItems = 'center';
                celula.style.overflow = 'hidden';

                const valorWidget = conteudo[widgetInfo.tipo] || '';
                if (valorWidget) {
                    let widgetElement;
                    if (['logo', 'qrcode'].includes(widgetInfo.tipo)) {
                        widgetElement = document.createElement('img');
                        widgetElement.src = valorWidget;
                        widgetElement.alt = widgetInfo.tipo;
                        widgetElement.style.maxWidth = '100%';
                        widgetElement.style.maxHeight = '100%';
                        widgetElement.style.objectFit = 'contain';
                    } else {
                        widgetElement = document.createElement('div');
                        // Aqui você pode adicionar lógica para criar h1, p, etc. com base no tipo
                        widgetElement.innerHTML = `<span class="info" style="font-size: 1.2em; color: white; text-shadow: 1px 1px 2px black;">${valorWidget}</span>`;
                    }
                    celula.appendChild(widgetElement);
                }
                frenteDiv.appendChild(celula);
            });
            // Oculta o verso para focar na pré-visualização da frente
            document.querySelector('.lado.verso').style.display = 'none';

        } else {
            // Lógica antiga para templates pré-definidos (do editor principal)
            const frenteDiv = document.querySelector('.lado.frente');
            frenteDiv.classList.add(dados.design.frente.template);
            frenteDiv.style.setProperty('--cor-frente-1', dados.design.frente.cor1);
            frenteDiv.style.setProperty('--cor-frente-2', dados.design.frente.cor2);
            // Preenche os dados nos elementos existentes
            document.getElementById('frente-nome').textContent = dados.nome;
            // ... etc para os outros campos
        }

    } catch (error) {
        console.error("Erro ao processar dados do cartão:", error);
        document.body.innerHTML = "<h1>Erro ao carregar dados.</h1>";
    }
});