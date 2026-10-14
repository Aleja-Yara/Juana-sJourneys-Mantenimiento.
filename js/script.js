document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       Dark Mode Toggle Logic
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    /* =========================================
       Navbar Scroll Effect
       ========================================= */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       Scroll Animations (Intersection Observer)
       ========================================= */
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

  
    /* =========================================
       Búsqueda y filtros de artículos
       ========================================= */
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
            .toLowerCase()
            .trim();
    }

    function filterArticles() {
        const query = normalizeText(searchInput ? searchInput.value : '');
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.dataset.category || '';
            const title = card.querySelector('h3')?.textContent || '';
            const description =
                card.querySelector('.card-content p')?.textContent || '';

            const matchesCategory =
                activeCategory === 'all' || category === activeCategory;

            const text = normalizeText(`${title} ${description} ${category}`);
            const matchesSearch = text.includes(query);
            const isVisible = matchesCategory && matchesSearch;

            card.style.display = isVisible ? 'flex' : 'none';

            if (isVisible) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
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
            activeCategory = btn.dataset.filter || 'all';

            filterBtns.forEach(button => {
                const active = button === btn;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });

            filterArticles();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }

    filterArticles();
});
