/* ==========================================================================
   Plenárias GESP — Inicialização de VLibras e controle de Tabs
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('VLibras não pôde ser carregado.', e);
    }

    const tabs = document.querySelectorAll('#plenariasTab .nav-link');

    tabs.forEach(tab => {
        tab.addEventListener('show.bs.tab', function (event) {
            tabs.forEach(t => {
                t.classList.remove('active', 'text-primary-dark');
                t.classList.add('text-muted', 'bg-light');
                t.style.borderBottom = '3px solid transparent';
            });
            event.target.classList.remove('text-muted', 'bg-light');
            event.target.classList.add('active', 'text-primary-dark');
            event.target.style.borderBottom = '3px solid var(--primary-dark)';
        });
    });
});
