// 1. Dados das notícias
const noticias = [
    {
        id: 1,
        titulo: "Conteúdo provisório: ação da Vigilância em Saúde",
        categoria: "Conteúdo provisório",
        resumo: "Texto institucional de demonstração. Consulte a publicação original para acessar as informações oficiais.",
        data: "Data provisória",
        imagem: "imagens/noticia-01.svg",
        imagemAlt: "Placeholder institucional da primeira notícia",
        link: "https://www.instagram.com/p/DdcT7GGRhB-/",
    },
    {
        id: 2,
        titulo: "Conteúdo provisório: informação para a população",
        categoria: "Conteúdo provisório",
        resumo: "Texto institucional de demonstração. Consulte a publicação original para acessar as informações oficiais.",
        data: "Data provisória",
        imagem: "imagens/noticia-02.svg",
        imagemAlt: "Placeholder institucional da segunda notícia",
        link: "https://www.instagram.com/p/DdcUDWsDbHW/?img_index=1",
    },
    {
        id: 3,
        titulo: "Conteúdo provisório: atualização em saúde pública",
        categoria: "Conteúdo provisório",
        resumo: "Texto institucional de demonstração. Consulte a publicação original para acessar as informações oficiais.",
        data: "Data provisória",
        imagem: "imagens/noticia-03.svg",
        imagemAlt: "Placeholder institucional da terceira notícia",
        link: "https://www.instagram.com/p/DdLrM77REtc/",
    },
    {
        id: 4,
        titulo: "Conteúdo provisório: iniciativa da SEVS Recife",
        categoria: "Conteúdo provisório",
        resumo: "Texto institucional de demonstração. Consulte a publicação original para acessar as informações oficiais.",
        data: "Data provisória",
        imagem: "imagens/noticia-04.svg",
        imagemAlt: "Placeholder institucional da quarta notícia",
        link: "https://www.instagram.com/p/Dct5qaHmHjT/?img_index=1",
    },
];

// 2. Configurações
const NOTICIAS_POR_PAGINA = 6;
let paginaAtual = 1;

// 3. Funções auxiliares
function preencherImagem(container, noticia, destaque = false) {
    container.replaceChildren();
    container.removeAttribute("role");
    container.removeAttribute("aria-label");

    const imagem = document.createElement("img");
    imagem.className = "news-image-element";
    imagem.src = noticia.imagem;
    imagem.alt = noticia.imagemAlt;
    imagem.loading = destaque ? "eager" : "lazy";
    imagem.addEventListener("error", () => {
        imagem.remove();
        container.classList.add("news-image-placeholder");
        container.setAttribute("role", "img");
        container.setAttribute("aria-label", noticia.imagemAlt);

        const icone = document.createElement("i");
        icone.className = "bi bi-newspaper";
        icone.setAttribute("aria-hidden", "true");
        container.appendChild(icone);
    });
    container.appendChild(imagem);
}

function criarBotaoLeiaMais(noticia) {
    const link = document.createElement("a");
    link.className = "btn btn-primary-dark news-read-more align-self-start";
    link.href = noticia.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append("Leia mais");

    const icone = document.createElement("i");
    icone.className = "bi bi-arrow-right ms-2";
    icone.setAttribute("aria-hidden", "true");
    link.appendChild(icone);
    return link;
}

// 4. Renderização do destaque
function exibirDestaque(noticia) {
    const destaque = document.getElementById("noticia-destaque");

    preencherImagem(document.getElementById("destaque-imagem"), noticia, true);
    document.getElementById("destaque-categoria").textContent = noticia.categoria;
    document.getElementById("destaque-titulo").textContent = noticia.titulo;
    document.getElementById("destaque-resumo").textContent = noticia.resumo;
    document.getElementById("destaque-data").textContent = noticia.data;

    const linkAtual = document.getElementById("destaque-link");
    const novoLink = criarBotaoLeiaMais(noticia);
    novoLink.id = "destaque-link";
    linkAtual.replaceWith(novoLink);
    destaque.classList.remove("d-none");
}

// 5. Renderização dos cards
function criarCardNoticia(noticia) {
    const coluna = document.createElement("div");
    coluna.className = "col-lg-4 col-md-6";

    const artigo = document.createElement("article");
    artigo.className = "card news-card h-100 border shadow-sm overflow-hidden";

    const imagem = document.createElement("div");
    imagem.className = "news-image d-flex align-items-center justify-content-center";
    preencherImagem(imagem, noticia);

    const corpo = document.createElement("div");
    corpo.className = "card-body p-4 d-flex flex-column";

    const categoria = document.createElement("span");
    categoria.className = "news-category align-self-start mb-3";
    categoria.textContent = noticia.categoria;

    const titulo = document.createElement("h3");
    titulo.className = "card-title fw-bold text-primary-dark";
    titulo.textContent = noticia.titulo;

    const resumo = document.createElement("p");
    resumo.className = "card-text text-muted";
    resumo.textContent = noticia.resumo;

    const data = document.createElement("div");
    data.className = "news-meta mb-3";
    data.textContent = noticia.data;

    corpo.append(categoria, titulo, resumo, data, criarBotaoLeiaMais(noticia));
    artigo.append(imagem, corpo);
    coluna.appendChild(artigo);
    return coluna;
}

function renderizarNoticias(itens) {
    const lista = document.getElementById("lista-noticias");
    lista.replaceChildren();
    itens.forEach((noticia) => lista.appendChild(criarCardNoticia(noticia)));
}

function renderizarPagina() {
    const inicio = (paginaAtual - 1) * NOTICIAS_POR_PAGINA;
    const noticiasDaPagina = noticias.slice(1).slice(inicio, inicio + NOTICIAS_POR_PAGINA);
    renderizarNoticias(noticiasDaPagina);
    atualizarPaginacao();
}

// 6. Paginação
function atualizarPaginacao() {
    const totalPaginas = Math.max(1, Math.ceil((noticias.length - 1) / NOTICIAS_POR_PAGINA));
    const paginacao = document.getElementById("paginacao-noticias");
    paginacao.classList.toggle("d-none", totalPaginas <= 1);
    paginacao.classList.toggle("d-flex", totalPaginas > 1);
    document.getElementById("pagina-atual").textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    document.getElementById("pagina-anterior").disabled = paginaAtual <= 1;
    document.getElementById("proxima-pagina").disabled = paginaAtual >= totalPaginas;
}

// 7. Eventos
function configurarEventos() {
    document.getElementById("pagina-anterior").addEventListener("click", () => {
        paginaAtual -= 1;
        renderizarPagina();
    });
    document.getElementById("proxima-pagina").addEventListener("click", () => {
        paginaAtual += 1;
        renderizarPagina();
    });
}

// 8. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    exibirDestaque(noticias[0]);
    renderizarPagina();
    configurarEventos();

    try {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    } catch (error) {
        console.warn("VLibras não pôde ser carregado.", error);
    }
});