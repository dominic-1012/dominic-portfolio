/* ==========================================================================
   J. DOMINIC PORTFOLIO - MAIN INTERACTIVE JAVASCRIPT BUNDLE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. THEME SWITCHER (DARK / LIGHT MODE)
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('dominic_portfolio_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('dominic_portfolio_theme', newTheme);
        });
    }

    /* --------------------------------------------------------------------------
       2. INTERACTIVE BACKGROUND PARTICLE CANVAS ENGINE
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = Math.min(Math.floor(width / 15), 65);
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = Math.random() > 0.5 ? '#6366f1' : '#8b5cf6';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // Mouse interaction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 2;
                        this.y -= (dy / distance) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        let opacity = (1 - distance / 120) * 0.25;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    /* --------------------------------------------------------------------------
       3. SPOTLIGHT CURSOR FOLLOWER
       -------------------------------------------------------------------------- */
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });
    }

    /* --------------------------------------------------------------------------
       4. DYNAMIC TYPING ANIMATION
       -------------------------------------------------------------------------- */
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const titles = [
            "Full-Stack Developer",
            "Java Backend Specialist",
            "Software Architect",
            "AI Solutions Engineer",
            "Data Analytics Expert"
        ];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeLoop() {
            const currentTitle = titles[titleIndex];
            
            if (isDeleting) {
                typingText.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingText.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentTitle.length) {
                isDeleting = true;
                typeSpeed = 1800; // Pause at full text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typeSpeed = 400; // Pause before typing next
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    /* --------------------------------------------------------------------------
       5. NAVBAR ELEVATION, SCROLL PROGRESS & ACTIVE LINK HIGHLIGHT
       -------------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-item');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Navbar elevation class
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to Top button visibility
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }

        // Active Navigation Highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth Scroll Back To Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------------------------
       6. MOBILE HAMBURGER MENU DRAWER
       -------------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksMenu = document.getElementById('nav-links');

    if (hamburgerBtn && navLinksMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navLinksMenu.classList.toggle('open');
        });

        // Close mobile drawer when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                navLinksMenu.classList.remove('open');
            });
        });
    }

    /* --------------------------------------------------------------------------
       7. ANIMATED SKILL PROGRESS BARS (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserverOptions = { threshold: 0.3 };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillBar = entry.target.querySelector('.progress-fill');
                if (fillBar) {
                    const targetWidth = fillBar.getAttribute('data-progress');
                    fillBar.style.width = targetWidth;
                }
                observer.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);

    skillCards.forEach(card => skillObserver.observe(card));

    /* --------------------------------------------------------------------------
       8. SKILL & PROJECT CATEGORY TAB FILTERING
       -------------------------------------------------------------------------- */
    function setupFilterTabs(tabContainerClass, gridSelector, itemSelector) {
        const filterBtns = document.querySelectorAll(`${tabContainerClass} .tab-btn`);
        const items = document.querySelectorAll(itemSelector);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active tab button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                items.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || (category && category.includes(filterValue))) {
                        item.style.display = '';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            if (btn.getAttribute('data-filter') !== 'all' && !item.getAttribute('data-category').includes(btn.getAttribute('data-filter'))) {
                                item.style.display = 'none';
                            }
                        }, 250);
                    }
                });
            });
        });
    }

    setupFilterTabs('.skill-tabs', '#skills-grid', '.skill-card');
    setupFilterTabs('.project-tabs', '#projects-grid', '.project-card');

    /* --------------------------------------------------------------------------
       9. ANIMATED STATISTICAL COUNTERS
       -------------------------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter-num');
    const statsSection = document.querySelector('.stats-counter-banner');

    if (statsSection && counters.length > 0) {
        let counted = false;

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        let current = 0;
                        const increment = Math.ceil(target / 40);
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target + (target === 100 || target === 60 ? '+' : '+');
                                clearInterval(timer);
                            } else {
                                counter.textContent = current;
                            }
                        }, 40);
                    });
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    /* --------------------------------------------------------------------------
       10. MODAL POPUPS MANAGER (PROJECTS & RESUME PREVIEW)
       -------------------------------------------------------------------------- */
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.modal-close-btn');
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    const resumeTriggers = document.querySelectorAll('.resume-download-trigger, #quick-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const printResumeBtn = document.getElementById('print-resume-btn');

    // Open Project Modals
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Open Resume Modal
    resumeTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (resumeModal) {
                resumeModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalBackdrops.forEach(m => m.classList.add('hidden'));
            document.body.style.overflow = '';
        });
    });

    // Close on Backdrop Click
    modalBackdrops.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });

    // Print / Save Resume
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }

    /* --------------------------------------------------------------------------
       11. CONTACT FORM VALIDATION & FEEDBACK TOAST
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formToast = document.getElementById('form-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            let isValid = true;

            // Reset Errors
            document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('error'));

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Subject
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('error');
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                // Show Button Loading State
                const btnText = submitBtn.querySelector('.btn-text');
                const btnSpinner = submitBtn.querySelector('.btn-spinner');

                btnText.classList.add('hidden');
                btnSpinner.classList.remove('hidden');
                submitBtn.disabled = true;

                // Simulate API call delay
                setTimeout(() => {
                    btnText.classList.remove('hidden');
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;

                    // Clear form fields
                    contactForm.reset();

                    // Show success toast notification
                    if (formToast) {
                        formToast.classList.remove('hidden');
                        setTimeout(() => {
                            formToast.classList.add('hidden');
                        }, 5000);
                    }
                }, 1200);
            }
        });
    }

    // Live Demo Buttons Trigger
    const demoTriggers = document.querySelectorAll('.demo-trigger');
    demoTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectTitle = btn.getAttribute('data-title') || 'this project';
            alert(`Live demo environment for "${projectTitle}" is preparing! Redirecting to contact for access key.`);
        });
    });

});
