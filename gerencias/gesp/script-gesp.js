document.addEventListener('DOMContentLoaded', () => {
    
    try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
    } catch (e) {
        console.warn('O widget VLibras não pôde ser carregado.', e);
    }

    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.paddingTop = '0.5rem';
                navbar.style.paddingBottom = '0.5rem';
                navbar.classList.add('shadow-sm');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)'; 
            } else {
                navbar.style.paddingTop = '0.8rem';
                navbar.style.paddingBottom = '0.8rem';
                navbar.classList.remove('shadow-sm');
                navbar.style.backgroundColor = '#ffffff';
            }
        }
        
        updateActiveNavLink();
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function updateActiveNavLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active', 'fw-bold');
                    const href = link.getAttribute('href');
                    if (href && href.includes(sectionId)) {
                        link.classList.add('active', 'fw-bold');
                    }
                });
            }
        });
    }


});