(function () {
    'use strict';

    /* ─── TYPING EFFECT ─── */
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = ['Platform Optimization', 'Strategic Planning', 'Facebook Ads'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    /* ─── PORTFOLIO CAROUSEL (Slick) ─── */
    if (typeof $ !== 'undefined' && $.fn && $.fn.slick) {
        $('.portfolio-carousel').slick({
            dots: true,
            arrows: true,
            infinite: true,
            speed: 600,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            responsive: [
                { breakpoint: 768, settings: { arrows: false, dots: true } }
            ]
        });
    }

    /* ─── HAMBURGER / MOBILE NAV ─── */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ─── NAVBAR SCROLL EFFECT ─── */
    const navbar = document.querySelector('.navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ─── ACTIVE NAV LINK (scroll spy) ─── */
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        let currentId = 'home';
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.id;
            }
        });

        const matchingLink = document.querySelector('.nav-link[href="#' + currentId + '"]');
        if (matchingLink) {
            matchingLink.classList.add('active');
        } else {
            const homeLink = document.querySelector('.nav-link[href="#main"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('load', updateActiveNav);

    /* ─── SCROLL REVEAL ─── */
    function revealElements() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 120;

        reveals.forEach(function (el) {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealElements, { passive: true });
    window.addEventListener('load', revealElements);
    revealElements();

    /* ─── BACK TO TOP ─── */
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─── NEWSLETTER FORM ─── */
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const email = input.value.trim();

            if (email) {
                const btn = this.querySelector('button');
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                btn.disabled = true;

                setTimeout(function () {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    input.value = '';

                    setTimeout(function () {
                        btn.innerHTML = originalHtml;
                        btn.disabled = false;
                    }, 2000);
                }, 1000);
            }
        });
    }

    /* ─── CONTACT FORM ─── */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('.form-submit-btn');
            const originalHtml = btn.innerHTML;

            btn.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const formData = new FormData(this);
            const data = {};
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            fetch('https://formsubmit.co/ajax/kaziaremon@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.success === true || response.message) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent! I\'ll get back to you within 24 hours.';
                    contactForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Something went wrong. Please email me directly at kaziaremon@gmail.com.';
                }
            })
            .catch(function () {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Something went wrong. Please email me directly at kaziaremon@gmail.com.';
            })
            .finally(function () {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            });
        });
    }

})();
