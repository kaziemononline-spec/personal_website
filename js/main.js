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

    /* ─── PORTFOLIO (static grid, carousel removed per QA) ─── */

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

    /* ─── ACTIVE NAV LINK (scroll spy, homepage only) ─── */
    var sectionToPage = {
        'about': 'about.html',
        'contact': 'contact.html'
    };

    function updateActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        var scrollPos = window.scrollY + 120;

        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        var currentId = 'home';
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.id;
            }
        });

        var link = document.querySelector('.nav-link[href="#' + currentId + '"]');
        if (!link && sectionToPage[currentId]) {
            link = document.querySelector('.nav-link[href="' + sectionToPage[currentId] + '"]');
        }
        if (link) {
            link.classList.add('active');
        } else {
            var homeLink = document.querySelector('.nav-link[href="#main"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    if (document.querySelectorAll('section[id]').length > 0) {
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        window.addEventListener('load', updateActiveNav);
    }

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
    const newsletterStatus = document.getElementById('newsletterStatus');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const email = input.value.trim();

            if (!email) return;

            const btn = this.querySelector('button');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            if (newsletterStatus) newsletterStatus.textContent = '';

            const formData = new FormData();
            formData.append('access_key', '3b3fb149-1b7f-4fc7-b0a7-6d99b86f36e7');
            formData.append('email', email);
            formData.append('subject', 'New Newsletter Subscription');
            formData.append('from_name', 'Kazi Emon Website');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function () {
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                input.value = '';
                if (newsletterStatus) {
                    newsletterStatus.textContent = 'You\'re subscribed!';
                    newsletterStatus.className = 'newsletter-status success';
                }
                setTimeout(function () {
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                    if (newsletterStatus) {
                        setTimeout(function () {
                            newsletterStatus.textContent = '';
                            newsletterStatus.className = 'newsletter-status';
                        }, 4000);
                    }
                }, 2000);
            })
            .catch(function () {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
                if (newsletterStatus) {
                    newsletterStatus.textContent = 'Something went wrong. Try again.';
                    newsletterStatus.className = 'newsletter-status error';
                }
            });
        });
    }

    /* ─── CONTACT FORM ─── */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.form-submit-btn, .form-submit');
            const originalHtml = submitBtn ? submitBtn.innerHTML : '';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill in all fields.';
                return;
            }

            if (submitBtn) {
                submitBtn.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
            }
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            var hiddenSubject = document.getElementById('hiddenSubject');
            var subjectInput = document.getElementById('subject');
            if (hiddenSubject && subjectInput) {
                hiddenSubject.value = 'New Contact: ' + subjectInput.value.trim();
            }

            const formData = new FormData(this);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function (res) { return res.json(); })
            .then(function (response) {
                if (response.success) {
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
                if (submitBtn) {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.disabled = false;
                }
            });
        });
    }

})();
