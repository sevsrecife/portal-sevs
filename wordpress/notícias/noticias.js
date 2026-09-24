window.MODELOS_NOTICIAS = [
    {
        categoria: "VIGILÂNCIA EPIDEMIOLÓGICA",
        titulo: "Título de notícia sobre monitoramento epidemiológico",
        resumo: "Resumo breve com o contexto, a ação realizada e a informação mais relevante da publicação.",
    },
    {
        categoria: "AÇÃO EM SAÚDE",
        titulo: "Título de notícia sobre ação realizada no território",
        resumo: "Síntese da iniciativa, do público atendido e dos resultados que devem ser destacados.",
    },
    {
        categoria: "COMUNICADO",
        titulo: "Título de comunicado ou orientação à população",
        resumo: "Texto introdutório objetivo para orientar o cidadão e encaminhá-lo ao conteúdo completo.",
    },
];

function criarModeloNoticia(noticia) {
    const coluna = document.createElement("div");
    coluna.className = "col-lg-4 col-md-6";
    coluna.innerHTML = `
        <article class="card news-card h-100 border shadow-sm overflow-hidden">
            <div class="news-image d-flex align-items-center justify-content-center" role="img" aria-label="Espaço reservado para a imagem desta notícia">
                <i class="bi bi-image" aria-hidden="true"></i>
            </div>
            <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span class="news-category">${noticia.categoria}</span>
                    <span class="news-model-label">MODELO</span>
                </div>
                <h3 class="card-title fw-bold text-primary-dark">${noticia.titulo}</h3>
                <p class="card-text text-muted flex-grow-1">${noticia.resumo}</p>
                <div class="news-meta mb-3"><i class="bi bi-calendar3 me-2"></i>DD/MM/AAAA</div>
                <span class="news-link" aria-disabled="true">Leia mais <i class="bi bi-arrow-right ms-1"></i></span>
            </div>
        </article>
    `;
    return coluna;
}

document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-noticias");
    const carregarMais = document.getElementById("carregar-mais");

    if (!lista || !carregarMais) {
        return;
    }

    window.MODELOS_NOTICIAS.forEach((noticia) => lista.appendChild(criarModeloNoticia(noticia)));
    carregarMais.addEventListener("click", () => {
        carregarMais.disabled = true;
        carregarMais.innerHTML = '<i class="bi bi-check2 me-2"></i>Todos os modelos exibidos';
    });

    try {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    } catch (error) {
        console.warn("VLibras não pôde ser carregado.", error);
    }
});