/* ==========================================================================
   NEPS — Agenda de Formações
   --------------------------------------------------------------------------
   A renderização e os dados da agenda (vindos do WordPress via WP REST API,
   com fallback local) foram migrados para wordpress/agendas/agenda.js.
   Este arquivo apenas aciona o carregamento no formato de exibição
   já existente na página (#lista-agenda, #agenda-vazia, #agenda-erro).
   ========================================================================== */

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

    carregarAgendaFormacoes();
});
