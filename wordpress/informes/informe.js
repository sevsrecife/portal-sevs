/* ==========================================================================
   Informes Epidemiológicos — Dados, Filtro e Renderização
   ========================================================================== */

const INFORMES = [
    // A
    { agravo: "Arboviroses", titulo: "Arboviroses — Fluxo de Coleta Laboratorial para Dengue e Zika", tipo: "Informe Técnico", numero: "03/2026", data: "20/05/2026", pdf: "#" },
    // C
    { agravo: "Chikungunya", titulo: "Chikungunya — Orientações para Manejo Clínico na APS", tipo: "Nota Informativa", numero: "08/2026", data: "10/04/2026", pdf: "#" },
    // D
    { agravo: "Dengue", titulo: "Dengue — Alerta para Elevação de Casos no Recife", tipo: "Alerta Epidemiológico", numero: "01/2026", data: "05/03/2026", pdf: "#" },
    { agravo: "Doenças Diarreicas Agudas", titulo: "DDA — Protocolo de Vigilância Sentinela nas USFs", tipo: "Informe Técnico", numero: "02/2026", data: "18/02/2026", pdf: "#" },
    // F
    { agravo: "Febre Amarela", titulo: "Febre Amarela — Atualização da Área com Recomendação de Vacinação", tipo: "Nota Informativa", numero: "01/2025", data: "10/01/2025", pdf: "#" },
    // H
    { agravo: "Hepatites Virais", titulo: "Hepatites Virais — Calendário de Testagem Rápida nas USFs", tipo: "Informe Técnico", numero: "04/2026", data: "28/04/2026", pdf: "#" },
    // I
    { agravo: "Influenza", titulo: "Influenza — Ações para o Período de Maior Circulação (Outono/Inverno)", tipo: "Alerta Epidemiológico", numero: "02/2025", data: "22/04/2025", pdf: "#" },
    { agravo: "ISTs", titulo: "ISTs — Intensificação do Rastreamento de Sífilis no Pré-Natal", tipo: "Nota Informativa", numero: "05/2026", data: "15/05/2026", pdf: "#" },
    // L
    { agravo: "Leishmaniose Visceral", titulo: "Leishmaniose Visceral — Orientações para Investigação de Casos", tipo: "Informe Técnico", numero: "01/2025", data: "20/03/2025", pdf: "#" },
    // M
    { agravo: "Mpox", titulo: "Mpox — Protocolo de Isolamento e Comunicação de Casos", tipo: "Nota Informativa", numero: "03/2025", data: "08/07/2025", pdf: "#" },
    // O
    { agravo: "Oropouche", titulo: "Oropouche — Fluxo de Coleta de Amostras para o LACEN", tipo: "Informe Técnico", numero: "05/2026", data: "30/05/2026", pdf: "#" },
    // R
    { agravo: "Raiva Humana", titulo: "Raiva Humana — Conduta pós-Exposição e Rede de Atendimento", tipo: "Nota Informativa", numero: "02/2026", data: "12/02/2026", pdf: "#" },
    // S
    { agravo: "Sífilis Congênita", titulo: "Sífilis Congênita — Reforço das Ações de Rastreamento", tipo: "Alerta Epidemiológico", numero: "04/2025", data: "14/10/2025", pdf: "#" },
    { agravo: "SRAG", titulo: "SRAG — Vacinação do Público Prioritário nas USFs", tipo: "Nota Informativa", numero: "12/2026", data: "22/05/2026", pdf: "#" },
    // T
    { agravo: "Tuberculose", titulo: "Tuberculose — Campanha de Busca Ativa nos Territórios Vulneráveis", tipo: "Informe Técnico", numero: "01/2026", data: "24/03/2026", pdf: "#" },
    // V
    { agravo: "Varicela", titulo: "Varicela — Controle de Surtos em Ambientes Coletivos", tipo: "Nota Informativa", numero: "06/2025", data: "05/05/2025", pdf: "#" },
    { agravo: "Violência Interpessoal", titulo: "Violência Interpessoal — Fluxo de Notificação e Encaminhamento", tipo: "Informe Técnico", numero: "02/2025", data: "28/02/2025", pdf: "#" },
];

const CLASSES_TIPO = {
    "Alerta Epidemiológico": "badge-tipo-alerta",
    "Informe Técnico":       "badge-tipo-informe",
    "Nota Informativa":      "badge-tipo-nota",
};

