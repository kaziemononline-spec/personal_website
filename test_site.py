import sys, os
sys.path.insert(0, '/tmp/playwright_venv/lib/python3.12/site-packages' if os.path.exists('/tmp/playwright_venv') else '')

from playwright.sync_api import sync_playwright
import time

URL = "https://www.kaziemon.online/"

def test_all():
    issues = []
    passed = 0
    failed = 0

    def check(condition, msg):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  ✅ {msg}")
        else:
            failed += 1
            print(f"  ❌ {msg}")
            issues.append(msg)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # 1. Page loads
        print("\n=== PAGE LOAD ===")
        resp = page.goto(URL, wait_until="networkidle", timeout=30000)
        check(resp and resp.ok, "Page loads with 200 OK")

        # 2. Title
        check("Kazi Emon" in page.title(), f"Title contains 'Kazi Emon': '{page.title()}'")

        # 3. Navigation links exist
        print("\n=== NAVIGATION ===")
        nav_items = page.locator(".nav-menu a")
        count = nav_items.count()
        check(count == 5, f"5 nav links found (got {count})")

        nav_texts = nav_items.all_inner_texts()
        expected = ["Home", "About", "Services", "Articles", "Contact"]
        for i, exp in enumerate(expected):
            check(exp in nav_texts[i], f"Nav link {i+1}: '{exp}'")

        # 4. Click "About" link (goes to about.html)
        about_link = page.locator('a[href="about.html"]').first
        check(about_link.is_visible(), "About link is visible")
        about_href = about_link.get_attribute("href")
        check(about_href == "about.html", f"About link href = 'about.html'")

        # 5. Click "Contact" link
        contact_link = page.locator('a[href="contact.html"]').first
        check(contact_link.is_visible(), "Contact link is visible")

        # 6. Service cards exist
        print("\n=== SERVICES ===")
        service_cards = page.locator(".service-card")
        check(service_cards.count() == 4, f"4 service cards (got {service_cards.count()})")

        # 7. Service modal - click "Learn More" on first service
        service_links = page.locator(".service-link[data-service]")
        check(service_links.count() == 4, "4 service 'Learn More' links")

        # Click first service link
        modal = page.locator("#serviceModal")
        check(not modal.is_visible(), "Modal hidden before click")
        service_links.first.scroll_into_view_if_needed()
        service_links.first.click(force=True)
        time.sleep(0.5)
        check(modal.is_visible(), "Modal opens on 'Learn More' click")

        # Check modal content
        modal_title = modal.locator(".modal-title")
        check(modal_title.is_visible(), "Modal title visible")
        check(len(modal_title.text_content()) > 0, "Modal title has text")

        # Close modal
        modal_close = modal.locator(".modal-close")
        modal_close.click()
        time.sleep(0.3)
        check(not modal.is_visible(), "Modal closes on X button")

        # 8. FAQ accordion
        print("\n=== FAQ ACCORDION ===")
        faq_items = page.locator(".faq-item")
        check(faq_items.count() == 6, f"6 FAQ items (got {faq_items.count()})")

        # Check first FAQ is closed initially
        first_faq = faq_items.first
        first_answer = first_faq.locator(".faq-answer")
        check(not first_answer.is_visible(), "FAQ answer hidden initially")

        # Click first FAQ question
        first_question = first_faq.locator(".faq-question")
        first_question.click()
        time.sleep(0.3)
        check(first_answer.is_visible(), "FAQ answer visible after click")

        # Click again to close
        first_question.click()
        time.sleep(0.3)
        check(not first_answer.is_visible(), "FAQ answer hides on second click")

        # 9. Back to top button
        print("\n=== BACK TO TOP ===")
        back_btn = page.locator("#backToTop")
        check(not back_btn.is_visible(), "Back-to-top hidden at top")

        page.evaluate("window.scrollTo(0, 500)")
        time.sleep(0.3)
        check(back_btn.is_visible(), "Back-to-top visible after scroll")

        back_btn.click()
        time.sleep(0.5)
        scroll_y = page.evaluate("window.scrollY")
        check(scroll_y < 50, f"Back-to-top scrolls to top (scrollY={scroll_y})")

        # 10. Scroll reveal
        print("\n=== SCROLL REVEAL ===")
        reveals = page.locator(".reveal.active")
        check(reveals.count() > 0, "Scroll reveal elements are active")

        # 11. Hamburger menu
        print("\n=== HAMBURGER MENU ===")
        page.set_viewport_size({"width": 768, "height": 900})
        page.goto(URL, wait_until="networkidle")
        time.sleep(0.5)

        hamburger = page.locator(".hamburger")
        check(hamburger.is_visible(), "Hamburger visible on mobile viewport")

        nav_menu = page.locator(".nav-menu")
        check(not nav_menu.is_visible(), "Nav menu hidden initially on mobile")

        hamburger.click()
        time.sleep(0.3)
        check(nav_menu.is_visible(), "Nav menu visible after hamburger click")

        # Close by clicking a nav link
        nav_links_mobile = nav_menu.locator("a")
        if nav_links_mobile.count() > 0:
            nav_links_mobile.first.click()
            time.sleep(0.3)
            check(not nav_menu.is_visible(), "Nav menu closes after link click")

        # 12. Social links
        print("\n=== SOCIAL LINKS ===")
        social_btns = page.locator(".social-btn")
        check(social_btns.count() == 4, f"4 footer social buttons (got {social_btns.count()})")

        contact_social = page.locator(".contact-social-btn")
        check(contact_social.count() == 4, f"4 contact social buttons (got {contact_social.count()})")

        # 13. Skip link
        print("\n=== ACCESSIBILITY ===")
        skip_link = page.locator(".skip-link")
        check(skip_link.is_visible(), "Skip link is visible")

        # 14. FAQ keyboard accessibility
        faq_btn = page.locator(".faq-question").first
        faq_btn.focus()
        page.keyboard.press("Enter")
        time.sleep(0.3)
        check(first_answer.is_visible(), "FAQ opens via keyboard Enter")

        # 15. Service modal keyboard close (Escape)
        print("\n=== MODAL KEYBOARD ===")
        service_links.first.scroll_into_view_if_needed()
        service_links.first.click(force=True)
        time.sleep(0.3)
        check(modal.is_visible(), "Modal open for Escape test")
        page.keyboard.press("Escape")
        time.sleep(0.3)
        check(not modal.is_visible(), "Modal closes via Escape key")

        # 16. Check images load
        print("\n=== IMAGES ===")
        images = page.locator("img")
        for i in range(images.count()):
            img = images.nth(i)
            src = img.get_attribute("src")
            natural = img.evaluate("el => el.complete && el.naturalWidth > 0")
            check(natural, f"Image loads: {src}")

        # 17. Check external links open in new tab
        print("\n=== EXTERNAL LINKS ===")
        external_links = page.locator('a[target="_blank"]')
        check(external_links.count() >= 6, f"External links with target=_blank: {external_links.count()}")

        # 18. Check CSS loads
        print("\n=== RESOURCES ===")
        css_loaded = page.evaluate("""() => {
            for (let sheet of document.styleSheets) {
                try { return sheet.cssRules.length > 0; } catch(e) { return false; }
            }
            return false;
        }""")
        check(css_loaded, "CSS stylesheets loaded")

        # 19. Font Awesome loaded
        fa_icons = page.locator(".fa-solid, .fa-brands")
        check(fa_icons.count() > 10, f"Font Awesome icons present ({fa_icons.count()})")

        # 20. Check for console errors
        print("\n=== CONSOLE ERRORS ===")
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.goto(URL, wait_until="networkidle")
        time.sleep(1)
        if console_errors:
            for err in console_errors[:5]:
                print(f"  ❌ Console error: {err[:120]}")
            issues.append(f"Console errors: {len(console_errors)} found")
        else:
            check(True, "No console errors")

        # 21. Check internal links exist (don't navigate - just check hrefs)
        print("\n=== INTERNAL LINKS ===")
        internal_hrefs = page.evaluate("""() => {
            const links = document.querySelectorAll('a[href]');
            const hrefs = [];
            links.forEach(a => {
                const h = a.getAttribute('href');
                if (h && !h.startsWith('#') && !h.startsWith('http') && !h.startsWith('tel') && !h.startsWith('mailto')) {
                    hrefs.push(h);
                }
            });
            return hrefs;
        }""")
        check(len(internal_hrefs) > 0, f"Internal links found: {len(internal_hrefs)}")
        for h in internal_hrefs:
            check(h.endswith('.html') or h.endswith('/'), f"Internal link has valid extension: {h}")

        # 22. Check page has valid schema.org JSON-LD
        print("\n=== STRUCTURED DATA ===")
        jsonld = page.locator('script[type="application/ld+json"]')
        check(jsonld.count() >= 2, f"Schema.org JSON-LD present ({jsonld.count()} blocks)")

        browser.close()

    print(f"\n{'='*50}")
    print(f"RESULTS: {passed} passed, {failed} failed")
    if issues:
        print(f"\nBUGS FOUND ({len(issues)}):")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. {issue}")
    else:
        print("\nNo bugs found — all functions working correctly!")
    print(f"{'='*50}")

test_all()
