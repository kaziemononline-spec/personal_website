/**
 * Kazi Emon — Smooth 3D Sticky Card Stacking
 *
 * Approach (stable & buttery, no broken Z-axis zoom, no pinning, no horizontal scroll):
 *
 *  1. The SERVICES section uses pure CSS `position: sticky` stacking. Each sticky
 *     card "decks" over the previous one as the user scrolls — document flow stays
 *     fully intact (great for SEO & no-JS).
 *
 *  2. JS is a PROGRESSIVE ENHANCEMENT only. It adds a subtle, smooth 3D feel:
 *       - Cards lightly scale + translateZ as they travel through the viewport.
 *       - Back cards gently dim to create depth.
 *     All transforms are driven by ScrollTrigger with `scrub`, mapped to the native
 *     scrollbar, so it never hides content and never fights the sticky layout.
 *
 *  3. Cards placed before the final position are undone via the ScrollTrigger
 *     `onLeaveBack` callback so the stack lays flat again when scrolling up.
 *
 * If GSAP fails to load, everything remains perfectly visible — no content is ever
 * hidden by JS (unlike the old version which gated landing content on GSAP).
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        /* Helpers to apply/clear transforms on a sticky card. */
        function flat(el) {
            gsap.set(el, { scale: 1, z: 0, opacity: 1, rotateX: 0, y: 0 });
        }

        /*
         * SERVICES — 3D Sticky Stack
         * Each sticky-card is a full viewport "deck" slot. As it enters and leaves
         * the middle of the screen, we give it a gentle 3D pop: it brightens, pulls
         * towards the viewer (translateZ), and scales slightly. Cards ahead are
         * nudged back to reinforce depth.
         */
        var stack = document.querySelector('[data-sticky-stack]');
        var cards = document.querySelectorAll('.sticky-card[data-sticky-card]');

        if (cards.length && stack) {
            var total = cards.length;

            cards.forEach(function (card, i) {
                if (prefersReducedMotion) { flat(card); return; }

                // The very last card stays resting "front".
                var isLast = i === total - 1;

                var intro = gsap.fromTo(card,
                    {
                        scale: isLast ? 0.92 : 0.9,
                        z: isLast ? -60 : -140,
                        opacity: 0.55,
                        rotateX: 4
                    },
                    {
                        scale: 1,
                        z: 0,
                        opacity: 1,
                        rotateX: 0,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'center center',
                            scrub: 0.6
                        }
                    }
                );

                // Slight drift forward as it passes center (depth glide).
                var glide = gsap.to(card, {
                    scale: 1.03,
                    z: 40,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'center center',
                        end: 'top top',
                        scrub: 0.6
                    }
                });

                // When scrolling back up, flatten so the stack always rebuilds cleanly.
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top bottom',
                    onLeaveBack: function () { flat(card); }
                });

                // Nudge each earlier card back a touch more for layering depth.
                if (!isLast) {
                    var depth = (total - i) * 30;
                    gsap.fromTo(card, { z: 0 }, {
                        z: -depth,
                        opacity: 0.9,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: stack,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 0.6
                        }
                    });
                }
            });

            // Prevent layout thrash: recompute all measurements on resize.
            ScrollTrigger.refresh();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
