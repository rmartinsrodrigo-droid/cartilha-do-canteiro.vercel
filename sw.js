/* Cartilha do Canteiro · service worker
   Casca em cache na instalação; fotos, PDF e fonte entram no cache conforme são usados.
   Trocar a versão sempre que o conteúdo mudar, para o celular do pessoal baixar o novo. */
var VERSAO = "cartilha-v1";
var CASCA = [
  "./",
  "./index.html",
  "./assets/css/tokens.css",
  "./assets/css/bundle.css",
  "./assets/css/v2.css",
  "./assets/css/site.css",
  "./assets/css/cartilha.css",
  "./assets/js/cartilha.js",
  "./assets/img/logo-positivo.png",
  "./assets/img/logo-negativo.png",
  "./assets/img/icone-192.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (ev) {
  ev.waitUntil(
    caches.open(VERSAO).then(function (c) { return c.addAll(CASCA); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.filter(function (n) { return n !== VERSAO; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (ev) {
  var req = ev.request;
  if (req.method !== "GET") { return; }

  /* página: rede primeiro, para pegar atualização; cache se estiver sem sinal */
  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") > -1) {
    ev.respondWith(
      fetch(req).then(function (r) {
        var copia = r.clone();
        caches.open(VERSAO).then(function (c) { c.put("./index.html", copia); });
        return r;
      }).catch(function () {
        return caches.match("./index.html");
      })
    );
    return;
  }

  /* resto (css, js, fotos, pdf, fonte): cache primeiro, guarda o que baixar */
  ev.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) { return hit; }
      return fetch(req).then(function (r) {
        if (r && (r.status === 200 || r.type === "opaque")) {
          var copia = r.clone();
          caches.open(VERSAO).then(function (c) { c.put(req, copia); });
        }
        return r;
      });
    })
  );
});
