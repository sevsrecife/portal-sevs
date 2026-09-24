/* ==========================================================================
   Boletins Epidemiológicos — Dados Estáticos, Filtro e Renderização
   ========================================================================== */

const BOLETINS = [
    // A
    { agravo: "Arboviroses", titulo: "Boletim de Arboviroses — Semanas Epidemiológicas 1 a 20 de 2026", data: "26/05/2026", pdf: "#" },
    // C
    { agravo: "Chikungunya", titulo: "Boletim de Chikungunya — 1º Quadrimestre de 2026", data: "30/04/2026", pdf: "#" },
    // D
    { agravo: "Dengue", titulo: "Boletim de Dengue — Semana Epidemiológica 20/2026", data: "26/05/2026", pdf: "#" },
    { agravo: "Dengue", titulo: "Boletim de Dengue — Semana Epidemiológica 10/2026", data: "16/03/2026", pdf: "#" },
    { agravo: "Doenças Diarreicas Agudas", titulo: "Boletim de DDA — 1º Trimestre de 2026", data: "15/04/2026", pdf: "#" },
    // F
    { agravo: "Febre Amarela", titulo: "Boletim de Febre Amarela — Situação Epidemiológica 2025", data: "20/01/2026", pdf: "#" },
    // H
    { agravo: "Hanseníase", titulo: "Boletim de Hanseníase — Série Histórica 2020–2025 Recife", data: "28/01/2026", pdf: "#" },
    { agravo: "Hepatites Virais", titulo: "Boletim de Hepatites Virais — 2025", data: "10/02/2026", pdf: "#" },
    // I
    { agravo: "Influenza e SRAG", titulo: "Boletim de Influenza e SRAG — Semanas Epidemiológicas 1 a 15/2026", data: "20/04/2026", pdf: "#" },
    // L
    { agravo: "Leishmaniose Visceral", titulo: "Boletim de Leishmaniose Visceral — 2025", data: "15/03/2026", pdf: "#" },
    // M
    { agravo: "Mortalidade Infantil", titulo: "Boletim de Mortalidade Infantil — Recife 2024", data: "20/02/2026", pdf: "#" },
    { agravo: "Mpox", titulo: "Boletim de Mpox — Situação Epidemiológica Recife 2025", data: "10/11/2025", pdf: "#" },
    // S
    { agravo: "Sífilis", titulo: "Boletim de Sífilis Congênita e em Gestantes — 1º Quadrimestre 2026", data: "12/05/2026", pdf: "#" },
    { agravo: "SRAG", titulo: "Boletim de SRAG — Sazonalidade Inverno 2026", data: "02/06/2026", pdf: "#" },
    // T
    { agravo: "Tuberculose", titulo: "Boletim de Tuberculose — Indicadores Operacionais 2025", data: "24/03/2026", pdf: "#" },
    // V
    { agravo: "Violência Interpessoal", titulo: "Boletim de Violência Interpessoal e Autoprovocada — 2025", data: "05/01/2026", pdf: "#" },
    { agravo: "Varicela", titulo: "Boletim de Varicela — Controle de Surtos em 2025", data: "10/12/2025", pdf: "#" },
];

function normalizarTermos(texto) {
    return texto
        .replace(/\bÓbito(s)?\b/gi, (_, s) => "Mortalidade" + (s ? "s" : ""))
        .replace(/\bNascimento(s)?\b/gi, (_, s) => "Natalidade" + (s ? "s" : ""));
}

function letraInicial(texto) {
    if (!texto) return '';
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase();
}

function letrasDisponiveis() {
    return new Set(BOLETINS.map(b => letraInicial(b.agravo)));
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

    const separador = document.createElement("div");
    separador.style.cssText = "width:1px;height:36px;background:#dee2e6;margin:0 4px;";
    container.appendChild(separador);

    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const disponivel = disponiveis.has(letra);
        const btn = document.createElement("button");
        btn.className = "btn-letra" +
            (letraAtiva === letra ? " ativo" : "") +
            (disponivel ? "" : " disabled");
        btn.textContent = letra;
        btn.setAttribute("aria-label", `Filtrar por ${letra}`);
        btn.setAttribute("aria-pressed", letraAtiva === letra);
        if (disponivel) btn.addEventListener("click", () => renderizar(letra));
        container.appendChild(btn);
    }
}

function criarItemBoletim(boletim) {
    const titulo = normalizarTermos(boletim.titulo);
    const agravo = normalizarTermos(boletim.agravo);

    const disponivel = boletim.pdf !== "#";
    const item = document.createElement(disponivel ? "a" : "div");
    item.className = "list-group-item boletim-item d-flex justify-content-between align-items-center gap-3" + (disponivel ? " list-group-item-action" : " item-indisponivel");
    if (disponivel) {
        item.href = boletim.pdf;
        item.setAttribute("target", "_blank");
        item.setAttribute("rel", "noopener noreferrer");
    }
    item.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 flex-grow-1 min-width-0">
            <span class="boletim-tag flex-shrink-0">${agravo}</span>
            <div class="min-width-0">
                <h5 class="mb-0 fw-bold text-primary-dark boletim-titulo">${titulo}</h5>
                <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>Publicado em: ${boletim.data}</small>
            </div>
        </div>
        <span class="btn-pdf flex-shrink-0"><i class="bi bi-download me-1"></i>${disponivel ? "PDF" : "PDF indisponível"}</span>
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

    const lista = document.getElementById("lista-boletins");
    const estadoVazio = document.getElementById("estado-vazio");
    const contador = document.getElementById("resultado-contador");
    if (!lista || !estadoVazio || !contador) return;

    lista.innerHTML = "";

    const filtrados = letraAtiva === "TODOS"
        ? [...BOLETINS]
        : BOLETINS.filter(b => letraInicial(b.agravo) === letraAtiva);

    if (filtrados.length === 0) {
        lista.classList.add("d-none");
        estadoVazio.classList.remove("d-none");
        contador.textContent = "0 boletins";
        return;
    }

    lista.classList.remove("d-none");
    estadoVazio.classList.add("d-none");
    contador.textContent = `${filtrados.length} ${filtrados.length > 1 ? "boletins" : "boletim"}`;

    const grupos = filtrados.reduce((acc, b) => {
        const letra = letraInicial(b.agravo);
        if (!acc[letra]) acc[letra] = [];
        acc[letra].push(b);
        return acc;
    }, {});

    Object.keys(grupos).sort().forEach(letra => {
        if (letraAtiva === "TODOS") lista.appendChild(criarGrupoLetra(letra));
        grupos[letra].forEach(b => lista.appendChild(criarItemBoletim(b)));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('VLibras não pôde ser carregado.', e);
    }
    renderizar("TODOS");
});
