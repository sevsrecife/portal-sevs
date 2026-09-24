document.addEventListener('DOMContentLoaded', () => {
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('VLibras não pôde ser carregado.', e);
    }

    const navbar = document.querySelector('.transition-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        });
    }
});
