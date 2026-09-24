/* ==========================================================================
   Perfis Epidemiológicos — Dados, Filtro e Renderização
   ========================================================================== */

const PERFIS = [
    // A
    { agravo: "Arboviroses", titulo: "Perfil Epidemiológico das Arboviroses — 2025", periodo: "2025", data: "15/01/2026", pdf: "#" },
    // D
    { agravo: "Dengue", titulo: "Perfil Epidemiológico da Dengue — Série Histórica 2019–2025", periodo: "2019–2025", data: "28/01/2026", pdf: "#" },
    // H
    { agravo: "Hepatites Virais", titulo: "Perfil Epidemiológico das Hepatites Virais — 2024", periodo: "2024", data: "10/02/2026", pdf: "#" },
    // I
    { agravo: "Influenza e SRAG", titulo: "Perfil Epidemiológico da Influenza e SRAG — Ano Epidemiológico 2025", periodo: "2025", data: "20/02/2026", pdf: "#" },
    // L
    { agravo: "Leishmaniose", titulo: "Perfil Epidemiológico das Leishmanioses — 2024", periodo: "2024", data: "05/03/2026", pdf: "#" },
    // M
    { agravo: "Mortalidade Infantil", titulo: "Perfil da Mortalidade Infantil em Recife — 2023–2025", periodo: "2023–2025", data: "14/03/2026", pdf: "#" },
    { agravo: "Mortalidade por Causas Externas", titulo: "Perfil da Mortalidade por Causas Externas — 2025", periodo: "2025", data: "22/03/2026", pdf: "#" },
    { agravo: "Mpox", titulo: "Perfil Epidemiológico do Mpox — 2024–2025", periodo: "2024–2025", data: "10/11/2025", pdf: "#" },
    // N
    { agravo: "Natalidade e Saúde Materna", titulo: "Perfil da Natalidade e Saúde Materna — Recife 2025", periodo: "2025", data: "22/04/2026", pdf: "#" },
    // S
    { agravo: "Sífilis", titulo: "Perfil Epidemiológico da Sífilis Congênita e Adquirida — 2025", periodo: "2025", data: "05/05/2026", pdf: "#" },
    { agravo: "SRAG", titulo: "Perfil Epidemiológico da SRAG — Sazonalidade 2025", periodo: "2025", data: "18/05/2026", pdf: "#" },
    // T
    { agravo: "Tuberculose", titulo: "Perfil Epidemiológico da Tuberculose — 2024–2025", periodo: "2024–2025", data: "24/03/2026", pdf: "#" },
    // V
    { agravo: "Violência Interpessoal", titulo: "Perfil Epidemiológico da Violência Interpessoal — 2024", periodo: "2024", data: "10/12/2025", pdf: "#" },
];

function letraInicial(texto) {
    if (!texto) return '';
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").charAt(0).toUpperCase();
}

function letrasDisponiveis() {
    return new Set(PERFIS.map(p => letraInicial(p.agravo)));
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

function criarItemPerfil(perfil) {
    const disponivel = perfil.pdf !== "#";
    const item = document.createElement(disponivel ? "a" : "div");
    item.className = "list-group-item perfil-item d-flex justify-content-between align-items-center gap-3" + (disponivel ? " list-group-item-action" : " item-indisponivel");
    if (disponivel) {
        item.href = perfil.pdf;
        item.setAttribute("target", "_blank");
        item.setAttribute("rel", "noopener noreferrer");
    }
    item.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 flex-grow-1 min-width-0">
            <span class="agravo-tag flex-shrink-0">${perfil.agravo}</span>
            <div class="min-width-0">
                <div class="mb-1">
                    <span class="periodo-tag"><i class="bi bi-calendar-range me-1"></i>${perfil.periodo}</span>
                </div>
                <h5 class="mb-0 fw-bold text-primary-dark">${perfil.titulo}</h5>
                <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>Publicado em: ${perfil.data}</small>
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

    const lista    = document.getElementById("lista-perfis");
    const vazio    = document.getElementById("estado-vazio");
    const contador = document.getElementById("resultado-contador");
    if (!lista || !vazio || !contador) return;
    lista.innerHTML = "";

    const filtrados = letraAtiva === "TODOS"
        ? [...PERFIS]
        : PERFIS.filter(p => letraInicial(p.agravo) === letraAtiva);

    if (filtrados.length === 0) {
        lista.classList.add("d-none");
        vazio.classList.remove("d-none");
        contador.textContent = "0 perfis";
        return;
    }

    lista.classList.remove("d-none");
    vazio.classList.add("d-none");
    contador.textContent = `${filtrados.length} ${filtrados.length > 1 ? "perfis" : "perfil"}`;

    const grupos = filtrados.reduce((acc, p) => {
        const l = letraInicial(p.agravo);
        if (!acc[l]) acc[l] = [];
        acc[l].push(p);
        return acc;
    }, {});

    Object.keys(grupos).sort().forEach(letra => {
        if (letraAtiva === "TODOS") lista.appendChild(criarGrupoLetra(letra));
        grupos[letra].forEach(p => lista.appendChild(criarItemPerfil(p)));
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
