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
        document.querySelectorAll('.theme-cover').forEach(block => {
            const light = block.querySelector('.cover-light');
            const dark = block.querySelector('.cover-dark');
            if (!light || !dark) return;
            if (isDark()) {
                light.style.display = 'none';
                dark.style.display = 'block';
            } else {
                light.style.display = 'block';
                dark.style.display = 'none';
            }
        });
    }

    applyAllCovers();

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            setTimeout(applyAllCovers, 50);
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