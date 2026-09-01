(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── HAMBURGER / MOBILE NAV ─── */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            var expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
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
    var progressBar = document.getElementById('scrollProgress');
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
    var navbar = document.querySelector('.navbar');
    function handleNavScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ─── ACTIVE NAV LINK (scroll spy) ─── */
    function updateActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

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
        if (link) {
            link.classList.add('active');
        } else {
            var homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    if (document.querySelectorAll('section[id]').length > 0) {
        window.addEventListener('scroll', updateActiveNav, { passive: true });
        window.addEventListener('load', updateActiveNav);
    }

    /* ─── SCROLL REVEAL (FADE IN) ─── */
    var revealElements = document.querySelectorAll('.fade-in-up');
    if (revealElements.length > 0) {
        if (prefersReducedMotion) {
            revealElements.forEach(function (el) { el.classList.add('visible'); });
        } else {
            var revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            revealElements.forEach(function (el) {
                revealObserver.observe(el);
            });
        }
    }

    /* ─── NUMBER COUNTING ANIMATION ─── */
    var countEls = document.querySelectorAll('[data-count]');
    if (countEls.length > 0) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
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
                    if (!prefersReducedMotion) {
                        requestAnimationFrame(update);
                    }
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        countEls.forEach(function (el) {
            countObserver.observe(el);
        });
    }

    /* ─── SMOOTH SECTION LINK SCROLL ─── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ─── BACK TO TOP ─── */
    var backToTop = document.getElementById('backToTop');
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
    var newsletterForm = document.getElementById('newsletterForm');
    var newsletterStatus = document.getElementById('newsletterStatus');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = this.querySelector('input');
            var email = input.value.trim();
            if (!email) return;

            var btn = this.querySelector('button');
            var originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            if (newsletterStatus) newsletterStatus.textContent = '';

            var formData = new FormData();
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

    /* ────────────────────────────────────────────────────────
       3D SCROLL EFFECT START
       Lightweight parallax + 3D depth on scroll.
       To remove this effect, delete everything between this
       marker and the "3D SCROLL EFFECT END" marker below, then
       also remove the CSS block marked "3D SCROLL EFFECT" in
       css/style.css.
       ──────────────────────────────────────────────────────── */
    if (!prefersReducedMotion && document.body.classList.contains('scroll-3d')) {
        var depthElements = document.querySelectorAll('.hero-parallax [data-depth]');
        var depthSections = document.querySelectorAll('.depth-section');
        var ticking = false;

        // Map each hero layer data-depth to a translateZ distance.
        // JS overrides the resting CSS transform so we can combine
        // the fixed 3D depth with a scroll-driven vertical drift.
        function depthZ(value) {
            if (value === '-20') return -30;
            if (value === '-10') return -14;
            if (value === '10') return 12;
            if (value === '20') return 30;
            return 0;
        }

        function applyDepth() {
            var scrollY = window.scrollY;
            var progress = Math.min(scrollY / window.innerHeight, 1);

            // Hero layers drift vertically at slightly different
            // rates to create smooth momentum while scrolling away.
            depthElements.forEach(function (el) {
                var depth = el.getAttribute('data-depth') || '0';
                var z = depthZ(depth);
                var drift = progress * 40; // px downward as you scroll
                el.style.transform = 'translateZ(' + z + 'px) translateY(' + drift + 'px)';
            });

            ticking = false;
        }

        // Reveal sections "pushing forward" in 3D as they enter view.
        var depthObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('depth-active');
                } else {
                    entry.target.classList.remove('depth-active');
                }
            });
        }, { threshold: 0.15 });

        depthSections.forEach(function (section) {
            depthObserver.observe(section);
        });

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(applyDepth);
                ticking = true;
            }
        }, { passive: true });
        applyDepth();
    }
    /* ────────────────────────────────────────────────────────
       3D SCROLL EFFECT END
       ──────────────────────────────────────────────────────── */
})();