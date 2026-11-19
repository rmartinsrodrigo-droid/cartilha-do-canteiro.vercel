/* Cartilha do Canteiro · índice, busca, voltar ao topo e funcionamento offline */
(function () {
  "use strict";

  var btn = document.getElementById("btn-indice");
  var painel = document.getElementById("painel");
  var busca = document.getElementById("busca");
  var res = document.getElementById("busca-res");
  var lista = document.getElementById("indice-lista");
  var caps = document.getElementById("caps");
  var topo = document.getElementById("btn-topo");

  /* ---------------------------------------------------------- painel */
  function abre(v) {
    painel.hidden = !v;
    btn.setAttribute("aria-expanded", v ? "true" : "false");
    btn.setAttribute("aria-label", v ? "Fechar índice e busca" : "Abrir índice e busca");
    if (v) { busca.focus(); }
  }
  btn.addEventListener("click", function () { abre(painel.hidden); });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !painel.hidden) { abre(false); btn.focus(); }
  });
  painel.addEventListener("click", function (ev) {
    if (ev.target.closest("a")) { abre(false); }
  });

  /* ---------------------------------------------------------- busca */
  var artigos = Array.prototype.slice.call(caps.querySelectorAll(".c-cap"));
  var linhas = Array.prototype.slice.call(document.querySelectorAll(".c-idx__a"));
  var vazio = document.createElement("p");
  vazio.className = "c-vazio";
  vazio.setAttribute("role", "status");
  vazio.hidden = true;
  caps.appendChild(vazio);

  function semAcento(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function filtra() {
    var q = semAcento(busca.value.trim().toLowerCase());
    var n = 0;
    artigos.forEach(function (a) {
      var bate = !q || semAcento(a.dataset.busca).indexOf(q) > -1;
      a.dataset.oculto = bate ? "0" : "1";
      if (bate) { n++; }
    });
    linhas.forEach(function (l) {
      var bate = !q || semAcento(l.dataset.busca).indexOf(q) > -1;
      l.parentNode.dataset.oculto = bate ? "0" : "1";
    });
    if (!q) {
      res.textContent = artigos.length + " temas";
    } else if (n === 0) {
      res.textContent = "Nada encontrado para “" + busca.value.trim() + "”";
    } else {
      res.textContent = n === 1 ? "1 tema" : n + " temas";
    }
    vazio.hidden = n !== 0 || !q;
    vazio.textContent = "Nenhum tema fala de “" + busca.value.trim() + "”. Apague a busca para ver a cartilha inteira.";
  }
  busca.addEventListener("input", filtra);
  busca.addEventListener("search", filtra);

  /* ---------------------------------------------------------- voltar ao topo */
  var ultimo = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY || 0;
    if ((y > 900) !== (ultimo > 900)) { topo.hidden = y <= 900; }
    ultimo = y;
  }, { passive: true });
  topo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------- offline */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* sem offline, segue online */ });
    });
  }
}());
