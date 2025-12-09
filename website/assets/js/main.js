let isPageVisible = true;

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
    initializeAnimations();
    fetchBotStats();
    initializeMobileMenu();
    initializeNavScroll();
    initializeTabs();
    initializeSmoothScroll();
    initializeScrollSpy();
    
    console.log('%c Alien Cat Bot', 'font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cDesarrollado con amor por dinox_oficial', 'font-size: 14px; color: #06b6d4;');
});

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!hamburger || !navMenu) {
        return;
    }
    
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
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
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => handleTabClick(btn, e));
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleTabClick(btn, e);
        }, { passive: false });
    });
}

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        if (!isPageVisible) {
            element.textContent = target.toLocaleString();
            return;
        }
        
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

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
});

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

let externalNotificationTimeout = null;
let notificationShown = false;

function initializeExternalGuard() {
    const externalBtn = document.getElementById('external-guard-btn');
    const externalOverlay = document.getElementById('external-support-overlay');
    const externalBackBtn = document.getElementById('external-back-btn');
    const notification = document.getElementById('external-guard-notification');
    
    if (!externalBtn || !externalOverlay) return;
    
    externalBtn.addEventListener('click', handleExternalGuardClick);
    
    if (externalBackBtn) {
        externalBackBtn.addEventListener('click', closeExternalSupport);
    }
    
    if (notification) {
        notification.addEventListener('click', (e) => {
            if (!e.target.classList.contains('notification-close')) {
                closeExternalNotification();
                handleExternalGuardClick();
            }
        });
    }
    
    scheduleNotification();
}

function handleExternalGuardClick() {
    const externalBtn = document.getElementById('external-guard-btn');
    if (!externalBtn || externalBtn.classList.contains('animating')) return;
    
    clearNotificationTimeout();
    closeExternalNotification();
    
    const rect = externalBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    externalBtn.classList.add('animating');
    
    createParticleExplosion(centerX, centerY);
    
    const flash = document.getElementById('flash-overlay');
    
    setTimeout(() => {
        if (flash) flash.classList.add('active');
        
        setTimeout(() => {
            const allSections = document.querySelectorAll('section, nav, footer, .copyright-banner');
            
            allSections.forEach(el => {
                if (el) el.classList.add('cinematic-fade');
            });
            
            setTimeout(() => {
                allSections.forEach(el => {
                    if (el) el.style.display = 'none';
                });
                
                if (flash) flash.classList.remove('active');
                externalBtn.classList.remove('animating');
                externalBtn.style.opacity = '0';
                
                showExternalSupport();
            }, 400);
        }, 150);
    }, 300);
}

function createParticleExplosion(x, y) {
    const particleCount = 12;
    const colors = ['#bf00ff', '#9b59b6', '#e056fd', '#ffffff'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            animation: particleExplode 0.6s ease-out forwards;
            --tx: ${tx}px;
            --ty: ${ty}px;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 600);
    }
}

function showExternalSupport() {
    const externalOverlay = document.getElementById('external-support-overlay');
    if (externalOverlay) {
        externalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeExternalSupport() {
    const externalOverlay = document.getElementById('external-support-overlay');
    const allSections = document.querySelectorAll('section, nav, footer, .copyright-banner');
    const externalBtn = document.getElementById('external-guard-btn');
    
    if (externalOverlay) {
        externalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    allSections.forEach(el => {
        if (el) {
            el.style.display = '';
            el.style.opacity = '1';
            el.classList.remove('cinematic-fade');
        }
    });
    
    if (externalBtn) {
        externalBtn.classList.remove('animating');
        externalBtn.style.opacity = '1';
    }
    
    notificationShown = false;
    scheduleNotification();
}

function scheduleNotification() {
    clearNotificationTimeout();
    if (notificationShown) return;
    
    const randomDelay = Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;
    
    externalNotificationTimeout = setTimeout(() => {
        if (isPageVisible) {
            showExternalNotification();
        } else {
            scheduleNotification();
        }
    }, randomDelay);
}

function showExternalNotification() {
    const notification = document.getElementById('external-guard-notification');
    const externalOverlay = document.getElementById('external-support-overlay');
    
    if (notification && !externalOverlay.classList.contains('show')) {
        notification.classList.add('show');
        notificationShown = true;
        
        setTimeout(() => {
            closeExternalNotification();
        }, 10000);
    }
}

function closeExternalNotification() {
    const notification = document.getElementById('external-guard-notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

function clearNotificationTimeout() {
    if (externalNotificationTimeout) {
        clearTimeout(externalNotificationTimeout);
        externalNotificationTimeout = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeExternalGuard, 500);
    initializeCookieBanner();
});

function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    if (!cookieBanner) return;
    
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
            cookieBanner.classList.add('hide');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'false');
            cookieBanner.classList.remove('show');
            cookieBanner.classList.add('hide');
        });
    }
}
