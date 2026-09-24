const WP_API_URL = "https://vigilanciaemsaude.recife.pe.gov.br/cievs/wp-json/wp/v2";
const NOTICIAS_POR_PAGINA = 7;
let paginaAtual = 1;
let totalPaginas = 1;

function textoSemHtml(html) {
    const elemento = document.createElement("div");
    elemento.innerHTML = html || "";
    return (elemento.textContent || "").trim();
}

function limitarTexto(texto, limite = 180) {
    if (texto.length <= limite) return texto;
    return `${texto.slice(0, limite).trimEnd()}...`;
}

function dadosPost(post) {
    const termos = post._embedded && post._embedded["wp:term"];
    const midias = post._embedded && post._embedded["wp:featuredmedia"];
    const categoria = termos && termos[0] && termos[0][0];
    const midia = midias && midias[0];
    const titulo = textoSemHtml(post.title && post.title.rendered);

    return {
        titulo,
        resumo: limitarTexto(textoSemHtml(post.excerpt && post.excerpt.rendered)),
        categoria: categoria ? categoria.name : "Notícia",
        data: new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(post.date)),
        link: post.link,
        imagem: midia && midia.source_url,
        imagemAlt: (midia && midia.alt_text) || titulo,
    };
}

function preencherImagem(container, noticia) {
    container.replaceChildren();
    container.removeAttribute("role");
    container.removeAttribute("aria-label");

    if (noticia.imagem) {
        const imagem = document.createElement("img");
        imagem.className = "news-image-element";
        imagem.src = noticia.imagem;
        imagem.alt = noticia.imagemAlt;
        imagem.loading = "lazy";
        container.appendChild(imagem);
        return;
    }

    const icone = document.createElement("i");
    icone.className = "bi bi-image";
    icone.setAttribute("aria-hidden", "true");
    container.appendChild(icone);
    container.setAttribute("role", "img");
    container.setAttribute("aria-label", `Notícia sem imagem: ${noticia.titulo}`);
}

function criarCardNoticia(post) {
    const noticia = dadosPost(post);
    const coluna = document.createElement("div");
    coluna.className = "col-lg-4 col-md-6";
    coluna.innerHTML = `
        <article class="card news-card h-100 border shadow-sm overflow-hidden">
            <div class="news-image d-flex align-items-center justify-content-center" data-news-image></div>
            <div class="card-body p-4 d-flex flex-column">
                <span class="news-category align-self-start mb-3" data-news-category></span>
                <h3 class="card-title fw-bold text-primary-dark" data-news-title></h3>
                <p class="card-text text-muted flex-grow-1" data-news-summary></p>
                <div class="news-meta mb-3" data-news-date></div>
                <a class="news-link" target="_blank" rel="noopener noreferrer" data-news-link>Leia mais <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></a>
            </div>
        </article>
    `;

    preencherImagem(coluna.querySelector("[data-news-image]"), noticia);
    coluna.querySelector("[data-news-category]").textContent = noticia.categoria;
    coluna.querySelector("[data-news-title]").textContent = noticia.titulo;
    coluna.querySelector("[data-news-summary]").textContent = noticia.resumo;
    coluna.querySelector("[data-news-date]").textContent = noticia.data;
    coluna.querySelector("[data-news-link]").href = noticia.link;
    return coluna;
}

function exibirDestaque(post) {
    const noticia = dadosPost(post);
    const destaque = document.getElementById("noticia-destaque");

    preencherImagem(document.getElementById("destaque-imagem"), noticia);
    document.getElementById("destaque-categoria").textContent = noticia.categoria;
    document.getElementById("destaque-titulo").textContent = noticia.titulo;
    document.getElementById("destaque-resumo").textContent = noticia.resumo;
    document.getElementById("destaque-data").textContent = noticia.data;
    document.getElementById("destaque-link").href = noticia.link;
    destaque.classList.remove("d-none");
}

function atualizarPaginacao() {
    const paginacao = document.getElementById("paginacao-noticias");
    paginacao.classList.toggle("d-none", totalPaginas <= 1);
    paginacao.classList.toggle("d-flex", totalPaginas > 1);
    document.getElementById("pagina-atual").textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    document.getElementById("pagina-anterior").disabled = paginaAtual <= 1;
    document.getElementById("proxima-pagina").disabled = paginaAtual >= totalPaginas;
}

async function carregarNoticias(pagina = 1) {
    const lista = document.getElementById("lista-noticias");
    const carregando = document.getElementById("noticias-carregando");
    const erro = document.getElementById("noticias-erro");
    const vazio = document.getElementById("noticias-vazio");
    const destaque = document.getElementById("noticia-destaque");

    carregando.classList.remove("d-none");
    erro.classList.add("d-none");
    vazio.classList.add("d-none");
    destaque.classList.add("d-none");
    lista.replaceChildren();

    try {
        const parametros = new URLSearchParams({
            per_page: String(NOTICIAS_POR_PAGINA),
            page: String(pagina),
            _embed: "1",
        });
        const resposta = await fetch(`${WP_API_URL}/posts?${parametros.toString()}`);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const posts = await resposta.json();
        if (!Array.isArray(posts)) throw new Error("Resposta inesperada da API");

        paginaAtual = pagina;
        totalPaginas = Number(resposta.headers.get("X-WP-TotalPages")) || 1;

        if (posts.length === 0) {
            vazio.classList.remove("d-none");
            atualizarPaginacao();
            return;
        }

        exibirDestaque(posts[0]);
        posts.slice(1).forEach((post) => lista.appendChild(criarCardNoticia(post)));
        atualizarPaginacao();
    } catch (error) {
        console.warn("Falha ao carregar notícias do WordPress.", error);
        erro.classList.remove("d-none");
    } finally {
        carregando.classList.add("d-none");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tentar-novamente").addEventListener("click", () => carregarNoticias(paginaAtual));
    document.getElementById("pagina-anterior").addEventListener("click", () => carregarNoticias(paginaAtual - 1));
    document.getElementById("proxima-pagina").addEventListener("click", () => carregarNoticias(paginaAtual + 1));
    carregarNoticias();

    try {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    } catch (error) {
        console.warn("VLibras não pôde ser carregado.", error);
    }
});