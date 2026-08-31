/**
 * Kazi Emon — 3D Scroll Experience (GSAP + ScrollTrigger)
 *
 * Scroll-driven Z-axis animations:
 *  1. Hero: text scales up dramatically (pull "into" the screen) then fades.
 *  2. Services: glassmorphism cards emerge from depth (0.2 -> 1 scale) sequentially.
 *  3. Articles: horizontal scroll tied to vertical scroll in 3D perspective.
 *  4. Footer/Contact: smooth upward reveal (the "landing").
 *
 * All effects auto-detect and gracefully disable on mobile / reduced-motion.
 */
(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth <= 768;

    gsap.registerPlugin(ScrollTrigger);

    /* ─────────────────────────────────────────────
       1. HERO — Z-axis zoom that pulls the user in
    ───────────────────────────────────────────── */
    function initHero() {
        var hero = document.querySelector('.hero3d');
        if (!hero) return;
        var title = hero.querySelector('[data-zoom]');
        if (!title) return;

        gsap.to(hero.querySelectorAll('[data-zoom]'), {
            scale: 14,
            opacity: 0,
            filter: 'blur(12px)',
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Scroll hint fades once zoom begins
        var hint = hero.querySelector('.hero3d-scroll-hint');
        if (hint) {
            gsap.to(hint, {
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: hero,
                    start: 'top top',
                    end: '+=400',
                    scrub: true
                }
            });
        }
    }

    /* ─────────────────────────────────────────────
       2. SERVICES — 3D tunnel effect
       Cards scale 0.2 -> 1 sequentially as they
       pass through the viewport, like depth travel.
    ───────────────────────────────────────────── */
    function initTunnel() {
        var cards = document.querySelectorAll('[data-service]');
        if (!cards.length) return;

        cards.forEach(function (card, i) {
            gsap.fromTo(card, {
                xPercent: i % 2 === 0 ? -30 : 30,
                y: 60,
                scale: 0.2,
                opacity: 0,
                rotateX: i % 2 === 0 ? 18 : -18,
                z: -400
            }, {
                xPercent: 0,
                y: -40,
                scale: 1,
                opacity: 1,
                rotateX: 0,
                z: 0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 30%',
                    scrub: 1
                }
            });

            // After passing, drift gently forward/up for continuous depth feel
            gsap.to(card, {
                y: -120,
                opacity: 0.25,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 45%',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }

    /* ─────────────────────────────────────────────
       3. ARTICLES — horizontal scroll pinned, 3D
    ───────────────────────────────────────────── */
    function initHorizontal() {
        var pinWrap = document.querySelector('.articles3d-pin');
        if (!pinWrap) return;
        var track = document.querySelector('.articles3d-track');
        if (!track) return;

        var cards = track.querySelectorAll('[data-article]');
        var getWidth = function () {
            return track.scrollWidth - window.innerWidth;
        };

        var tween = gsap.to(track, {
            x: function () { return -getWidth(); },
            ease: 'none',
            scrollTrigger: {
                trigger: pinWrap,
                start: 'top top',
                end: function () { return '+=' + (getWidth() + window.innerHeight); },
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        // 3D depth + slight yaw per card, tied to the horizontal travel via
        // containerAnimation so each card dips in/out of depth as it crosses.
        cards.forEach(function (card, i) {
            gsap.fromTo(card, {
                z: -80,
                rotateY: 10
            }, {
                z: 80,
                rotateY: -10,
                ease: 'none',
                scrollTrigger: {
                    containerAnimation: tween,
                    trigger: card,
                    start: 'left 80%',
                    end: 'left 20%',
                    scrub: true
                }
            });
        });

        return tween;
    }

    /* ─────────────────────────────────────────────
       4. LANDING — upward reveal of results, contact,
          and social links at the end of the journey.
    ───────────────────────────────────────────── */
    function initLanding() {
        // Gate visibility through JS only (no-GSAP fallback keeps content visible)
        document.querySelectorAll('[data-landing]').forEach(function (el) {
            gsap.set(el, { opacity: 0 });
        });
        gsap.set('.contact-detail', { opacity: 0 });
        gsap.set('.contact-social-links .contact-social-btn', { opacity: 0, scale: 0.6 });
        gsap.set('.landing-cta', { opacity: 0 });

        document.querySelectorAll('[data-landing]').forEach(function (el, i) {
            gsap.fromTo(el, { y: 80, opacity: 0 }, {
                y: 0,
                opacity: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });

        gsap.fromTo('.contact-detail', { y: 40, opacity: 0, stagger: 0.1 }, {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.landing-contact',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        gsap.fromTo('.contact-social-links .contact-social-btn', { y: 40, opacity: 0, scale: 0.6, stagger: 0.08 }, {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.landing-contact',
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        });

        gsap.fromTo('.landing-cta', { y: 40, opacity: 0 }, {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.landing-contact',
                start: 'top 72%',
                toggleActions: 'play none none none'
            }
        });
    }

    /* ─────────────────────────────────────────────
       Bootstrap
    ───────────────────────────────────────────── */
    function init() {
        initHero();

        if (!isMobile && !prefersReducedMotion) {
            initTunnel();
            initHorizontal();
        } else {
            // Mobile/reduced-motion safe fallbacks — reveal elements gracefully
            document.querySelectorAll('[data-service], [data-article]').forEach(function (el) {
                gsap.set(el, { scale: 1, opacity: 1, x: 0, rotateX: 0, z: 0 });
            });
        }

        initLanding();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
