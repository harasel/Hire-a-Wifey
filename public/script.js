/* ==========================================================================
   HIRE A WIFEY — HERVEY BAY
   script.js  |  Vanilla JavaScript only (no frameworks / no dependencies)
   --------------------------------------------------------------------------
   01. Site configuration (single place to change Booking / Recruitment URLs)
   02. Helpers
   03. Sticky header state
   04. Mobile navigation drawer
   05. Smooth anchor scrolling + scroll-spy
   06. FAQ accordion (accessible)
   07. Enquiry form validation + success message
   08. Sticky mobile "BOOK A WIFEY" CTA
   09. Scroll reveal animations (respects prefers-reduced-motion)
   10. Misc (footer year)
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     01. SITE CONFIGURATION
     ------------------------------------------------------------------------
     Change these two values once and every CTA on the page updates.
     In WordPress/Elementor these become the button link fields.
     ===================================================================== */
  var SITE_CONFIG = {
    BOOKING_URL: 'booking.html',        // <- future Booking Page
    RECRUITMENT_URL: 'recruitment.html' // <- future Recruitment Page
  };

  /* ========================================================================
     02. HELPERS
     ===================================================================== */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function headerOffset() {
    var header = $('.site-header');
    return header ? header.offsetHeight + 10 : 80;
  }

  /* Apply configured destinations to every CTA */
  function applyCtaDestinations() {
    $$('[data-cta="booking"]').forEach(function (el) {
      el.setAttribute('href', SITE_CONFIG.BOOKING_URL);
    });
    $$('[data-cta="recruitment"]').forEach(function (el) {
      el.setAttribute('href', SITE_CONFIG.RECRUITMENT_URL);
    });
  }

  /* ========================================================================
     03. STICKY HEADER STATE
     ===================================================================== */
  function initStickyHeader() {
    var header = $('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================================
     04. MOBILE NAVIGATION DRAWER
     ===================================================================== */
  function initMobileNav() {
    var toggle = $('.nav-toggle');
    var nav = $('#main-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    /* Close when a nav link or nav CTA is used */
    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Reset when resizing up to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setOpen(false);
    });
  }

  /* ========================================================================
     05. SMOOTH ANCHOR SCROLLING + SCROLL-SPY
     ===================================================================== */
  function initAnchorScrolling() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;

      var target = document.getElementById(id.slice(1));
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      /* Move keyboard focus to the target for accessibility */
      window.setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, prefersReducedMotion ? 0 : 500);

      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  function initScrollSpy() {
    var links = $$('.nav-list a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) { map[id] = link; sections.push(section); }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          var active = map[entry.target.id];
          if (active) active.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ========================================================================
     06. FAQ ACCORDION (accessible, one-at-a-time optional)
     ===================================================================== */
  function initFaq() {
    var items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var button = $('.faq-question', item);
      var panel = $('.faq-answer', item);
      if (!button || !panel) return;

      panel.style.height = '0px';

      function close(el, btn, pnl) {
        el.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        pnl.style.height = pnl.scrollHeight + 'px';
        /* force reflow so the transition runs */
        void pnl.offsetHeight;
        pnl.style.height = '0px';
      }

      function open(el, btn, pnl) {
        el.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        pnl.style.height = pnl.scrollHeight + 'px';
        window.setTimeout(function () {
          if (el.classList.contains('is-open')) pnl.style.height = 'auto';
        }, 300);
      }

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        /* Close siblings for a cleaner mobile experience */
        items.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            close(other, $('.faq-question', other), $('.faq-answer', other));
          }
        });

        if (isOpen) { close(item, button, panel); }
        else { open(item, button, panel); }
      });
    });

    /* Keep an open panel correctly sized on resize */
    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        $$('.faq-item.is-open .faq-answer').forEach(function (p) { p.style.height = 'auto'; });
      }, 150);
    });
  }

  /* ========================================================================
     07. ENQUIRY FORM — validation + simulated submission
     ------------------------------------------------------------------------
     NOTE: This is a front-end prototype only. No data is sent anywhere.
     In WordPress this block is replaced by the Elementor Form widget.
     ===================================================================== */
  function initEnquiryForm() {
    var form = $('#enquiry-form');
    if (!form) return;

    var success = $('#enquiry-success');

    var rules = {
      'enq-name':   { test: function (v) { return v.trim().length >= 2; },
                      msg: 'Please enter your name.' },
      'enq-mobile': { test: function (v) { return v.replace(/[^0-9]/g, '').length >= 8; },
                      msg: 'Please enter a valid contact number.' },
      'enq-email':  { optional: true,
                      test: function (v) { return v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
                      msg: 'Please enter a valid email address.' },
      'enq-suburb': { test: function (v) { return v.trim().length >= 2; },
                      msg: 'Please tell us your suburb.' },
      'enq-message':{ test: function (v) { return v.trim().length >= 5; },
                      msg: 'Please tell us a little about what you need.' }
    };

    function validateField(id) {
      var field = document.getElementById(id);
      var rule = rules[id];
      if (!field || !rule) return true;
      var errorEl = document.getElementById(id + '-error');
      var valid = rule.test(field.value);

      field.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (errorEl) {
        errorEl.textContent = valid ? '' : rule.msg;
        errorEl.classList.toggle('is-visible', !valid);
      }
      return valid;
    }

    Object.keys(rules).forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('blur', function () { validateField(id); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(id);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      Object.keys(rules).forEach(function (id) {
        var ok = validateField(id);
        if (!ok && !firstInvalid) firstInvalid = document.getElementById(id);
      });

      if (firstInvalid) {
        firstInvalid.focus();
        window.scrollTo({
          top: firstInvalid.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 20,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        return;
      }

      /* Simulated submission — replace with the Elementor Form widget */
      var submitBtn = $('.js-submit', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }

      window.setTimeout(function () {
        form.hidden = true;
        if (success) {
          success.classList.add('is-visible');
          success.setAttribute('tabindex', '-1');
          success.focus({ preventScroll: true });
          window.scrollTo({
            top: success.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 20,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      }, 600);
    });

    /* "Send another enquiry" */
    var reset = $('#enquiry-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        form.hidden = false;
        if (success) success.classList.remove('is-visible');
        var submitBtn = $('.js-submit', form);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send My Enquiry <span class="btn-arrow" aria-hidden="true">&rarr;</span>';
        }
        $$('[aria-invalid]', form).forEach(function (f) { f.setAttribute('aria-invalid', 'false'); });
        $$('.field-error', form).forEach(function (f) { f.classList.remove('is-visible'); });
        form.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      });
    }

    /* Pre-select the enquiry topic when NDIS / DVA buttons are used */
    $$('[data-enquiry-topic]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var topic = btn.getAttribute('data-enquiry-topic');
        var select = $('#enq-topic');
        if (select) {
          for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].value === topic) { select.selectedIndex = i; break; }
          }
        }
      });
    });
  }

  /* ========================================================================
     08. STICKY MOBILE CTA
     ------------------------------------------------------------------------
     Appears after the hero, hides over the enquiry form and footer so it
     never covers important content or duplicate CTAs.
     ===================================================================== */
  function initStickyCta() {
    var bar = $('.sticky-cta');
    if (!bar) return;

    var hero = $('.hero');
    var enquiry = $('#enquiry');
    var footer = $('.footer');
    var finalCta = $('#final-cta');

    function update() {
      if (window.innerWidth >= 768) { bar.classList.remove('is-visible'); return; }

      var pastHero = hero ? (window.scrollY > hero.offsetHeight * 0.65) : window.scrollY > 400;
      var blocked = [enquiry, footer, finalCta].some(function (el) {
        if (!el) return false;
        var r = el.getBoundingClientRect();
        return r.top < window.innerHeight - 60 && r.bottom > 0;
      });

      bar.classList.toggle('is-visible', pastHero && !blocked);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ========================================================================
     09. SCROLL REVEAL
     ===================================================================== */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ========================================================================
     10. MISC
     ===================================================================== */
  function initYear() {
    var y = $('#current-year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ========================================================================
     INIT
     ===================================================================== */
  function init() {
    applyCtaDestinations();
    initStickyHeader();
    initMobileNav();
    initAnchorScrolling();
    initScrollSpy();
    initFaq();
    initEnquiryForm();
    initStickyCta();
    initReveal();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
