let snowflakeIntervalId = null;
let isTouchDevice = false;
let isPageVisible = true;
let animationsPaused = false;

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

document.addEventListener('DOMContentLoaded', function() {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    initializeAnimations();
    
    if (!prefersReducedMotion) {
        initializeSnowflakes();
        animateChristmasLights();
    }
    
    fetchBotStats();
    initializeMobileMenu();
    
    if (!isTouchDevice && !prefersReducedMotion) {
        initializeCursorEffects();
        initializeTiltEffects();
    }

    initializeNavScroll();
    initializeTabs();
    initializeSmoothScroll();
    initializeScrollSpy();
    
    if (!prefersReducedMotion) {
        initializeFloatingOrnaments();
        initializeParallax();
    }
    
    initializeResizeHandler();
    
    console.log('%c🐱 Alien Cat Bot', 'font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cDesarrollado con amor por dinox_oficial', 'font-size: 14px; color: #06b6d4;');
    console.log('%c🎄 Feliz Navidad 2025 🎄', 'font-size: 16px; color: #27ae60; font-weight: bold;');
});

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!hamburger || !navMenu) {
        console.log('Menu elements not found');
        return;
    }
    
    console.log('Mobile menu initialized');
    
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        console.log('Menu toggle, currently active:', isActive);
        
        if (isActive) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }
    
    hamburger.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    };
    
    hamburger.ontouchend = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        };
    });
    
    document.onclick = function(e) {
        if (navMenu.classList.contains('active')) {
            const navbar = document.querySelector('.navbar');
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
            }
        }
    };
}

let cursorAnimationId = null;
let cursorElements = null;
let cursorState = { mouseX: 0, mouseY: 0, glowX: 0, glowY: 0, trailX: 0, trailY: 0 };

function initializeCursorEffects() {
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!cursorGlow || !cursorTrail) return;
    
    cursorElements = { glow: cursorGlow, trail: cursorTrail };
    
    document.addEventListener('mousemove', (e) => {
        cursorState.mouseX = e.clientX;
        cursorState.mouseY = e.clientY;
    }, { passive: true });
    
    startCursorAnimation();
}

function startCursorAnimation() {
    if (!cursorElements || cursorAnimationId) return;
    
    function animateCursor() {
        if (!isPageVisible || !cursorElements) {
            cursorAnimationId = null;
            return;
        }
        
        cursorState.glowX += (cursorState.mouseX - cursorState.glowX) * 0.08;
        cursorState.glowY += (cursorState.mouseY - cursorState.glowY) * 0.08;
        cursorState.trailX += (cursorState.mouseX - cursorState.trailX) * 0.2;
        cursorState.trailY += (cursorState.mouseY - cursorState.trailY) * 0.2;
        
        cursorElements.glow.style.transform = `translate(${cursorState.glowX - 200}px, ${cursorState.glowY - 200}px)`;
        cursorElements.trail.style.transform = `translate(${cursorState.trailX - 10}px, ${cursorState.trailY - 10}px)`;
        
        cursorAnimationId = requestAnimationFrame(animateCursor);
    }
    
    cursorAnimationId = requestAnimationFrame(animateCursor);
}

function stopCursorAnimation() {
    if (cursorAnimationId) {
        cancelAnimationFrame(cursorAnimationId);
        cursorAnimationId = null;
    }
}

function initializeNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function handleTabClick(btn, e) {
        e.preventDefault();
        e.stopPropagation();
        
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const content = document.getElementById(tabId);
        if (content) {
            content.classList.add('active');
        }
        
        createRipple(btn, e);
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => handleTabClick(btn, e));
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleTabClick(btn, e);
        }, { passive: false });
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            createRipple(this, e);
        });
    });
}

function createRipple(element, event) {
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    let animationId;
    
    function updateCounter() {
        if (!isPageVisible) {
            element.textContent = target.toLocaleString();
            return;
        }
        
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            animationId = requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-value[data-target]');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            const target = parseInt(stat.dataset.target);
                            animateCounter(stat, target);
                        }, index * 200);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        statsObserver.observe(statsSection);
    }

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                    statNumbers.forEach((stat, index) => {
                        setTimeout(() => {
                            const target = parseInt(stat.dataset.target);
                            animateCounter(stat, target);
                        }, index * 150);
                    });
                    heroObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        heroObserver.observe(heroStats);
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .command-card, .stat-card, .timeline-item, .topgg-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function initializeTiltEffects() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        const handleMouseMove = throttle(function(e) {
            if (!isPageVisible) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        }, 16);
        
        card.addEventListener('mousemove', handleMouseMove, { passive: true });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        }, { passive: true });
    });
}

function initializeScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = throttle(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 150);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function initializeSnowflakes() {
    const container = document.getElementById('snowflakes-container');
    if (!container) return;
    
    const snowflakeChars = ['❄', '❅', '❆'];
    const sizes = ['small', 'medium', 'large'];
    
    const isMobile = window.innerWidth <= 768;
    const snowflakeCount = isMobile ? 8 : 15;
    const maxSnowflakes = isMobile ? 15 : 25;
    
    function createSnowflake() {
        if (!isPageVisible || animationsPaused) return;
        
        const existingSnowflakes = container.children.length;
        if (existingSnowflakes >= maxSnowflakes) return;
        
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.classList.add(size);
        
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        const startX = Math.random() * 100;
        snowflake.style.left = startX + '%';
        
        const duration = 10 + Math.random() * 8;
        snowflake.style.animationDuration = duration + 's';
        
        snowflake.style.animationName = 'snowfall';
        
        container.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, duration * 1000);
    }
    
    for (let i = 0; i < snowflakeCount; i++) {
        setTimeout(() => createSnowflake(), i * 400);
    }
    
    const interval = isMobile ? 2000 : 1200;
    snowflakeIntervalId = setInterval(createSnowflake, interval);
}

