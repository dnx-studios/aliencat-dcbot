let snowflakeIntervalId = null;
let isTouchDevice = false;

document.addEventListener('DOMContentLoaded', function() {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    initializeAnimations();
    initializeSnowflakes();
    animateChristmasLights();
    fetchBotStats();
    initializeMobileMenu();
    
    if (!isTouchDevice) {
        initializeCursorEffects();
        initializeTiltEffects();
        initializeMagicParticles();
    }

    initializeNavScroll();
    initializeTabs();
    initializeSmoothScroll();
    initializeScrollSpy();
    addInteractiveHoverEffects();
    initializeFloatingOrnaments();
    initializeParallax();
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

function initializeCursorEffects() {
    const cursorGlow = document.querySelector('.cursor-glow');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!cursorGlow || !cursorTrail) return;
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        glowX += (mouseX - glowX) * 0.05;
        glowY += (mouseY - glowY) * 0.05;
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

function initializeNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
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
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
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
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
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
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

function initializeScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
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
    });
}

function initializeSnowflakes() {
    const container = document.getElementById('snowflakes-container');
    if (!container) return;
    
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❋', '✲', '❊'];
    const sizes = ['small', 'medium', 'large'];
    
    const isMobile = window.innerWidth <= 768;
    const snowflakeCount = isMobile ? 15 : 30;
    
    function createSnowflake() {
        if (document.hidden) return;
        
        const existingSnowflakes = container.querySelectorAll('.snowflake');
        const maxSnowflakes = isMobile ? 30 : 60;
        if (existingSnowflakes.length >= maxSnowflakes) return;
        
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.classList.add(size);
        
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        const startX = Math.random() * 100;
        snowflake.style.left = startX + '%';
        
        const duration = 8 + Math.random() * 12;
        snowflake.style.animationDuration = duration + 's';
        
        const delay = Math.random() * 2;
        snowflake.style.animationDelay = delay + 's';
        
        const useWind = Math.random() > 0.5;
        snowflake.style.animationName = useWind ? 'snowfallWind' : 'snowfall';
        
        container.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, (duration + delay) * 1000);
    }
    
    for (let i = 0; i < snowflakeCount; i++) {
        setTimeout(() => createSnowflake(), i * 200);
    }
    
    const interval = isMobile ? 800 : 400;
    snowflakeIntervalId = setInterval(createSnowflake, interval);
}

function cleanupSnowflakes() {
    if (snowflakeIntervalId) {
        clearInterval(snowflakeIntervalId);
        snowflakeIntervalId = null;
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cleanupSnowflakes();
    } else {
        if (!snowflakeIntervalId) {
            const isMobile = window.innerWidth <= 768;
            const interval = isMobile ? 800 : 400;
            snowflakeIntervalId = setInterval(() => {
                const container = document.getElementById('snowflakes-container');
                if (!container || document.hidden) return;
                
                const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❋', '✲', '❊'];
                const sizes = ['small', 'medium', 'large'];
                
                const existingSnowflakes = container.querySelectorAll('.snowflake');
                const maxSnowflakes = isMobile ? 30 : 60;
                if (existingSnowflakes.length >= maxSnowflakes) return;
                
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                
                const size = sizes[Math.floor(Math.random() * sizes.length)];
                snowflake.classList.add(size);
                
                snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
                
                const startX = Math.random() * 100;
                snowflake.style.left = startX + '%';
                
                const duration = 8 + Math.random() * 12;
                snowflake.style.animationDuration = duration + 's';
                
                const delay = Math.random() * 2;
                snowflake.style.animationDelay = delay + 's';
                
                const useWind = Math.random() > 0.5;
                snowflake.style.animationName = useWind ? 'snowfallWind' : 'snowfall';
                
                container.appendChild(snowflake);
                
                setTimeout(() => {
                    if (snowflake.parentNode) {
                        snowflake.remove();
                    }
                }, (duration + delay) * 1000);
            }, interval);
        }
    }
});

window.addEventListener('beforeunload', cleanupSnowflakes);

function animateChristmasLights() {
    const lights = document.querySelectorAll('.christmas-light');
    
    lights.forEach((light, index) => {
        setInterval(() => {
            const brightness = 0.6 + Math.random() * 0.4;
            light.style.filter = `brightness(${brightness})`;
        }, 500 + Math.random() * 1000);
    });
}

function initializeMagicParticles() {
    const colors = ['#e74c3c', '#27ae60', '#f39c12', '#3498db', '#9b59b6'];
    
    function createMagicParticle(x, y) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            animation: magicParticle 1.5s ease forwards;
        `;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }

    if (!document.getElementById('magic-particle-style')) {
        const magicStyle = document.createElement('style');
        magicStyle.id = 'magic-particle-style';
        magicStyle.textContent = `
            @keyframes magicParticle {
                0% {
                    opacity: 1;
                    transform: scale(1) translate(0, 0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
            }
        `;
        document.head.appendChild(magicStyle);
    }

    let particleThrottle = false;
    document.addEventListener('mousemove', (e) => {
        if (!particleThrottle && Math.random() > 0.92) {
            createMagicParticle(e.clientX, e.clientY);
            particleThrottle = true;
            setTimeout(() => particleThrottle = false, 100);
        }
    });
}

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 * (index + 1);
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

function addInteractiveHoverEffects() {
    const interactiveElements = document.querySelectorAll('.feature-card, .command-card, .stat-card, .topgg-card, .stat-item, .timeline-content');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

function initializeFloatingOrnaments() {
    const floatingOrnaments = document.querySelectorAll('.floating-ornament');
    
    floatingOrnaments.forEach((ornament, index) => {
        setInterval(() => {
            const newX = Math.random() * 30 - 15;
            const newY = Math.random() * 30 - 15;
            const newRotate = Math.random() * 30 - 15;
            const newScale = 0.9 + Math.random() * 0.4;
            
            ornament.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotate}deg) scale(${newScale})`;
        }, 3000 + index * 500);
    });
}

function initializeResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cleanupSnowflakes();
            const container = document.getElementById('snowflakes-container');
            if (container) {
                container.innerHTML = '';
                initializeSnowflakes();
            }
        }, 500);
    });
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

