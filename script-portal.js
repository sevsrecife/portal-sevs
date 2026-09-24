document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do VLibras
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('VLibras indisponível no momento.', e);
    }

    // Comportamento de scroll da Navbar global
    const navbar = document.querySelector('.transition-nav');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        });
    }

    // Smooth scroll para links âncora internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Renderização compartilhada das atividades dos núcleos
    const lista = document.getElementById('lista-atividades');
    const atividades = Array.isArray(window.NUCLEO_ATIVIDADES) ? window.NUCLEO_ATIVIDADES : [];

    if (lista && atividades.length) {
        lista.innerHTML = '';

        atividades.forEach((atividade) => {
            const coluna = document.createElement('div');
            coluna.className = 'col-md-6';
            coluna.innerHTML = [
                '<article class="card activity-card h-100 border-0 bg-body-custom shadow-sm">',
                '    <div class="card-body p-4">',
                '        <div class="activity-icon d-flex align-items-center justify-content-center mb-3" aria-hidden="true">',
                '            <i class="bi ' + atividade.icone + '"></i>',
                '        </div>',
                '        <h5 class="fw-bold text-primary-dark mb-2">' + atividade.titulo + '</h5>',
                '        <p class="text-muted small mb-0">' + atividade.texto + '</p>',
                '    </div>',
                '</article>'
            ].join('');
            lista.appendChild(coluna);
        });
    }
});