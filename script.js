document.addEventListener('DOMContentLoaded', () => {
    class Portfolio {
        constructor() {
            // Configuración inicial
            this.config = {
                defaultLang: 'es',
                validLangs: ['es', 'en', 'pt'],
                storageKeys: {
                    lang: 'portfolioLang',
                    skillTab: 'activeSkillTab'
                },
                scrollOffset: 100,
                backToTopThreshold: 500,
                formSubmitDelay: 1500,
                cvDownloadDelay: 1000,
                alertDuration: 500, 
            };

            this.cacheDOM();
            this.initModules();
            this.setupEventListeners();
            this.initLanguage();
        }

        // Cachear elementos DOM
        cacheDOM() {
            this.dom = {
                navbar: document.querySelector('.navbar'),
                navMenu: document.querySelector('.nav-menu'),
                menuToggle: document.querySelector('.menu-toggle'),
                backToTop: document.querySelector('.back-to-top'),
                contactForm: document.getElementById('form-contact'),
                downloadCv: document.querySelector('.download-cv'),
                langOptions: document.querySelectorAll('.lang-option'),
                tabBtns: document.querySelectorAll('.tab-btn'),
                filterBtns: document.querySelectorAll('.filter-btn'),
                projectCards: document.querySelectorAll('.project-card'),
                navLinks: document.querySelectorAll('.nav-link'),
                skillItems: document.querySelectorAll('.skill-item'),
                skillProgresses: document.querySelectorAll('.skill-progress'),
                typedElement: document.querySelector('.typed-text'),
                sections: document.querySelectorAll('section')
            };
        }

        // Inicializar módulos
        initModules() {
            this.initParticles();
            this.initCustomCursor();
            this.initTypedEffect();
            this.initScrollEffects();
            this.initLanguageSwitcher();
            this.initSkillTabs();
            this.initProjectFilter();
            this.initSkillBarAnimation();
            this.initMobileMenu();
            this.initContactForm();
            this.initCVDownload();
        }

        // Configurar event listeners
        setupEventListeners() {
            // Smooth scroll
            document.addEventListener('click', (e) => {
                const anchor = e.target.closest('a[href^="#"]');
                if (anchor) {
                    e.preventDefault();
                    this.handleSmoothScroll(anchor);
                }
            });

            // Cerrar menú móvil
            if (this.dom.navMenu) {
                this.dom.navMenu.addEventListener('click', (e) => {
                    if (e.target.classList.contains('nav-link') && this.dom.navMenu.classList.contains('active')) {
                        this.closeMobileMenu();
                    }
                });
            }

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (this.dom.navMenu && this.dom.navMenu.classList.contains('active') && 
                    !e.target.closest('.nav-menu') && 
                    !e.target.closest('.menu-toggle')) {
                    this.closeMobileMenu();
                }
            });

            // Accesibilidad del menú
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.dom.navMenu && this.dom.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                    if (this.dom.menuToggle) this.dom.menuToggle.focus();
                }
            });
        }

        /* ======================
           MÓDULOS PRINCIPALES
        ====================== */

        // Inicializar el idioma
        initLanguage() {
            const savedLang = localStorage.getItem(this.config.storageKeys.lang);
            const browserLang = navigator.language.substring(0, 2);
            
            this.currentLang = this.config.validLangs.includes(savedLang) 
                ? savedLang 
                : this.config.validLangs.includes(browserLang)
                    ? browserLang
                    : this.config.defaultLang;
            
            this.setActiveLanguage(this.currentLang);
        }

        initLanguageSwitcher() {
            if (!this.dom.langOptions.length) return;
            
            this.dom.langOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = option.dataset.lang;
                    if (lang !== this.currentLang) {
                        this.setActiveLanguage(lang);
                    }
                });
            });
        }

        setActiveLanguage(lang) {
            if (!this.config.validLangs.includes(lang)) {
                console.warn('Invalid language:', lang);
                return;
            }

            this.currentLang = lang;
            localStorage.setItem(this.config.storageKeys.lang, lang);

            this.dom.langOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.lang === lang);
            });

            this.updateLanguageElements();
            this.updateDynamicTexts(lang);
            this.updatePageTitle(lang);

            if (this.dom.typedElement) {
                this.createTypedInstance(lang);

            }
        }

        updateLanguageElements() {
            document.querySelectorAll('[class*="lang-"]:not(.lang-option)').forEach(el => {
                el.style.display = 'none';
            });

            document.querySelectorAll(`.lang-${this.currentLang}`).forEach(el => {
                const displayType = el.dataset.display || 
                (el.tagName === 'SPAN' ? 'inline' : 'block');
                el.style.display = displayType;
            });
        }
        updatePageTitle(lang) {
            const titles = {
                es: 'Titojoa | Desarrollador Full Stack',
                en: 'Titojoa | Full Stack Developer',
                pt: 'Titojoa | Desenvolvedor Full Stack'
            };
            document.title = titles[lang] || titles[this.config.defaultLang];
        }


        updateDynamicTexts(lang) {
            const texts = {
                '#home': { es: 'Inicio', en: 'Home', pt: 'Início' },
                '#about': { es: 'Sobre mí', en: 'About', pt: 'Sobre' },
                '#skills': { es: 'Habilidades', en: 'Skills', pt: 'Habilidades' },
                '#projects': { es: 'Proyectos', en: 'Projects', pt: 'Projetos' },
                '#contact': { es: 'Contacto', en: 'Contact', pt: 'Contato' }
            };

            this.dom.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (navTexts[href]) {
                    link.textContent = navTexts[href][lang] || navTexts[href]['es'];
                }
            });
            
            // Otros textos dinámicos
            const textElements = {
                '.home-text .description': {
                    es: 'Creando soluciones digitales con código elegante y eficiente.',
                    en: 'Creating digital solutions with elegant and efficient code.',
                    pt: 'Criando soluções digitais com código elegante e eficiente.'
                },
                '.home-buttons .btn:nth-child(1)': {
                    es: 'Ver mis proyectos',
                    en: 'View my projects',
                    pt: 'Ver meus projetos'
                },
                '.home-buttons .btn:nth-child(2)': {
                    es: 'Contáctame',
                    en: 'Contact me',
                    pt: 'Contate-me'
                },
                '.scroll-down span': {
                    es: 'Desplazar hacia abajo',
                    en: 'Scroll Down',
                    pt: 'Role para baixo'
                },
                '.download-cv span': {
                    es: 'Descargar CV',
                    en: 'Download CV',
                    pt: 'Baixar CV'
                },
                'button[type="submit"]': {
                    es: 'Enviar Mensaje',
                    en: 'Send Message',
                    pt: 'Enviar Mensagem'
                }
            };
            
            Object.entries(textElements).forEach(([selector, texts]) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.textContent = texts[lang] || texts[this.config.defaultLang];
                }
            });
            
            // Actualizar placeholders
            const placeholderTexts = {
                'input[name="name"]': {
                    es: 'Tu nombre',
                    en: 'Your name',
                    pt: 'Seu nome'
                },
                'input[name="email"]': {
                    es: 'Tu email',
                    en: 'Your email',
                    pt: 'Seu email'
                },
                'textarea[name="message"]': {
                    es: 'Tu mensaje',
                    en: 'Your message',
                    pt: 'Sua mensagem'
                }
            };
            
            Object.entries(placeholderTexts).forEach(([selector, texts]) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.placeholder = texts[lang] || texts[this.config.defaultLang];
                }
            });
        }


        // Particle.js con configuración optimizada
        initParticles() {
            if (!document.getElementById('particles-js') || typeof particlesJS !== 'function') return;

            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 80, 
                        density: { 
                            enable: true, 
                            value_area: 800 
                        } 
                    },
                    color: { 
                        value: ["#00ff9d", "#00b4ff", "#ff2d75"] 
                    },
                    shape: { 
                        type: "circle" 
                    },
                    opacity: {
                        value: 0.7,
                        random: true,
                        anim: { 
                            enable: true, 
                            speed: 1, 
                            opacity_min: 0.1 
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: { 
                            enable: true, 
                            speed: 2, 
                            size_min: 0.1 
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#00b4ff",
                        opacity: 0.3,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "bounce",
                        bounce: true
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: "grab" 
                        },
                        onclick: { 
                            enable: true, 
                            mode: "push" 
                        },
                        resize: true
                    },
                    modes: {
                        grab: { 
                            distance: 180, 
                            line_linked: { 
                                opacity: 0.8 
                            } 
                        },
                        push: { 
                            particles_nb: 4 
                        }
                    }
                },
                retina_detect: true
            });
        }

        // Cursor personalizado optimizado
        initCustomCursor() {
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor-follower');
            
            if (!cursor || !cursorFollower) return;
            
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;
            const speed = 0.15;
            let rafId = null;
            
            const animateCursor = () => {
                const dx = mouseX - followerX;
                const dy = mouseY - followerY;
                
                followerX += dx * speed;
                followerY += dy * speed;
                
                cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
                cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
                
                rafId = requestAnimationFrame(animateCursor);
            };
            
            const handleMouseMove = (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };
            
            const handleInteractiveElements = (e) => {
                const target = e.target;
                
                // Verificar que target es un elemento DOM válido
                if (!target || !target.matches) return;
                
                const isInteractive = target.matches('a, button, .project-card, .tab-btn, .filter-btn, .lang-option, input, textarea, label[for]');
                
                if (!isInteractive) return;
                
                if (e.type === 'mouseenter') {
                    cursor.classList.add('active');
                    cursorFollower.classList.add('active');
                    
                    if (target.classList.contains('project-card')) {
                        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1.5)`;
                    } else if (target.matches('input, textarea')) {
                        cursor.style.display = 'none';
                    }
                } else {
                    cursor.classList.remove('active');
                    cursorFollower.classList.remove('active');
                    
                    if (target.matches('input, textarea')) {
                        cursor.style.display = 'block';
                    }
                }
            };
            
            // Iniciar animación
            animateCursor();
            
            // Event listeners optimizados
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseover', handleInteractiveElements);
            document.addEventListener('mouseout', handleInteractiveElements);
            
            // Limpieza
            return () => {
                cancelAnimationFrame(rafId);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseover', handleInteractiveElements);
                document.removeEventListener('mouseout', handleInteractiveElements);
            };
        }

        // Efecto Typed.js optimizado
        initTypedEffect() {
            if (!this.dom.typedElement || typeof Typed === 'undefined') return;
            
            this.typedTexts = {
                es: [
                    'Desarrollador Full Stack', 
                    'Experto en Python', 
                    'Desarrollador Flask',
                    'Diseñador Web',
                    'Desarrollador JavaScript'
                ],
                en: [
                    'Full Stack Developer', 
                    'Python Expert', 
                    'Flask Developer',
                    'Web Designer',
                    'JavaScript Developer'
                ],
                pt: [
                    'Desenvolvedor Full Stack', 
                    'Especialista em Python', 
                    'Desenvolvedor Flask',
                    'Designer Web',
                    'Desenvolvedor JavaScript'
                ]
            };
            
            this.createTypedInstance(this.currentLang);
        }
        
        createTypedInstance(lang) {
            if (this.typedInstance) {
                this.typedInstance.destroy();
                this.dom.typedElement.innerHTML = '';
            }
            
            const textSpan = document.createElement('span');
            textSpan.className = 'typed-text-content';
            this.dom.typedElement.appendChild(textSpan);
            
            const cursor = document.createElement('span');
            cursor.className = 'typed-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            cursor.textContent = '|';
            this.dom.typedElement.appendChild(cursor);
            
            this.typedInstance = new Typed(textSpan, {
                strings: this.typedTexts[lang] || this.typedTexts[this.config.defaultLang],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                loop: true,
                showCursor: false,
                smartBackspace: true
            });
        }

        // Efectos de scroll optimizados
        initScrollEffects() {
            const handleScroll = () => {
                const scrollY = window.scrollY;
                
                // Navbar effect
                if (this.dom.navbar) {
                    this.dom.navbar.classList.toggle('scrolled', scrollY > this.config.scrollOffset);
                }
                
                // Back to top button
                if (this.dom.backToTop) {
                    this.dom.backToTop.classList.toggle('active', scrollY > this.config.backToTopThreshold);
                }
                
                // Active section in menu
                let currentSection = '';
                
                this.dom.sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        currentSection = section.id;
                    }
                });
                
                this.dom.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
                });
            };
            
            window.addEventListener('scroll', this.debounce(handleScroll, 15));
            handleScroll();
        }

        /* ======================
           MÓDULOS SECUNDARIOS
        ====================== */

        // Pestañas de habilidades
        initSkillTabs() {
            if (!this.dom.tabBtns.length) return;
            
            const savedTab = localStorage.getItem(this.config.storageKeys.skillTab) || 'frontend';
            this.setActiveSkillTab(savedTab);
            
            this.dom.tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setActiveSkillTab(btn.dataset.category);
                    localStorage.setItem(this.config.storageKeys.skillTab, btn.dataset.category);
                });
            });
        }
        
        setActiveSkillTab(category) {
            this.dom.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
            
            document.querySelectorAll('.category-content').forEach(content => {
                content.classList.toggle('active', content.id === category);
            });
        }

        // Filtro de proyectos optimizado
        initProjectFilter() {
            if (!this.dom.filterBtns.length || !this.dom.projectCards.length) return;
            
            const urlHash = window.location.hash.substring(1);
            const validFilters = ['all', 'web', 'ecommerce', 'flask'];
            const initialFilter = validFilters.includes(urlHash) ? urlHash : 'all';
            
            this.setActiveProjectFilter(initialFilter);
            
            this.dom.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setActiveProjectFilter(btn.dataset.filter);
                    window.location.hash = btn.dataset.filter;
                });
            });
        }
        
        setActiveProjectFilter(filter) {
            this.dom.filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
            
            this.dom.projectCards.forEach(card => {
                const categories = card.dataset.category.split(',');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                card.style.transition = 'opacity 0.3s ease';
                card.style.opacity = shouldShow ? '1' : '0';
                card.style.display = shouldShow ? 'block' : 'none';
            });
        }

        // Animación de barras de habilidades con IntersectionObserver
        initSkillBarAnimation() {
            if (!this.dom.skillProgresses.length) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progress = entry.target;
                        const level = progress.dataset.level;
                        const delay = parseInt(progress.closest('.skill-item').dataset.index) * 100;
                        
                        setTimeout(() => {
                            progress.style.width = `${level}%`;
                            progress.style.opacity = '1';
                        }, delay);
                        
                        observer.unobserve(progress);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.dom.skillItems.forEach((item, index) => {
                item.dataset.index = index;
            });
            
            this.dom.skillProgresses.forEach(progress => {
                progress.style.width = '0%';
                progress.style.opacity = '0.5';
                observer.observe(progress);
            });
        }

        // Menú móvil optimizado
        initMobileMenu() {
            if (!this.dom.menuToggle || !this.dom.navMenu) return;
            
            this.dom.menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            
            // Prevenir scroll cuando el menú está abierto
            document.addEventListener('scroll', () => {
                if (this.dom.navMenu.classList.contains('active')) {
                    window.scrollTo(0, 0);
                }
            });
        }
        
        toggleMobileMenu() {
            this.dom.menuToggle.classList.toggle('active');
            this.dom.navMenu.classList.toggle('active');
            document.body.style.overflow = this.dom.navMenu.classList.contains('active') ? 'hidden' : '';
        }
        
        closeMobileMenu() {
            this.dom.menuToggle.classList.remove('active');
            this.dom.navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Formulario de contacto optimizado
        initContactForm() {
            if (!this.dom.contactForm) return;
            
            this.dom.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        async handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.dom.contactForm);
            const submitBtn = this.dom.contactForm.querySelector('button[type="submit"]');
            
            const errorMessages = {
                es: {
                    required: 'Por favor completa todos los campos requeridos',
                    email: 'Por favor ingresa un email válido',
                    success: 'Mensaje enviado con éxito. ¡Gracias!',
                    error: 'Error al enviar el mensaje. Por favor intenta nuevamente.'
                },
                en: {
                    required: 'Please fill in all required fields',
                    email: 'Please enter a valid email address',
                    success: 'Message sent successfully. Thank you!',
                    error: 'Error sending message. Please try again.'
                },
                pt: {
                    required: 'Por favor preencha todos os campos obrigatórios',
                    email: 'Por favor insira um email válido',
                    success: 'Mensagem enviada com sucesso. Obrigado!',
                    error: 'Erro ao enviar mensagem. Por favor tente novamente.'
                }
            };
            
            // Validación
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                this.showAlert(errorMessages[this.currentLang].required, 'error');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                this.showAlert(errorMessages[this.currentLang].email, 'error');
                return;
            }
            
            // Estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = this.getLoadingText();
            
            try {
                // Simular envío
                await new Promise(resolve => setTimeout(resolve, this.config.formSubmitDelay));
                
                this.showAlert(errorMessages[this.currentLang].success, 'success');
                this.dom.contactForm.reset();
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'Contact Form Submission'
                    });
                }
            } catch (error) {
                this.showAlert(errorMessages[this.currentLang].error, 'error');
                console.error('Error submitting form:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = this.getSubmitButtonText();
            }
        }
        
        getLoadingText() {
            const texts = {
                es: '<i class="fas fa-spinner fa-spin"></i> Enviando...',
                en: '<i class="fas fa-spinner fa-spin"></i> Sending...',
                pt: '<i class="fas fa-spinner fa-spin"></i> Enviando...'
            };
            return texts[this.currentLang] || texts[this.config.defaultLang];
        }
        
        getSubmitButtonText() {
            const texts = {
                es: 'Enviar Mensaje <i class="fas fa-paper-plane"></i>',
                en: 'Send Message <i class="fas fa-paper-plane"></i>',
                pt: 'Enviar Mensagem <i class="fas fa-paper-plane"></i>'
            };
            return texts[this.currentLang] || texts[this.config.defaultLang];
        }

        // Descarga de CV optimizada
        initCVDownload() {
            if (!this.dom.downloadCv) return;
            
            this.dom.downloadCv.addEventListener('click', this.handleCVDownload.bind(this));
        }
        
        handleCVDownload(e) {
            e.preventDefault();
            
            const downloadMessages = {
                es: 'Iniciando descarga del CV...',
                en: 'Starting CV download...',
                pt: 'Iniciando download do CV...'
            };
            
            // Mostrar notificación al usuario
            this.showAlert(downloadMessages[this.currentLang], 'info');
            
            // Track download event if Google Analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cv_download', {
                    'event_category': 'engagement',
                    'event_label': `CV Download - ${this.currentLang.toUpperCase()}`
                });
            }
            
            // Configurar temporizador para simular preparación
            setTimeout(() => {
                const fileName = this.getCVFileName();
                
                // Crear enlace temporal en el mismo directorio
                const link = document.createElement('a');
                link.href = fileName; // Archivo en el mismo nivel
                link.download = fileName;
                
                // Solución universal para navegadores modernos
                if (document.createEvent) {
                    const event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    link.dispatchEvent(event);
                } else {
                    link.click();
                }
                
                // Alternativa para Firefox
                setTimeout(() => {
                    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                        window.location.href = fileName;
                    }
                }, 100);
                
            }, this.config.cvDownloadDelay);
        }
        
        getCVFileName() {
            const cvFilenames = {
                es: 'CV_Joaquin2025.pdf',
                en: 'CV_Joaquin_English.pdf',
                pt: 'CV_Joaquin_Portugues.pdf'
            };
            return cvFilenames[this.currentLang] || cvFilenames[this.config.defaultLang];
        }

        // Smooth scroll optimizado
        handleSmoothScroll(anchor) {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbarHeight = this.dom.navbar ? this.dom.navbar.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.closeMobileMenu();
            history.pushState(null, null, targetId);
        }

        // Mostrar notificación optimizada
        showAlert(message, type) {
            const alertBox = document.createElement('div');
            alertBox.className = `alert-box ${type}`;
            alertBox.textContent = message;
            
            document.body.appendChild(alertBox);
            
            setTimeout(() => {
                alertBox.classList.add('show');
                
                setTimeout(() => {
                    alertBox.classList.remove('show');
                    
                    setTimeout(() => {
                        document.body.removeChild(alertBox);
                    }, 300);
                }, this.config.alertDuration);
            }, 10);
        }
        
        // Debounce optimizado
        debounce(func, wait, immediate = false) {
            let timeout;
            return (...args) => {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        }
    }

    // Inicializar el portafolio
    new Portfolio();

    // Polyfill para smooth scroll en Safari
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
        script.onload = () => {
            if (typeof smoothscroll !== 'undefined') {
                smoothscroll.polyfill();
            }
        };
        document.head.appendChild(script);
    }
});