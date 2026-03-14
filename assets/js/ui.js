document.addEventListener('DOMContentLoaded', function () {

    // ── DARK MODE ──
    const themeBtn = document.getElementById('themeToggle');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    themeBtn.addEventListener('click', function () {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ── SIDEBAR MOBILE ──
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    hamburger.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.li-menu').forEach(function (item) {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });


});
