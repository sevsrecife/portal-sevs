(function () {
    'use strict';

    var strategicCards = [
        {
            id: 'services',
            icon: 'bi bi-grid',
            title: 'Carta de Serviços',
            description: 'Consulte os serviços disponíveis no portal Conecta Recife.',
            url: 'https://conecta.recife.pe.gov.br/buscaavancada?b=&c=14&g=&o=&f=&l=&t='
        },
        {
            id: 'cie-observatory',
            icon: 'bi bi-bar-chart-line',
            title: 'Observatório CIE',
            description: 'Acesse painéis com informações estratégicas para a Vigilância em Saúde.',
            url: 'https://vigilanciaemsaude.recife.pe.gov.br/cie/public.html#paineis',
            label: 'Acessar Observatório',
            external: true
        },
        {
            id: 'news',
            icon: 'bi bi-newspaper',
            title: 'Notícias',
            description: 'Acompanhe informações, ações e atualizações da Vigilância em Saúde do Recife.',
            url: '../../wordpress/notícias/noticias.html'
        }
    ];
    var strategicInformationHeading = Array.prototype.find.call(
        document.querySelectorAll('section h3'),
        function (heading) {
            return heading.textContent.trim() === 'Informações Estratégicas';
        }
    );

    if (strategicInformationHeading) {
        var cardsRow = strategicInformationHeading.closest('section').querySelector('.row.g-4');
        var templateColumn = cardsRow && cardsRow.lastElementChild;

        if (templateColumn) {
            strategicCards.forEach(function (card) {
                if (cardsRow.querySelector('[data-strategic-card="' + card.id + '"]')) {
                    return;
                }

                var cardColumn = templateColumn.cloneNode(true);
                var icon = cardColumn.querySelector('.bi');
                var title = cardColumn.querySelector('h4');
                var description = cardColumn.querySelector('p');
                var link = cardColumn.querySelector('a.btn');

                cardColumn.setAttribute('data-strategic-card', card.id);
                icon.className = card.icon;
                title.textContent = card.title;
                description.textContent = card.description;
                link.href = card.url;
                link.textContent = card.label || 'Acessar';

                if (card.external) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }

                cardsRow.appendChild(cardColumn);
            });
        }
    }

    if (!strategicInformationHeading) {
        document.addEventListener('DOMContentLoaded', function () {
            try {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            } catch (error) {
                console.warn('VLibras não pôde ser carregado.', error);
            }
        });
    }
})();