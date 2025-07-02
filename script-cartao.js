document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const dadosCodificados = params.get('data');

    if (!dadosCodificados) {
        document.body.innerHTML = "<h1>Nenhum dado fornecido para gerar o cartão.</h1>";
        return;
    }

    try {
        const dados = JSON.parse(decodeURIComponent(dadosCodificados));

        // --- PREENCHE DADOS BÁSICOS ---
        document.getElementById('frente-nome').textContent = dados.nome;
        document.getElementById('frente-profissao').textContent = dados.profissao;
        document.getElementById('frente-whatsapp').textContent = dados.whatsapp;
        document.getElementById('verso-nome').textContent = dados.nome;
        document.getElementById('verso-tagline').textContent = dados.tagline;
        document.getElementById('verso-contato').textContent = dados.whatsapp;
        
        const qrcodeImg = document.getElementById('frente-qrcode');
        if (dados.qrcode) {
            qrcodeImg.src = dados.qrcode;
            qrcodeImg.style.display = 'block';
        } else {
            qrcodeImg.style.display = 'none';
        }

        const listaServicos = document.getElementById('verso-servicos');
        listaServicos.innerHTML = '';
        if (dados.servicos) {
            dados.servicos.forEach(servico => {
                if (servico.trim() !== '') {
                    const li = document.createElement('li');
                    li.textContent = servico;
                    listaServicos.appendChild(li);
                }
            });
        }
        
        // --- CUSTOMIZA O ESTILO ---
        if (dados.design) {
            const frenteDiv = document.querySelector('.lado.frente');
            const folhaEstilo = document.styleSheets[0]; // Pega a primeira folha de estilo (style.css)

            // Aplica estilo do verso
            const dVerso = dados.design.verso;
            if (dVerso) {
                let cssBackground;
                if (dVerso.tipo === 'solida') {
                    cssBackground = dVerso.solida;
                } else {
                    const cores = [dVerso.gradiente.cor1, dVerso.gradiente.cor2];
                    if (dVerso.gradiente.usarCor3) { cores.push(dVerso.gradiente.cor3); }
                    cssBackground = `linear-gradient(${dVerso.gradiente.angulo}deg, ${cores.join(', ')})`;
                }
                folhaEstilo.insertRule(`.verso { background: ${cssBackground} !important; }`, folhaEstilo.cssRules.length);
            }
            
            // Aplica estilo da frente
            const dFrente = dados.design.frente;
            if (dFrente && frenteDiv) {
                frenteDiv.classList.add(dFrente.template);
                frenteDiv.style.setProperty('--cor-frente-1', dFrente.cor1);
                frenteDiv.style.setProperty('--cor-frente-2', dFrente.cor2);
            }
        }
    } catch (error) {
        console.error("Erro ao processar os dados do cartão:", error);
        document.body.innerHTML = "<h1>Erro ao carregar dados do cartão.</h1>";
    }
});