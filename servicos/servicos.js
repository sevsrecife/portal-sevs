(function () {
    'use strict';

    var servicesUrl = 'https://conecta.recife.pe.gov.br/buscaavancada?b=&c=14&g=&o=&f=&l=&t=';
    var strategicInformationHeading = Array.prototype.find.call(
        document.querySelectorAll('section h3'),
        function (heading) {
            return heading.textContent.trim() === 'Informações Estratégicas';
        }
    );

    if (strategicInformationHeading) {
        var cardsRow = strategicInformationHeading.closest('section').querySelector('.row.g-4');
        var templateColumn = cardsRow && cardsRow.lastElementChild;

        if (templateColumn && !cardsRow.querySelector('[data-services-card]')) {
            var servicesColumn = templateColumn.cloneNode(true);
            var icon = servicesColumn.querySelector('.bi');
            var title = servicesColumn.querySelector('h4');
            var description = servicesColumn.querySelector('p');
            var link = servicesColumn.querySelector('a.btn');

            servicesColumn.setAttribute('data-services-card', '');
            icon.className = 'bi bi-grid';
            title.textContent = 'Serviços';
            description.textContent = 'Consulte os serviços disponíveis no portal Conecta Recife.';
            link.href = servicesUrl;

            cardsRow.appendChild(servicesColumn);
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