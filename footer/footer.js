/* ============================================================
   Footer institucional SEVS
   ------------------------------------------------------------
   Substitui o <div id="sevs-footer"> de cada página pelo
   conteúdo de footer/footer.html.

   Configuração por página (atributos no container):
     data-root         prefixo relativo até a raiz do portal
                       ("", "../" ou "../../"; padrão: "")
     data-title        título da coluna esquerda
     data-description  descrição da coluna esquerda (texto puro)
     data-links        tokens dos Links Rápidos, separados por
                       vírgula: portal, gesp, neps, portarias,
                       notificacao, carta, prefeitura, sesau
                       (padrão: "portal,portarias,carta,prefeitura,sesau")

   Para descrição com HTML (ex.: e-mail com link), coloque um
   <p> dentro do container em vez de usar data-description.
   ============================================================ */
(function () {
    'use strict';

    var container = document.getElementById('sevs-footer');
    if (!container) {
        return;
    }

    var root = container.getAttribute('data-root') || '';
    var title = container.getAttribute('data-title') || 'Vigilância em Saúde - Recife';
    var linksParam = (container.getAttribute('data-links') || 'portal,portarias,carta,prefeitura,sesau')
        .split(',')
        .map(function (token) { return token.trim(); })
        .filter(function (token) { return token.length > 0; });

    var configParagraph = container.querySelector('p');
    var description = configParagraph
        ? configParagraph.innerHTML
        : (container.getAttribute('data-description') || '');

    function render(templateHtml) {
        var html = templateHtml.split('{{root}}').join(root);
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var footer = wrapper.querySelector('footer');
        if (!footer) {
            return;
        }

        var titleEl = footer.querySelector('[data-footer-title]');
        if (titleEl) {
            titleEl.textContent = title;
        }

        var descriptionEl = footer.querySelector('[data-footer-description]');
        if (descriptionEl && description) {
            descriptionEl.innerHTML = description;
        }

        Array.prototype.forEach.call(footer.querySelectorAll('[data-link]'), function (item) {
            if (linksParam.indexOf(item.getAttribute('data-link')) === -1) {
                item.parentNode.removeChild(item);
            }
        });

        container.parentNode.replaceChild(footer, container);
    }

    /* Fallback usado quando o fetch é bloqueado (ex.: página aberta
       diretamente via file://). Manter em sincronia com footer.html. */
    var FALLBACK_TEMPLATE = [
        '<footer class="bg-primary-dark text-white pt-4 pb-3 border-top mt-auto" style="border-color: var(--accent-orange) !important; border-top-width: 4px !important;">',
        '    <div class="container">',
        '        <div class="row g-3 pb-3">',
        '            <div class="col-lg-6 col-md-12">',
        '                <h5 class="fw-bold text-white mb-2" data-footer-title>Vigilância em Saúde - Recife</h5>',
        '                <p class="text-white-50 small mb-0 pe-lg-5 text-justify" data-footer-description>O Portal Institucional da SEVS centraliza as informações de inteligência de dados, normativas e acesso direto aos sistemas de monitoramento (GESP e CIE) para profissionais de saúde e gestão governamental.</p>',
        '            </div>',
        '            <div class="col-lg-6 col-md-12 text-lg-end">',
        '                <h5 class="fw-bold text-white mb-2">Links Rápidos</h5>',
        '                <ul class="list-unstyled mb-0 d-flex flex-column flex-lg-row flex-wrap justify-content-lg-end gap-2 gap-lg-4" data-footer-links>',
        '                    <li data-link="portal"><a href="{{root}}index.html" class="text-white-50 text-decoration-none hover-white">Portal SEVS</a></li>',
        '                    <li data-link="gesp"><a href="{{root}}gerencias/gesp/gesp.html" class="text-white-50 text-decoration-none hover-white">GESP</a></li>',
        '                    <li data-link="neps"><a href="{{root}}nucleos/neps/neps.html" class="text-white-50 text-decoration-none hover-white">Página do NEPS</a></li>',
        '                    <li data-link="portarias"><a href="{{root}}wordpress/portarias/portarias.html" class="text-white-50 text-decoration-none hover-white">Portarias</a></li>',
        '                    <li data-link="notificacao"><a href="{{root}}index.html#notifique" class="text-white-50 text-decoration-none hover-white">Notificação Compulsória</a></li>',
        '                    <li data-link="carta"><a href="https://cartaservicos.recife.pe.gov.br/scatserv/views/bemvindo.faces" target="_blank" rel="noopener" class="text-white-50 text-decoration-none hover-white">Carta de Serviços</a></li>',
        '                    <li data-link="prefeitura"><a href="https://www2.recife.pe.gov.br/" target="_blank" rel="noopener" class="text-white-50 text-decoration-none hover-white">Prefeitura do Recife</a></li>',
        '                    <li data-link="sesau"><a href="https://www2.recife.pe.gov.br/pagina/secretaria-de-saude-sesau" target="_blank" rel="noopener" class="text-white-50 text-decoration-none hover-white">Secretaria de Saúde</a></li>',
        '                </ul>',
        '            </div>',
        '        </div>',
        '        <div class="pt-3 mt-1 text-center text-white-50 small border-top border-white border-opacity-10">',
        '            ©2026 – Prefeitura do Recife &nbsp;·&nbsp; Desenvolvido pelo Núcleo de Transformação Digital – NTD / SEVS',
        '        </div>',
        '    </div>',
        '</footer>'
    ].join('\n');

    fetch(root + 'footer/footer.html')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Não foi possível carregar footer/footer.html');
            }
            return response.text();
        })
        .then(render)
        .catch(function () {
            render(FALLBACK_TEMPLATE);
        });
})();
