/* FM Caterers — homepage hero A/B test (client-side, localStorage based).
 *
 * Variant A (control): current hero copy.
 * Variant B (test):    keyword-forward copy targeting "caterers in lucknow" intent.
 *
 * Each visitor is assigned a variant on first view and stays on it (50/50),
 * so the result is a genuine split. Clicks on the hero CTAs are counted per
 * variant. To read results, open dev console and run: fmABReport()
 *
 * For long-term measurement, this assigns data-ab-variant on <html> — send it
 * to GA4 as a custom dimension and let analytics do the statistics.
 */
(function () {
  var KEY = 'fm_ab_variant';
  var COUNTS = 'fm_ab_clicks';
  var VIEWS = 'fm_ab_views';

  var variants = {
    A: {
      eyebrow: 'Lucknow · Since 1994',
      title: 'Where Flavour Has a Legacy',
      sub: 'Not just catering. An experience your guests remember.'
    },
    B: {
      eyebrow: 'Rated 5.0 on Google',
      title: 'The Caterer Lucknow Trusts Since 1994',
      sub: 'Mughlai, live counters, qawwali & mehendi — one team, one standard.'
    }
  };

  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function assign() {
    var v = read(KEY);
    if (!v || !variants[v]) {
      v = (Math.random() < 0.5) ? 'A' : 'B';
      write(KEY, v);
    }
    return v;
  }

  function applyText(v) {
    var conf = variants[v];
    var ey = document.getElementById('heroEyebrow');
    var ti = document.getElementById('heroTitle');
    var su = document.getElementById('heroSub');
    if (ey) ey.textContent = conf.eyebrow;
    if (ti) ti.textContent = conf.title;
    if (su) su.textContent = conf.sub;
  }

  function trackView(v) {
    var views = read(VIEWS) || {};
    views[v] = (views[v] || 0) + 1;
    write(VIEWS, views);
  }

  function trackClick(v) {
    var clicks = read(COUNTS) || {};
    clicks[v] = (clicks[v] || 0) + 1;
    write(COUNTS, clicks);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var variant = assign();
    document.documentElement.setAttribute('data-ab-variant', variant);
    applyText(variant);
    trackView(variant);

    var actions = document.querySelector('.hero-actions');
    if (actions) {
      actions.addEventListener('click', function (e) {
        var link = e.target.closest('a[href]');
        if (link) trackClick(variant);
      });
    }
  });

  window.fmABReport = function () {
    var v = read(KEY) || 'none';
    var views = read(VIEWS) || {};
    var clicks = read(COUNTS) || {};
    var rate = function (x) {
      var vv = views[x] || 0;
      return vv ? Math.round(((clicks[x] || 0) / vv) * 1000) / 10 + '%' : '—';
    };
    console.table([
      { variant: 'A (control)', views: views.A || 0, cta_clicks: clicks.A || 0, ctr: rate('A') },
      { variant: 'B (test)', views: views.B || 0, cta_clicks: clicks.B || 0, ctr: rate('B') }
    ]);
    console.log('Your assigned variant on this device:', v);
    console.log('This device only. For population-level stats, send data-ab-variant to GA4.');
  };
})();