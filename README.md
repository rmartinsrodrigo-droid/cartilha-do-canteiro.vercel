# Cartilha do Canteiro · a|w

Versão web da Cartilha do Canteiro, as práticas sustentáveis na obra em 19 temas, para
compartilhar com colaboradores e fornecedores da Athié Wohnrath.

- Site: https://cartilha-do-canteiro.vercel.app
- Guia completo: https://portal-canteiro-sustentavel.vercel.app
- Impresso: `cartilha-do-canteiro.pdf` (A5, 28 páginas). O arquivo fechado para gráfica,
  com sangria e marcas de corte, não vive aqui.

## O que tem

Página única, mobile primeiro, com índice e busca no mesmo painel, foto por tema, blocos
faça assim e nunca, nota por capítulo, botão de WhatsApp e download do PDF. Funciona
offline por service worker (`sw.js`) e instala como app pelo `manifest.webmanifest`.

Design system do site a|w: `assets/css/tokens.css`, `bundle.css`, `v2.css` e `site.css`
carregados nessa ordem, mais `cartilha.css`, que é a única camada própria desta página.
Títulos em caixa baixa, texto preto sobre Tiffany, Montserrat.

## Como atualizar

O `index.html` é **gerado**, não se edita à mão. O conteúdo sai do modelo da cartilha
impressa (o mesmo que gera o IDML e o PDF), pelo pipeline em Python descrito no
`leia-me` da cartilha impressa. Mudança de texto se faz na cartilha e roda o build.

Ao mudar qualquer arquivo, suba a versão do cache em `sw.js` (`var VERSAO`), senão o
celular de quem já abriu continua servindo a versão antiga.

Deploy: push na `main` e a Vercel publica.
