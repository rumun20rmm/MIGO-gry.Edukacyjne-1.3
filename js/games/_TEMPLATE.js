// ==========================================================
// SZABLON MODUŁU GRY (nie dołączać w index.html - tylko wzór)
//
// Aby dodać nową grę:
// 1. Skopiuj ten plik jako js/games/nazwa-gry.js
// 2. Zmień id/nazwę/ikonę/opis/dane
// 3. Zbuduj markup ekranu gry w index.html (sekcja "EKRANY GIER"),
//    kontener musi mieć id="kontener-<id>", wrapper id="ekran-<id>"
// 4. Dodaj <script src="js/games/nazwa-gry.js"></script> w index.html
// Router (js/app.js) i menu wykryją grę automatycznie.
// ==========================================================

window.GRY_MODULES = window.GRY_MODULES || {};

window.GRY_MODULES.nazwaId = {
    id: "nazwaId",           // musi być zgodne z id kontenera/wrappera w HTML
    nazwa: "Tytuł gry",
    ikona: "🎮",
    opis: "Krótki opis widoczny na karcie w menu",

    // dane gry - trzymane lokalnie w module, nie w app.js
    dane: [
        // { ... }
    ],

    // wywoływane RAZ, przy pierwszym uruchomieniu gry
    init(kontener) {
        // zbuduj/podłącz UI wewnątrz `kontener`
        // (elementy statyczne mogą już być w index.html - patrz kontener-<id>)
    },

    // opcjonalne: wywoływane przy KAŻDYM powrocie do gry (po pierwszym init)
    // wznow() { }
};
