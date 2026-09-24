/* ==========================================================================
   Agenda de Formações — dados vindos do WordPress (WP REST API)
   --------------------------------------------------------------------------
   Quando o projeto WordPress estiver publicado, defina a URL base abaixo,
   por exemplo:
       const WP_API_URL = 'https://sevs.recife.pe.gov.br/wp-json/wp/v2';
   Enquanto a constante estiver vazia, a agenda usa os dados locais de
   fallback (mesmo conteúdo exibido anteriormente de forma estática).

   Estrutura esperada para cada post da categoria de agenda:
     - title.rendered            → título da formação
     - content.rendered          → descrição (tags HTML são removidas)
     - meta.data / acf.data      → data do evento (AAAA-MM-DD); se ausente,
                                   usa a data de publicação do post
     - meta.local / acf.local    → modalidade/local (opcional)
     - categories                → filtradas pela categoria indicada em
                                   WP_CATEGORIA_AGENDA (id ou slug numérico)

   Este módulo é consumido pela página do NEPS (nucleos/neps/neps.html),
   que mantém os elementos #lista-agenda, #agenda-vazia e #agenda-erro
   no formato de exibição já existente.
   ========================================================================== */

const WP_API_URL = ''; // ex.: 'https://exemplo.recife.pe.gov.br/wp-json/wp/v2'
const WP_CATEGORIA_AGENDA = ''; // id numérico da categoria de agenda no WP
const WP_MAX_ITENS = 6;

const AGENDA_FALLBACK = [
    {
        data: '2026-10-07',
        titulo: 'Capacitação SINAN — Módulo Iniciante',
        descricao: 'Formação online voltada a profissionais recém-inseridos na rede de vigilância, com foco no registro de agravos de notificação compulsória.'
    },
    {
        data: '2026-10-21',
        titulo: 'Oficina de Investigação Epidemiológica de Surtos',
        descricao: 'Atividade presencial na sede da SEVS, com exercício simulado de resposta a surto de doença de causa desconhecida.'
    },
    {
        data: '2026-11-04',
        titulo: 'Ciclo de Palestras: Vigilância da Qualidade da Água',
        descricao: 'Encontro híbrido em parceria com a Vigilância Ambiental e o LACEN, abordando o programa VIGIAGUA e a análise de potabilidade.'
    },
];

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatarDataAgenda(isoDate) {
    const partes = String(isoDate || '').slice(0, 10).split('-');
    if (partes.length !== 3) return { dia: '--', mesAno: '--' };
    const [ano, mes, dia] = partes;
    const mesIndex = parseInt(mes, 10) - 1;
    return {
        dia,
        mesAno: `${MESES_ABREV[mesIndex] || mes}/${ano.slice(2)}`
    };
}

function removerTagsHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || '').trim();
}

function criarItemAgenda(evento) {
    const { dia, mesAno } = formatarDataAgenda(evento.data);

    const col = document.createElement('div');
    col.className = 'col-md-12';

    const linha = document.createElement('div');
    linha.className = 'd-flex gap-3 p-4 bg-body-custom rounded-4 border h-100 align-items-center';

    const blocoData = document.createElement('div');
    blocoData.className = 'text-center flex-shrink-0 px-3 py-2 bg-white rounded-3 shadow-sm';
    blocoData.style.minWidth = '84px';

    const elDia = document.createElement('div');
    elDia.className = 'fw-extrabold text-accent-orange';
    elDia.style.fontSize = '1.4rem';
    elDia.style.lineHeight = '1.1';
    elDia.textContent = dia;

    const elMes = document.createElement('div');
    elMes.className = 'text-muted small fw-bold text-uppercase';
    elMes.textContent = mesAno;

    blocoData.appendChild(elDia);
    blocoData.appendChild(elMes);

    const corpo = document.createElement('div');
    const elTitulo = document.createElement('div');
    elTitulo.className = 'fw-bold text-primary-dark mb-1';
    elTitulo.textContent = evento.titulo;
    const elDesc = document.createElement('div');
    elDesc.className = 'text-muted small';
    elDesc.textContent = evento.descricao;
    corpo.appendChild(elTitulo);
    corpo.appendChild(elDesc);

    linha.appendChild(blocoData);
    linha.appendChild(corpo);
    col.appendChild(linha);
    return col;
}

function normalizarPostWp(post) {
    const meta = post.meta || post.acf || {};
    return {
        data: meta.data || post.date,
        titulo: removerTagsHtml(post.title && post.title.rendered),
        descricao: removerTagsHtml(post.content && post.content.rendered)
    };
}

async function carregarAgendaFormacoes() {
    const lista = document.getElementById('lista-agenda');
    const estadoVazio = document.getElementById('agenda-vazia');
    const estadoErro = document.getElementById('agenda-erro');
    if (!lista || !estadoVazio || !estadoErro) return;

    let eventos = AGENDA_FALLBACK;

    if (WP_API_URL) {
        try {
            const params = new URLSearchParams({ per_page: String(WP_MAX_ITENS), _embed: '' });
            if (WP_CATEGORIA_AGENDA) params.set('categories', WP_CATEGORIA_AGENDA);
            const resposta = await fetch(`${WP_API_URL}/posts?${params.toString()}`);
            if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
            const posts = await resposta.json();
            if (!Array.isArray(posts)) throw new Error('Resposta inesperada da API');
            eventos = posts.map(normalizarPostWp);
        } catch (e) {
            console.warn('Falha ao carregar a agenda do WordPress.', e);
            estadoErro.classList.remove('d-none');
            return;
        }
    }

    lista.innerHTML = '';
    if (eventos.length === 0) {
        estadoVazio.classList.remove('d-none');
        return;
    }
    eventos
        .sort((a, b) => String(a.data).localeCompare(String(b.data)))
        .forEach(evento => lista.appendChild(criarItemAgenda(evento)));
}
