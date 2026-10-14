
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // MODO OSCURO
    // =========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('i');

    try {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
            themeToggleBtn?.setAttribute('aria-label', 'Activar modo claro');
        }
    } catch (error) {
        console.warn('No se pudo leer la preferencia de tema.', error);
    }

    themeToggleBtn?.addEventListener('click', () => {
        const isDark =
            document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon?.classList.replace('fa-sun', 'fa-moon');
            themeToggleBtn.setAttribute('aria-label', 'Activar modo oscuro');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
            themeToggleBtn.setAttribute('aria-label', 'Activar modo claro');
        }

        try {
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        } catch (error) {
            console.warn('No se pudo guardar la preferencia de tema.', error);
        }
    });

    // =========================================
    // BARRA DE NAVEGACIÓN
    // =========================================
    const navbar = document.querySelector('.navbar');

    const updateNavbar = () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // =========================================
    // ANIMACIONES
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

    function normalizeText(text) {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('es')
            .trim();
    }

    function filterArticles() {
        const query = normalizeText(searchInput?.value || '');
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const description =
                card.querySelector('.card-content p')?.textContent || '';
            const category = card.dataset.category || '';

            const text = normalizeText(`${title} ${description} ${category}`);
            const matchesSearch = text.includes(query);
            const matchesCategory =
                activeCategory === 'all' || category === activeCategory;
            const isVisible = matchesSearch && matchesCategory;

            card.hidden = !isVisible;

            if (isVisible) visibleCount++;
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
        btn.setAttribute(
            'aria-pressed',
            btn.classList.contains('active') ? 'true' : 'false'
        );

        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.filter || 'all';

            filterBtns.forEach(button => {
                const active = button === btn;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });

            filterArticles();
        });
    });

    searchInput?.addEventListener('input', filterArticles);
    filterArticles();

    // =========================================
    // ARTÍCULOS FAVORITOS CON LOCALSTORAGE
    // =========================================
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favoritesKey = 'juanasJourneysFavorites';

    function readFavorites() {
        try {
            const stored = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch (error) {
            console.warn('No se pudieron leer los favoritos.', error);
            return [];
        }
    }

    function updateFavoriteButton(button, isFavorite) {
        const icon = button.querySelector('i');

        button.classList.toggle('is-favorite', isFavorite);
        button.setAttribute('aria-pressed', String(isFavorite));
        button.setAttribute(
            'aria-label',
            isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
        );
        button.title = isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos';

        if (icon) {
            icon.classList.toggle('fas', isFavorite);
            icon.classList.toggle('far', !isFavorite);
        }
    }

    let favorites = readFavorites();

    favoriteButtons.forEach((button, index) => {
        const card = button.closest('.card');
        const title = card?.querySelector('h3')?.textContent?.trim();
        const favoriteId = button.dataset.favoriteId || title;

        if (!favoriteId) {
            console.warn(`El botón de favoritos ${index + 1} no tiene un identificador.`);
            return;
        }

        button.dataset.favoriteId = favoriteId;
        updateFavoriteButton(button, favorites.includes(favoriteId));

        button.addEventListener('click', () => {
            favorites = readFavorites();

            if (favorites.includes(favoriteId)) {
                favorites = favorites.filter(id => id !== favoriteId);
            } else {
                favorites.push(favoriteId);
            }

            try {
                localStorage.setItem(favoritesKey, JSON.stringify(favorites));
                updateFavoriteButton(button, favorites.includes(favoriteId));
            } catch (error) {
                console.error('No se pudo guardar el favorito.', error);
                alert('No se pudo guardar el favorito en este navegador.');
            }
        });
    });

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
