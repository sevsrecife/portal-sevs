document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialização do VLibras
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('O widget VLibras não pôde ser carregado.', e);
    }

    // Controle de opacidade e tamanho da Navbar ao rolar a página
    const navbar = document.querySelector('.transition-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        });
    }

    // Funcionalidade de Filtro Dinâmico para a lista de Documentos/Portarias
    const searchInput = document.getElementById('filtroDocumentos');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            const docs = document.querySelectorAll('.doc-item');
            
            docs.forEach(doc => {
                const tituloEl = doc.querySelector('.doc-titulo');
                const descEl = doc.querySelector('.doc-desc');
                const titulo = tituloEl ? tituloEl.textContent.toLowerCase() : '';
                const desc = descEl ? descEl.textContent.toLowerCase() : '';
                
                doc.style.display = (titulo.includes(term) || desc.includes(term)) ? '' : 'none';
            });
        });
    }
});