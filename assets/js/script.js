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
// Gallery filter functionality
const filterButtons = document.querySelectorAll('.filter-btn-gallery');
const galleryItems = document.querySelectorAll('.gallery-item-gallery');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('filter-btn-active-gallery'));
        // Add active class to clicked button
        button.classList.add('filter-btn-active-gallery');

        const filter = button.getAttribute('data-filter');

        // Filter gallery items
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Before After Slider functionality
const sliderHandle = document.getElementById('slider-handle-gallery');
const beforeImage = document.getElementById('before-image-gallery');
const afterImage = document.getElementById('after-image-gallery');
const gallerySelectorItems = document.querySelectorAll('.gallery-selector-item-gallery');

let isDragging = false;

// Initialize slider position
let sliderPosition = 50;
updateSliderPosition();

// Make slider handle draggable
sliderHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDrag);

// Touch events for mobile
sliderHandle.addEventListener('touchstart', startDragTouch);
document.addEventListener('touchmove', dragTouch);
document.addEventListener('touchend', stopDrag);

function startDrag(e) {
    isDragging = true;
    e.preventDefault();
}

function startDragTouch(e) {
    isDragging = true;
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;

    const container = sliderHandle.parentElement;
    const containerRect = container.getBoundingClientRect();
    let clientX;

    if (e.type === 'mousemove') {
        clientX = e.clientX;
    } else if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
    }

    const x = clientX - containerRect.left;
    sliderPosition = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    updateSliderPosition();
}

function dragTouch(e) {
    if (!isDragging) return;

    const container = sliderHandle.parentElement;
    const containerRect = container.getBoundingClientRect();
    const clientX = e.touches[0].clientX;

    const x = clientX - containerRect.left;
    sliderPosition = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    updateSliderPosition();
}

function stopDrag() {
    isDragging = false;
}

function updateSliderPosition() {
    sliderHandle.style.left = `${sliderPosition}%`;
    afterImage.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
}

// Gallery selector functionality
gallerySelectorItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove selected class from all items
        gallerySelectorItems.forEach(i => i.classList.remove('gallery-selector-item-selected-gallery'));
        // Add selected class to clicked item
        item.classList.add('gallery-selector-item-selected-gallery');

        // Update before and after images
        const beforeUrl = item.getAttribute('data-before');
        const afterUrl = item.getAttribute('data-after');

        beforeImage.style.backgroundImage = `url('${beforeUrl}')`;
        afterImage.style.backgroundImage = `url('${afterUrl}')`;

        // Reset slider position
        sliderPosition = 50;
        updateSliderPosition();
    });
});

// Testimonial slider functionality
const testimonialItems = document.querySelectorAll('.testimonial-item-gallery');
const prevTestimonialBtn = document.getElementById('prev-testimonial-gallery');
const nextTestimonialBtn = document.getElementById('next-testimonial-gallery');

let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('testimonial-item-active-gallery');
        } else {
            item.classList.remove('testimonial-item-active-gallery');
        }
    });
}

prevTestimonialBtn.addEventListener('click', () => {
    currentTestimonial--;
    if (currentTestimonial < 0) {
        currentTestimonial = testimonialItems.length - 1;
    }
    showTestimonial(currentTestimonial);
});

nextTestimonialBtn.addEventListener('click', () => {
    currentTestimonial++;
    if (currentTestimonial >= testimonialItems.length) {
        currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
});

// Auto rotate testimonials every 5 seconds
setInterval(() => {
    currentTestimonial++;
    if (currentTestimonial >= testimonialItems.length) {
        currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
}, 5000);
// Add hover effects to gallery selector items
const gallerySelectorItemsHover = document.querySelectorAll('.gallery-selector-item-gallery');
gallerySelectorItemsHover.forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});