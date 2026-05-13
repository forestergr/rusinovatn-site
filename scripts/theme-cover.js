document.addEventListener('DOMContentLoaded', function() {
    function isDark() {
        if (document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')) {
            return true;
        }
        const stored = localStorage.getItem('pref-theme') || localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyAllCovers() {
        // Обложки
        document.querySelectorAll('.theme-cover').forEach(block => {
            const light = block.querySelector('.cover-light');
            const dark = block.querySelector('.cover-dark');
            if (!light || !dark) return;
            light.style.display = isDark() ? 'none' : 'block';
            dark.style.display = isDark() ? 'block' : 'none';
        });

        // Контентные изображения theme-img
        document.querySelectorAll('.theme-img-wrapper').forEach(wrapper => {
            const light = wrapper.querySelector('.theme-light');
            const dark = wrapper.querySelector('.theme-dark');
            if (!light || !dark) return;
            light.style.display = isDark() ? 'none' : 'inline';   // или 'block', если нужно
            dark.style.display = isDark() ? 'inline' : 'none';
        });

        // Ссылки-превью theme-img-link
        document.querySelectorAll('.theme-img-link-wrapper').forEach(wrapper => {
            const light = wrapper.querySelector('.theme-light');
            const dark = wrapper.querySelector('.theme-dark');
            if (!light || !dark) return;
            // Сбрасываем display, чтобы применилось CSS-правило (inline-block)
            light.style.display = isDark() ? 'none' : 'inline-block';
            dark.style.display = isDark() ? 'inline-block' : 'none';
        });

        // Фавиконка
        const favicon = document.getElementById('theme-favicon');
        if (favicon && favicon.dataset.light && favicon.dataset.dark) {
            favicon.href = (isDark() ? favicon.dataset.dark : favicon.dataset.light) + '?v=' + Date.now();
        }
    }

    applyAllCovers();

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            setTimeout(applyAllCovers, 100);
        });
    }

    const observer = new MutationObserver(function(mutations) {
        for (const m of mutations) {
            if (m.attributeName === 'class') {
                applyAllCovers();
                break;
            }
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyAllCovers);
    document.addEventListener('theme-change', applyAllCovers);
});