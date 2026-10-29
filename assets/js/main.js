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


  var bf = document.getElementById('bewerbung-form');
  if (bf) {
    var bm = {
      vorname: 'Bitte geben Sie Ihren Vornamen an.',
      nachname: 'Bitte geben Sie Ihren Nachnamen an.',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
      telefon: 'Bitte geben Sie Ihre Telefonnummer an.',
      datenschutz: 'Bitte stimmen Sie der Datenschutzerklärung zu.'
    };
    var stelle = document.getElementById('b-stelle');
    document.querySelectorAll('[data-stelle]').forEach(function (l) {
      l.addEventListener('click', function () { if (stelle) stelle.value = l.getAttribute('data-stelle'); setTimeout(function () { document.getElementById('b-vorname').focus({ preventScroll: true }); }, 400); });
    });
    var cv = document.getElementById('b-cv');
    var cvText = bf.querySelector('.upload-text');
    function cvCheck() {
      var err = cv.closest('.field').querySelector('.error');
      var f = cv.files && cv.files[0];
      var msg = '';
      if (f) {
        if (!/\.(pdf|docx?)$/i.test(f.name)) msg = 'Bitte laden Sie eine PDF- oder Word-Datei hoch.';
        else if (f.size > 10 * 1024 * 1024) msg = 'Die Datei ist zu groß (maximal 10 MB).';
      }
      err.textContent = msg;
      cv.closest('.field').classList.toggle('invalid', !!msg);
      return !msg;
    }
    cv.addEventListener('change', function () {
      cvText.textContent = cv.files && cv.files[0] ? cv.files[0].name : 'Datei auswählen';
      cvCheck();
    });
    function bcheck(el) {
      var field = el.closest('.field');
      var ok = el.checkValidity();
      field.classList.toggle('invalid', !ok);
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      field.querySelector('.error').textContent = ok ? '' : (bm[el.name] || '');
      return ok;
    }
    bf.querySelectorAll('[required]').forEach(function (el) {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', function () { if (el.value || el.type === 'checkbox') bcheck(el); });
    });
    bf.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      bf.querySelectorAll('[required]').forEach(function (el) { if (!bcheck(el) && !first) first = el; });
      if (!cvCheck() && !first) first = cv;
      if (first) { first.focus(); return; }
      var st = bf.querySelector('.form-status');
      st.hidden = false;
      st.textContent = 'Vorschau: Im fertigen Formular wird Ihre Bewerbung an dieser Stelle direkt versendet.';
    });
  }

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