function letraInicial(texto) {
    if (!texto) return '';
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase();
}

function letrasDisponiveis() {
    return new Set(INFORMES.map(i => letraInicial(i.agravo)));
}

function criarFiltroAlfabetico(letraAtiva, disponiveis) {
    const container = document.getElementById("filtro-alfabetico");
    if (!container) return;
    container.innerHTML = "";

    const btnTodos = document.createElement("button");
    btnTodos.className = "btn-letra-todos" + (letraAtiva === "TODOS" ? " ativo" : "");
    btnTodos.textContent = "Todos";
    btnTodos.setAttribute("aria-pressed", letraAtiva === "TODOS");
    btnTodos.addEventListener("click", () => renderizar("TODOS"));
    container.appendChild(btnTodos);

    const sep = document.createElement("div");
    sep.style.cssText = "width:1px;height:36px;background:#dee2e6;margin:0 4px;";
    container.appendChild(sep);

    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const disponivel = disponiveis.has(letra);
        const btn = document.createElement("button");
        btn.className = "btn-letra" + (letraAtiva === letra ? " ativo" : "") + (disponivel ? "" : " disabled");
        btn.textContent = letra;
        btn.setAttribute("aria-label", `Filtrar por ${letra}`);
        btn.setAttribute("aria-pressed", letraAtiva === letra);
        if (disponivel) btn.addEventListener("click", () => renderizar(letra));
        container.appendChild(btn);
    }
}

function criarItemInforme(informe) {
    const classesBadge = CLASSES_TIPO[informe.tipo] || "badge-tipo-informe";
    const disponivel = informe.pdf !== "#";
    const item = document.createElement(disponivel ? "a" : "div");
    item.className = "list-group-item informe-item d-flex justify-content-between align-items-center gap-3" + (disponivel ? " list-group-item-action" : " item-indisponivel");
    if (disponivel) {
        item.href = informe.pdf;
        item.setAttribute("target", "_blank");
        item.setAttribute("rel", "noopener noreferrer");
    }
    item.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 flex-grow-1 min-width-0">
            <span class="agravo-tag flex-shrink-0">${informe.agravo}</span>
            <div class="min-width-0">
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span class="badge ${classesBadge} rounded-pill px-2 py-1" style="font-size:0.7rem;font-weight:700;">${informe.tipo} ${informe.numero}</span>
                </div>
                <h5 class="mb-0 fw-bold text-primary-dark">${informe.titulo}</h5>
                <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>Publicado em: ${informe.data}</small>
            </div>
        </div>
        <span class="btn-ler flex-shrink-0"><i class="bi bi-file-earmark-text me-1"></i>${disponivel ? "Ler" : "Indisponível"}</span>
    `;
    return item;
}

function criarGrupoLetra(letra) {
    const div = document.createElement("div");
    div.className = "grupo-letra";
    div.innerHTML = `<span class="grupo-letra-char">${letra}</span><span class="grupo-letra-linha"></span>`;
    return div;
}

function renderizar(letraAtiva) {
    const disponiveis = letrasDisponiveis();
    criarFiltroAlfabetico(letraAtiva, disponiveis);

    const lista    = document.getElementById("lista-informes");
    const vazio    = document.getElementById("estado-vazio");
    const contador = document.getElementById("resultado-contador");
    if (!lista || !vazio || !contador) return;
    lista.innerHTML = "";

    const filtrados = letraAtiva === "TODOS"
        ? [...INFORMES]
        : INFORMES.filter(i => letraInicial(i.agravo) === letraAtiva);

    if (filtrados.length === 0) {
        lista.classList.add("d-none");
        vazio.classList.remove("d-none");
        contador.textContent = "0 informes";
        return;
    }

    lista.classList.remove("d-none");
    vazio.classList.add("d-none");
    contador.textContent = `${filtrados.length} informe${filtrados.length > 1 ? "s" : ""}`;

    const grupos = filtrados.reduce((acc, i) => {
        const l = letraInicial(i.agravo);
        if (!acc[l]) acc[l] = [];
        acc[l].push(i);
        return acc;
    }, {});

    Object.keys(grupos).sort().forEach(letra => {
        lista.appendChild(criarGrupoLetra(letra));
        grupos[letra].forEach(i => lista.appendChild(criarItemInforme(i)));
    });
}

function inicializar() {
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('VLibras não pôde ser carregado.', e);
    }
    renderizar("TODOS");
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}
