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

    /* ─── SCROLL PROGRESS BAR ─── */
    const progressBar = document.getElementById('scrollProgress');

    function updateProgress() {
        if (!progressBar) return;
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

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

    /* ─── SCROLL REVEAL (IntersectionObserver) ─── */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ─── ENTRANCE FADE (for hero sequence) ─── */
    const entranceEls = document.querySelectorAll('.entrance-fade');
    if (entranceEls.length > 0) {
        setTimeout(function () {
            entranceEls.forEach(function (el, i) {
                setTimeout(function () {
                    el.classList.add('active');
                }, i * 150);
            });
        }, 200);
    }

    /* ─── NUMBER COUNTING ANIMATION ─── */
    const countEls = document.querySelectorAll('[data-count]');
    if (countEls.length > 0) {
        const countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    var originalText = el.textContent;
                    var raw = originalText.replace(/[+\-%a-zA-Z]/g, '').trim();
                    var target = raw.indexOf('.') > -1 ? parseFloat(raw) : parseInt(raw);
                    var hasDecimal = raw.indexOf('.') > -1;
                    var hasPlus = originalText.indexOf('+') > -1;
                    var hasX = originalText.indexOf('x') > -1;
                    var hasPercent = originalText.indexOf('%') > -1;
                    var duration = 1800;
                    var startTime = performance.now();
                    var suffix = '';
                    if (hasPlus) suffix = '+';
                    else if (hasX) suffix = 'x';
                    else if (hasPercent) suffix = '%';

                    el.classList.add('active');
                    function update(now) {
                        var progress = Math.min((now - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
                        var current = eased * target;
                        var display = hasDecimal ? current.toFixed(1) : Math.floor(current);
                        el.textContent = display + suffix;
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = target + suffix;
                        }
                    }
                    requestAnimationFrame(update);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        countEls.forEach(function (el) {
            el.classList.add('stat-number-init');
            countObserver.observe(el);
        });
    }

    /* ─── CARD 3D TILT EFFECT ─── */
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (tiltCards.length > 0) {
        tiltCards.forEach(function (card) {
            var isInside = false;
            card.addEventListener('mouseenter', function () {
                isInside = true;
            });
            card.addEventListener('mousemove', function (e) {
                if (!isInside) return;
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 12;
                const rotateY = (centerX - x) / 12;
                this.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
            });
            card.addEventListener('mouseleave', function () {
                isInside = false;
                this.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    /* ─── MAGNETIC BUTTON EFFECT ─── */
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    if (magneticBtns.length > 0) {
        magneticBtns.forEach(function (btn) {
            var originalTransform = '';
            btn.addEventListener('mouseenter', function () {
                originalTransform = this.style.transform || '';
            });
            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = originalTransform + ' translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                this.style.transform = originalTransform;
            });
        });
    }

    /* ─── SMOOTH SECTION LINK SCROLL ─── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

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
                        }, 15000);
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