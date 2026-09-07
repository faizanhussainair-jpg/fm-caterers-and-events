/* FM Caterers & Events — site scripts */
document.addEventListener('DOMContentLoaded', function () {
  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('navList');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      list.classList.toggle('open');
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Lead form — POST to Google Apps Script, which logs to the Excel tracker
     and emails faizanhussain.air@gmail.com + fmcateringsolutions@gmail.com */
  var CONFIG = {
    ENDPOINT: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    FALLBACK_EMAIL: 'fmcateringsolutions@gmail.com'
  };

  var form = document.getElementById('leadForm');
  var success = document.getElementById('formSuccess');
  var error = document.getElementById('formError');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function show(el) { if (el) { el.style.display = 'block'; } }
  function hide(el) { if (el) { el.style.display = 'none'; } }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      hide(error);
      hide(success);

      var payload = {
        name: document.getElementById('leadName').value.trim(),
        phone: document.getElementById('leadPhone').value.trim(),
        guests: document.getElementById('leadGuests').value,
        eventType: document.getElementById('leadEventType') ?
          document.getElementById('leadEventType').value : '',
        note: document.getElementById('leadNote').value.trim()
      };

      var send = fetch(CONFIG.ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      /* Apps Script web apps return an opaque response under no-cors, so we
         assume success. If the endpoint isn't configured yet, fall back to
         opening an email draft to the FM address. */
      var fallback = function () {
        var subject = encodeURIComponent('Event Enquiry — ' + payload.name);
        var body = encodeURIComponent(
          'Name: ' + payload.name + '\n' +
          'Phone: ' + payload.phone + '\n' +
          'Approx. Guests: ' + payload.guests + '\n' +
          'Event Type: ' + payload.eventType + '\n' +
          'Event Details: ' + payload.note
        );
        window.location.href = 'mailto:' + CONFIG.FALLBACK_EMAIL +
          '?subject=' + subject + '&body=' + body;
      };

      var notConfigured = CONFIG.ENDPOINT.indexOf('YOUR_DEPLOYMENT_ID') !== -1;
      if (notConfigured) {
        fallback();
        show(success);
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Enquiry'; }
        return;
      }

      send
        .then(function () {
          show(success);
          form.reset();
        })
        .catch(function () {
          fallback();
          show(success);
          form.reset();
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Enquiry'; }
        });
    });
  }
});

/* Set active nav link based on current page */
document.addEventListener('DOMContentLoaded', function () {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-list a');
  links.forEach(function (a) {
    var href = a.getAttribute('href').split('/').pop();
    if (href === path) { a.classList.add('active'); }
  });
});
