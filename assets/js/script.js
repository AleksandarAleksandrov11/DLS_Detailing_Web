document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.nav-menu');
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);

    const openMenu = () => {
        nav.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('open');
    };

    const closeMenu = () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('open');
    };

    // Click en hamburguesa
    toggle.addEventListener('click', () => {
        nav.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Click fuera del menú
    overlay.addEventListener('click', closeMenu);

    // Click en cualquier enlace → cerrar menú
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});