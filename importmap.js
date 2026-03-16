(map => {
  const mapUrl = document.currentScript.src;
  const resolve = imports => Object.fromEntries(Object.entries(imports ).map(([k, v]) => [k, new URL(v, mapUrl).href]));
  document.head.appendChild(Object.assign(document.createElement("script"), {
    type: "importmap",
    innerHTML: JSON.stringify({
      imports: resolve(map.imports),
      scopes: Object.fromEntries(Object.entries(map.scopes).map(([k, v]) => [new URL(k, mapUrl).href, resolve(v)]))
    })
  }));
})
({
  "imports": {
    "bookmarks": "./src/presentation/app.js"
  },
  "scopes": {
    "./": {
      "@lit-labs/router": "https://ga.jspm.io/npm:@lit-labs/router@0.1.4/development/index.js",
      "@material/web/": "https://ga.jspm.io/npm:@material/web@2.4.1/",
      "lit": "https://ga.jspm.io/npm:lit@3.3.2/index.js"
    },
    "https://ga.jspm.io/npm:@material/web@2.4.1/": {
      "lit": "https://ga.jspm.io/npm:lit@3.3.2/index.js",
      "lit/": "https://ga.jspm.io/npm:lit@3.3.2/",
      "tslib": "https://ga.jspm.io/npm:tslib@2.8.1/tslib.es6.mjs"
    },
    "https://ga.jspm.io/npm:lit-element@4.2.2/": {
      "@lit/reactive-element": "https://ga.jspm.io/npm:@lit/reactive-element@2.1.2/development/reactive-element.js",
      "lit-html": "https://ga.jspm.io/npm:lit-html@3.3.2/development/lit-html.js"
    },
    "https://ga.jspm.io/npm:lit@3.3.2/": {
      "@lit/reactive-element": "https://ga.jspm.io/npm:@lit/reactive-element@2.1.2/development/reactive-element.js",
      "@lit/reactive-element/decorators/": "https://ga.jspm.io/npm:@lit/reactive-element@2.1.2/development/decorators/",
      "lit-element/lit-element.js": "https://ga.jspm.io/npm:lit-element@4.2.2/development/lit-element.js",
      "lit-html": "https://ga.jspm.io/npm:lit-html@3.3.2/development/lit-html.js",
      "lit-html/": "https://ga.jspm.io/npm:lit-html@3.3.2/development/"
    }
  }
});
