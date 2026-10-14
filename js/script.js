
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // MODO OSCURO
    // =========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('i');

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon?.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn?.addEventListener('click', () => {
        const isDark =
            document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon?.classList.replace('fa-sun', 'fa-moon');
            themeToggleBtn.setAttribute('aria-label', 'Activar modo oscuro');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
            themeToggleBtn.setAttribute('aria-label', 'Activar modo claro');
        }
    });

    // =========================================
    // EFECTO DE LA BARRA DE NAVEGACIÓN
    // =========================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // =========================================
    // ANIMACIONES AL DESPLAZARSE
    // =========================================
    const faders = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        faders.forEach(element => observer.observe(element));
    } else {
        faders.forEach(element => element.classList.add('appear'));
    }

    // =========================================
    // BUSCADOR Y FILTROS COMBINADOS
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const searchInput = document.getElementById('search-input');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');

    let activeCategory = 'all';

    function filterArticles() {
        const searchTerm = (searchInput?.value || '')
            .trim()
            .toLocaleLowerCase('es');

        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const description = card.querySelector('.card-content p')?.textContent || '';
            const category = card.getAttribute('data-category') || '';

            const matchesSearch = `${title} ${description} ${category}`
                .toLocaleLowerCase('es')
                .includes(searchTerm);

            const matchesCategory =
                activeCategory === 'all' || category === activeCategory;

            const isVisible = matchesSearch && matchesCategory;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (resultsCount) {
            resultsCount.textContent =
                `Mostrando ${visibleCount} de ${cards.length} artículos`;
        }

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(button => {
                button.classList.remove('active');
                button.removeAttribute('aria-pressed');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            activeCategory = btn.getAttribute('data-filter') || 'all';

            filterArticles();
        });

        btn.setAttribute(
            'aria-pressed',
            btn.classList.contains('active') ? 'true' : 'false'
        );
    });

    searchInput?.addEventListener('input', filterArticles);

    // Mostrar correctamente todos los artículos al entrar
    filterArticles();

    // =========================================
    // NEWSLETTER: VALIDACIÓN BÁSICA
    // =========================================
    const newsletterForm = document.querySelector('.newsletter-form');

    newsletterForm?.addEventListener('submit', event => {
        event.preventDefault();

        alert(
            'El formulario está listo visualmente, pero todavía necesita ' +
            'un servicio para registrar las suscripciones.'
        );
    });
});
        searchInput.addEventListener('input', filterArticles);
    }

    filterArticles();
});
