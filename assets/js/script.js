document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-menu');

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
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Add smooth scroll to button
document.querySelector('.view-all-btn').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
});
document.querySelectorAll('.commitment-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(5px)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
    });
});

// Add hover effect to image
const image = document.querySelector('.commitment-image img');
if (image) {
    image.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    image.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
}

document.querySelectorAll('.step-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    icon.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Add hover effect to CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.4)';
    });

    ctaButton.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
}
// Add hover effects to footer links
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', function () {
        this.style.color = '#FFD700';
    });

    link.addEventListener('mouseleave', function () {
        this.style.color = '#aaaaaa';
    });
});

// Add hover effects to social icons
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
        this.style.backgroundColor = '#ffcc00';
    });

    icon.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#FFD700';
    });
});

// Add hover effect to legal links
document.querySelectorAll('.footer-legal a').forEach(link => {
    link.addEventListener('mouseenter', function () {
        this.style.color = '#FFD700';
    });

    link.addEventListener('mouseleave', function () {
        this.style.color = '#aaaaaa';
    });
});