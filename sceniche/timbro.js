/* timbro — il marchio si imprime sulla pagina quando entra nello schermo.
   Sotto movimento ridotto resta semplicemente al suo posto, nitido. */
(function () {
if (!window.FM) return;
FM.scenica('timbro', function (el, o) {
  var n = FM.num, durata = n(o.durata, 620);
  el.classList.add('fmx-timbro');
  el.style.setProperty('--fmx-durata', durata + 'ms');
  if (o.giro) el.style.setProperty('--fmx-giro', n(o.giro, -8) + 'deg');
  if (FM.ridotto()) return { ferma: pulisci };

  var alone = null;
  function batti() {
    el.classList.remove('fmx-batti'); void el.offsetWidth; el.classList.add('fmx-batti');
    var padre = el.offsetParent || el.parentNode;
    if (padre && padre.appendChild) {
      if (getComputedStyle(padre).position === 'static') padre.classList.add('fm-palco');
      alone = document.createElement('div');
      alone.className = 'fmx-timbro-alone'; alone.setAttribute('aria-hidden', 'true');
      var w = el.offsetWidth, h = el.offsetHeight, d = Math.max(w, h);
      alone.style.cssText = 'left:' + (el.offsetLeft + w / 2 - d / 2) + 'px;top:' +
        (el.offsetTop + h / 2 - d / 2) + 'px;width:' + d + 'px;height:' + d + 'px';
      padre.appendChild(alone);
      setTimeout(function () {
        /* Lo stato di PARTENZA si fissa prima di accendere la transizione: se si
           scrive .5 e subito dopo 0, il browser vede solo il valore finale e la
           transizione si accorcia a niente — l'alone non si vedeva mai. E niente
           requestAnimationFrame: a scheda nascosta quel frame non arriva. */
        alone.style.opacity = '.5';
        void alone.offsetWidth;
        alone.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1), opacity .7s linear';
        alone.style.transform = 'scale(2.4)';
        alone.style.opacity = '0';
        setTimeout(function () { if (alone && alone.parentNode) alone.parentNode.removeChild(alone); }, 800);
      }, durata * .5);
    }
  }
  var io = new IntersectionObserver(function (v) { if (v[0].isIntersecting) { io.disconnect(); batti(); } });
  io.observe(el);
  function pulisci() {
    if (io) io.disconnect();
    el.classList.remove('fmx-timbro', 'fmx-batti');
    if (alone && alone.parentNode) alone.parentNode.removeChild(alone);
  }
  return { ferma: pulisci, batti: batti };
});
})();