function cleanupSnowflakes() {
    if (snowflakeIntervalId) {
        clearInterval(snowflakeIntervalId);
        snowflakeIntervalId = null;
    }
}

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    
    if (document.hidden) {
        animationsPaused = true;
        cleanupSnowflakes();
        stopCursorAnimation();
    } else {
        animationsPaused = false;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            if (!snowflakeIntervalId) {
                initializeSnowflakes();
            }
            startCursorAnimation();
        }
    }
});

window.addEventListener('beforeunload', cleanupSnowflakes);

let lightsInitialized = false;
function animateChristmasLights() {
    if (lightsInitialized) return;
    lightsInitialized = true;
    
    const lights = document.querySelectorAll('.christmas-light');
    
    lights.forEach((light, index) => {
        const intervalTime = 1500 + (index * 200);
        setInterval(() => {
            if (!isPageVisible) return;
            const brightness = 0.7 + Math.random() * 0.3;
            light.style.opacity = brightness;
        }, intervalTime);
    });
}

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.orb');
    if (parallaxElements.length === 0) return;
    
    const handleScroll = throttle(() => {
        if (!isPageVisible) return;
        
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.05 * (index + 1);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, 32);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

let ornamentsInitialized = false;
function initializeFloatingOrnaments() {
    if (ornamentsInitialized) return;
    ornamentsInitialized = true;
    
    const floatingOrnaments = document.querySelectorAll('.floating-ornament');
    
    floatingOrnaments.forEach((ornament, index) => {
        const intervalTime = 5000 + index * 1000;
        setInterval(() => {
            if (!isPageVisible) return;
            
            const newX = Math.random() * 20 - 10;
            const newY = Math.random() * 20 - 10;
            const newRotate = Math.random() * 20 - 10;
            
            ornament.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotate}deg)`;
        }, intervalTime);
    });
}

function initializeResizeHandler() {
    const handleResize = debounce(() => {
        cleanupSnowflakes();
        const container = document.getElementById('snowflakes-container');
        if (container) {
            container.innerHTML = '';
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                initializeSnowflakes();
            }
        }
    }, 500);
    
    window.addEventListener('resize', handleResize, { passive: true });
}

async function fetchBotStats() {
    try {
        const response = await fetch('/api/stats.json');
        if (response.ok) {
            const data = await response.json();
            const statNumbers = document.querySelectorAll('.stat-number[data-target]');
            
            if (statNumbers[0] && data.servers) {
                statNumbers[0].dataset.target = data.servers;
                statNumbers[0].textContent = '0';
            }
            if (statNumbers[1] && data.users) {
                statNumbers[1].dataset.target = data.users;
                statNumbers[1].textContent = '0';
            }
            if (statNumbers[2] && data.commands) {
                statNumbers[2].dataset.target = data.commands;
                statNumbers[2].textContent = '0';
            }
        }
    } catch (error) {
        console.log('Stats API not available, using default values');
    }
}

function initializeGalleryCarousel() {
    const carousel = document.getElementById('gallery-carousel');
    const items = document.querySelectorAll('.gallery-3d-item');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const indicatorsContainer = document.getElementById('gallery-indicators');
    
    if (!carousel || items.length === 0) return;
    
    let currentIndex = 0;
    const totalItems = items.length;
    const angleStep = 360 / totalItems;
    const radius = 350;
    let autoplayInterval;
    let isAnimating = false;
    
    items.forEach((_, i) => {
        const indicator = document.createElement('div');
        indicator.className = 'gallery-indicator' + (i === 0 ? ' active' : '');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    });
    
    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;
        
        items.forEach((item, i) => {
            const angle = (i - currentIndex) * angleStep;
            const radian = (angle * Math.PI) / 180;
            const x = Math.sin(radian) * radius;
            const z = Math.cos(radian) * radius - radius;
            const rotateY = -angle;
            const scale = (z + radius * 2) / (radius * 2);
            const opacity = scale * 0.5 + 0.5;
            
            item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${0.6 + scale * 0.4})`;
            item.style.opacity = opacity;
            item.style.zIndex = Math.round(scale * 10);
            
            if (i === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.gallery-indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
        
        setTimeout(() => { isAnimating = false; }, 300);
    }
    
    function nextSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }
    
    function prevSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;
        currentIndex = index;
        updateCarousel();
    }
    
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (isPageVisible) nextSlide();
        }, 5000);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    let touchStartX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight') nextSlide();
    });
    
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.addEventListener('mouseleave', startAutoplay);
    
    updateCarousel();
    startAutoplay();
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeGalleryCarousel, 100);
});

function initializeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-3d-item img');
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentLightboxIndex = 0;
    const images = Array.from(galleryItems).map(img => img.src);
    
    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImage.src = images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % images.length;
        lightboxImage.src = images[currentLightboxIndex];
    }
    
    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentLightboxIndex];
    }
    
    galleryItems.forEach((img, index) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(index);
        });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
    
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeLightbox, 200);
});
