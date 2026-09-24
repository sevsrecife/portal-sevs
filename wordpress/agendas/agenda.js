/* ========================================================================
    Agenda de Formacoes - fonte de dados local
   --------------------------------------------------------------------------
     ======================================================================== */



















const AGENDA_DATA_URL = '../../wordpress/agendas/dados/agendas.json';

function textoSeguro(valor) {
    return String(valor || '').trim();
}

function removerTagsHtml(html) {
    const container = document.createElement('div');
    container.innerHTML = html || '';
    return textoSeguro(container.textContent);
}

function formatarData(data) {
    const partes = textoSeguro(data).slice(0, 10).split('-');
    if (partes.length !== 3) return { dia: '--', mesAno: 'Data a confirmar' };

    const [ano, mes, dia] = partes;
    const dataValida = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (Number.isNaN(dataValida.getTime())) return { dia: '--', mesAno: 'Data a confirmar' };

    return {
        dia,
        mesAno: dataValida.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')
    };
}

function criarTextoMeta(icone, valor, rotulo) {
    if (!valor) return null;

    const elemento = document.createElement('span');
    elemento.className = 'agenda-meta-item';
    elemento.innerHTML = `<i class="bi ${icone}" aria-hidden="true"></i>`;
    elemento.append(document.createTextNode(` ${rotulo}: ${valor}`));
    return elemento;
}

function criarItemAgenda(evento) {
    const { dia, mesAno } = formatarData(evento.data);
    const coluna = document.createElement('div');
    coluna.className = 'col-12';

    const artigo = document.createElement('article');
    artigo.className = 'agenda-item d-flex flex-column flex-md-row gap-3 p-4 bg-body-custom rounded-4 border h-100';

    const blocoData = document.createElement('div');
    blocoData.className = 'agenda-date text-center flex-shrink-0 px-3 py-2 bg-white rounded-3 shadow-sm';
    blocoData.setAttribute('aria-label', `Data: ${dia} de ${mesAno}`);
    blocoData.innerHTML = `<strong class="agenda-date-day">${dia}</strong><span class="agenda-date-month">${mesAno}</span>`;

    const corpo = document.createElement('div');
    corpo.className = 'flex-grow-1';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'd-flex flex-wrap align-items-start justify-content-between gap-2 mb-2';

    const titulo = document.createElement('h3');
    titulo.className = 'h5 fw-bold text-primary-dark mb-0';
    titulo.textContent = textoSeguro(evento.titulo) || 'Formacao sem titulo';
    cabecalho.appendChild(titulo);

    const status = document.createElement('span');
    status.className = 'badge agenda-status rounded-pill';
    status.textContent = textoSeguro(evento.status) || 'Agendada';
    cabecalho.appendChild(status);

    const descricao = document.createElement('p');
    descricao.className = 'text-muted small mb-3';
    descricao.textContent = textoSeguro(evento.descricao);

    const metadados = document.createElement('div');
    metadados.className = 'agenda-meta d-flex flex-wrap gap-3 text-muted small';
    [
        criarTextoMeta('bi-clock', evento.horario, 'Horário'),
        criarTextoMeta('bi-geo-alt', evento.local, 'Local'),
        criarTextoMeta('bi-people', evento.publicoAlvo, 'Público'),
        criarTextoMeta('bi-laptop', evento.modalidade, 'Modalidade')
    ].filter(Boolean).forEach(item => metadados.appendChild(item));

    corpo.append(cabecalho, descricao, metadados);

    if (evento.inscricao) {
        const inscricao = document.createElement('a');
        inscricao.className = 'btn btn-sm btn-outline-primary-dark rounded-pill align-self-start align-self-md-center flex-shrink-0';
        inscricao.href = evento.inscricao;
        inscricao.target = '_blank';
        inscricao.rel = 'noopener noreferrer';
        inscricao.innerHTML = '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Inscricao';
        artigo.appendChild(inscricao);
    }

    artigo.prepend(blocoData);
    artigo.appendChild(corpo);
    coluna.appendChild(artigo);
    return coluna;
}

function normalizarEvento(evento) {
    return {
        data: evento.data || evento.meta?.data || evento.acf?.data || evento.date,
        horario: evento.horario || evento.meta?.horario || evento.acf?.horario,
        local: evento.local || evento.meta?.local || evento.acf?.local,
        publicoAlvo: evento.publicoAlvo || evento.publico_alvo || evento.meta?.publico_alvo || evento.acf?.publico_alvo,
        descricao: removerTagsHtml(evento.descricao || evento.content?.rendered),
        modalidade: evento.modalidade || evento.meta?.modalidade || evento.acf?.modalidade,
        status: evento.status || evento.meta?.status || evento.acf?.status,
        inscricao: evento.inscricao || evento.link_inscricao || evento.meta?.inscricao || evento.acf?.inscricao,
        titulo: removerTagsHtml(evento.titulo || evento.title?.rendered)
    };
}

async function buscarEventos() {
    const resposta = await fetch(AGENDA_DATA_URL);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    if (!Array.isArray(dados)) throw new Error('Fonte local de agenda invalida');
    return dados.map(normalizarEvento);
}

async function carregarAgendaFormacoes() {
    const lista = document.getElementById('lista-agenda');
    const estadoVazio = document.getElementById('agenda-vazia');
    const estadoErro = document.getElementById('agenda-erro');
    if (!lista || !estadoVazio || !estadoErro) return;

    lista.setAttribute('aria-busy', 'true');
    lista.innerHTML = '<div class="col-12 text-center py-4 text-muted">Carregando agenda...</div>';
    estadoVazio.classList.add('d-none');
    estadoErro.classList.add('d-none');

    try {
        const eventos = (await buscarEventos()).sort((a, b) => String(a.data).localeCompare(String(b.data)));
        lista.replaceChildren();
        if (eventos.length === 0) {
            estadoVazio.classList.remove('d-none');
            return;
        }
        eventos.forEach(evento => lista.appendChild(criarItemAgenda(evento)));
    } catch (erro) {
        console.warn('Nao foi possivel carregar a agenda.', erro);
        lista.replaceChildren();
        estadoErro.classList.remove('d-none');
    } finally {
        lista.setAttribute('aria-busy', 'false');
    }
}
