(function () {
  document.documentElement.classList.add('js');

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hauptnavigation');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  var y = document.getElementById('jahr');
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById('anfrage-form');
  if (!form) return;
  var messages = {
    name: 'Bitte geben Sie Ihren Namen an.',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
    leistung: 'Bitte wählen Sie eine Leistung.',
    ort: 'Bitte nennen Sie den Ort des Objekts.',
    nachricht: 'Bitte beschreiben Sie kurz Ihr Anliegen.'
  };
  function check(el) {
    var field = el.closest('.field');
    var err = field.querySelector('.error');
    var ok = el.checkValidity();
    field.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.textContent = ok ? '' : (messages[el.name] || '');
    return ok;
  }
  form.querySelectorAll('[required]').forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value) check(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('invalid')) check(el); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    form.querySelectorAll('[required]').forEach(function (el) { if (!check(el) && !first) first = el; });
    if (first) { first.focus(); return; }
    var d = new FormData(form);
    var body = ['Name: ' + d.get('name'), 'Firma: ' + (d.get('firma') || '-'), 'E-Mail: ' + d.get('email'), 'Telefon: ' + (d.get('telefon') || '-'), 'Leistung: ' + d.get('leistung'), 'Ort des Objekts: ' + d.get('ort'), '', d.get('nachricht')].join('\n');
    window.location.href = 'mailto:info@bunnenberg-gmbh.de?subject=' + encodeURIComponent('Anfrage: ' + d.get('leistung')) + '&body=' + encodeURIComponent(body);
    var status = form.querySelector('.form-status');
    status.hidden = false;
    status.textContent = 'Ihr E-Mail-Programm öffnet sich mit Ihrer Anfrage. Bitte senden Sie die E-Mail dort ab.';
  });
})();
