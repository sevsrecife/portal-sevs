const MATERIAIS = [
    { tema: 'Arboviroses', titulo: 'Cartilha de Prevenção às Arboviroses', data: '26/05/2026', pdf: '#' },
    { tema: 'Educação em Saúde', titulo: 'Guia de Educação em Saúde para Ações Territoriais', data: '15/05/2026', pdf: '#' },
    { tema: 'Notificação', titulo: 'Guia Rápido de Notificação Compulsória', data: '12/04/2026', pdf: '#' },
    { tema: 'Qualidade da Água', titulo: 'Material Educativo sobre Vigilância da Qualidade da Água', data: '20/03/2026', pdf: '#' },
    { tema: 'Saúde do Trabalhador', titulo: 'Cartilha de Prevenção de Agravos Relacionados ao Trabalho', data: '28/02/2026', pdf: '#' },
    { tema: 'Vigilância Sanitária', titulo: 'Boas Práticas para Serviços de Interesse à Saúde', data: '10/02/2026', pdf: '#' },
];

function letraInicial(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
}

function letrasDisponiveis() {
    return new Set(MATERIAIS.map(material => letraInicial(material.tema)));
}

function criarFiltroAlfabetico(letraAtiva, disponiveis) {
    const container = document.getElementById('filtro-alfabetico');
    if (!container) return;
    container.innerHTML = '';

    const btnTodos = document.createElement('button');
    btnTodos.className = 'btn-letra-todos' + (letraAtiva === 'TODOS' ? ' ativo' : '');
    btnTodos.textContent = 'Todos';
    btnTodos.setAttribute('aria-pressed', letraAtiva === 'TODOS');
    btnTodos.addEventListener('click', () => renderizar('TODOS'));
    container.appendChild(btnTodos);

    const separador = document.createElement('div');
    separador.style.cssText = 'width:1px;height:36px;background:#dee2e6;margin:0 4px;';
    container.appendChild(separador);

    for (let codigo = 65; codigo <= 90; codigo++) {
        const letra = String.fromCharCode(codigo);
        const disponivel = disponiveis.has(letra);
        const btn = document.createElement('button');
        btn.className = 'btn-letra' + (letraAtiva === letra ? ' ativo' : '') + (disponivel ? '' : ' disabled');
        btn.textContent = letra;
        btn.setAttribute('aria-label', `Filtrar por ${letra}`);
        btn.setAttribute('aria-pressed', letraAtiva === letra);
        if (disponivel) btn.addEventListener('click', () => renderizar(letra));
        container.appendChild(btn);
    }
}

function criarItemMaterial(material) {
    const disponivel = material.pdf !== '#';
    const item = document.createElement(disponivel ? 'a' : 'div');
    item.className = 'list-group-item material-item d-flex justify-content-between align-items-center gap-3' + (disponivel ? ' list-group-item-action' : ' item-indisponivel');
    if (disponivel) {
        item.href = material.pdf;
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');
    }
    item.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 flex-grow-1 min-width-0">
            <span class="material-tag flex-shrink-0">${material.tema}</span>
            <div class="min-width-0">
                <h5 class="mb-0 fw-bold text-primary-dark">${material.titulo}</h5>
                <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>Publicado em: ${material.data}</small>
            </div>
        </div>
        <span class="btn-pdf flex-shrink-0"><i class="bi bi-download me-1"></i>${disponivel ? 'PDF' : 'PDF indisponível'}</span>
    `;
    return item;
}

function criarGrupoLetra(letra) {
    const grupo = document.createElement('div');
    grupo.className = 'grupo-letra';
    grupo.innerHTML = `<span class="grupo-letra-char">${letra}</span><span class="grupo-letra-linha"></span>`;
    return grupo;
}

function renderizar(letraAtiva) {
    const disponiveis = letrasDisponiveis();
    criarFiltroAlfabetico(letraAtiva, disponiveis);

    const lista = document.getElementById('lista-materiais');
    const estadoVazio = document.getElementById('estado-vazio');
    const contador = document.getElementById('resultado-contador');
    if (!lista || !estadoVazio || !contador) return;

    const filtrados = letraAtiva === 'TODOS'
        ? [...MATERIAIS]
        : MATERIAIS.filter(material => letraInicial(material.tema) === letraAtiva);

    lista.innerHTML = '';
    if (filtrados.length === 0) {
        lista.classList.add('d-none');
        estadoVazio.classList.remove('d-none');
        contador.textContent = '0 materiais';
        return;
    }

    lista.classList.remove('d-none');
    estadoVazio.classList.add('d-none');
    contador.textContent = `${filtrados.length} ${filtrados.length > 1 ? 'materiais' : 'material'}`;

    const grupos = filtrados.reduce((resultado, material) => {
        const letra = letraInicial(material.tema);
        if (!resultado[letra]) resultado[letra] = [];
        resultado[letra].push(material);
        return resultado;
    }, {});

    Object.keys(grupos).sort().forEach(letra => {
        if (letraAtiva === 'TODOS') lista.appendChild(criarGrupoLetra(letra));
        grupos[letra].forEach(material => lista.appendChild(criarItemMaterial(material)));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (erro) {
        console.warn('VLibras não pôde ser carregado.', erro);
    }
    renderizar('TODOS');
});
