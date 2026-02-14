// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

// Sidebar theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save theme preference
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Mobile menu theme toggle
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save theme preference
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = entry.target.style.animation || 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Contact Modal Functionality
const contactBtn = document.getElementById('contactBtn');
const contactModal = document.getElementById('contactModal');
const closeModal = document.getElementById('closeModal');

if (contactBtn && contactModal && closeModal) {
    // Open modal
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Mobile Floating Button
const mobileContactBtn = document.getElementById('mobileContactBtn');

if (mobileContactBtn && contactModal) {
    mobileContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburgerMenu');
const topNavLinks = document.getElementById('topNavLinks');

if (hamburgerMenu && topNavLinks) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        topNavLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.top-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            topNavLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !topNavLinks.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            topNavLinks.classList.remove('active');
        }
    });
}

// Image Carousel
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track && slides.length > 0 && dotsContainer) {
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    }
}

// Image Lightbox (Mobile Only)
const imageLightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const carouselImages = document.querySelectorAll('.carousel-slide img');

if (imageLightbox && lightboxImage && carouselImages.length > 0) {
    // Check if device is mobile
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    // Add click event to carousel images (mobile only)
    carouselImages.forEach(img => {
        img.addEventListener('click', (e) => {
            if (isMobileDevice()) {
                e.stopPropagation(); // Prevent carousel swipe
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                imageLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox when clicking anywhere
    imageLightbox.addEventListener('click', () => {
        imageLightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
}
