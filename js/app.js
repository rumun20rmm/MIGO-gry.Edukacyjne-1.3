// ==========================================================
// GRY EDUKACYJNE - router / menu
// Każdy moduł gry rejestruje się w window.GRY_MODULES.<id> = {...}
// (patrz js/games/_TEMPLATE.js po pełny opis wymaganego kształtu)
// Dodanie nowej gry NIE wymaga zmian w tym pliku.
// ==========================================================

(function () {
    function getModules() {
        return Object.values(window.GRY_MODULES || {});
    }

    function renderMenu() {
        const lista = document.getElementById("menuLista");
        lista.innerHTML = "";

        getModules().forEach((modul) => {
            const karta = document.createElement("button");
            karta.className = `karta-gry kolor-${modul.id}`;
            karta.innerHTML = `
                <span class="ikona-gry">${modul.ikona}</span>
                <span class="tresc-gry">
                    <span class="tytul-gry">${modul.nazwa}</span>
                    <span class="opis-gry">${modul.opis}</span>
                </span>
            `;
            karta.onclick = () => uruchomGre(modul.id);
            lista.appendChild(karta);
        });
    }

    function uruchomGre(id) {
        const modul = window.GRY_MODULES[id];
        if (!modul) return;

        document.getElementById("menuScreen").classList.add("ukryty");

        document.querySelectorAll(".ekran-gry-wrapper").forEach((el) => {
            el.classList.remove("aktywny");
        });

        const wrapper = document.getElementById(`ekran-${id}`);
        wrapper.classList.add("aktywny");

        // Inicjalizacja gry tylko raz (przy pierwszym uruchomieniu)
        if (!modul._zainicjalizowana) {
            modul.init(document.getElementById(`kontener-${id}`));
            modul._zainicjalizowana = true;
        } else if (typeof modul.wznow === "function") {
            // opcjonalny hak: gra może odświeżyć stan przy powrocie
            modul.wznow();
        }
    }

    function otworzEdytor() {
        document.getElementById("menuScreen").classList.add("ukryty");

        document.querySelectorAll(".ekran-gry-wrapper").forEach((el) => {
            el.classList.remove("aktywny");
        });

        document.getElementById("ekran-edytor").classList.add("aktywny");

        const edytor = window.GRY_EDITOR;
        if (!edytor) return;

        if (!edytor._zainicjalizowany) {
            edytor.init(document.getElementById("kontener-edytor"));
            edytor._zainicjalizowany = true;
        } else if (typeof edytor.wznow === "function") {
            edytor.wznow();
        }
    }

    function wrocDoMenu() {
        document.querySelectorAll(".ekran-gry-wrapper").forEach((el) => {
            el.classList.remove("aktywny");
        });
        document.getElementById("menuScreen").classList.remove("ukryty");
    }

    // Przy starcie: nadpisz wbudowane dane edytowalnych gier zapisanymi
    // wcześniej zmianami z localStorage (jeśli użytkownik coś edytował).
    function wczytajZapisaneDane() {
        Object.values(window.GRY_MODULES || {}).forEach((modul) => {
            if (!modul.edytowalna) return;
            const zapisane = window.GRY_STORAGE.load(modul.id);
            if (zapisane) modul.dane = zapisane;
        });
    }

    // ---------- Motyw jasny/ciemny ----------
    // Atrybut data-motyw na <html> jest już ustawiony przez skrypt w <head>
    // (przed pierwszym renderem, żeby uniknąć mignięcia złego motywu) -
    // tutaj tylko dopasowujemy ikonę przełącznika i obsługujemy klik.
    function ikonaDlaMotywu(motyw) {
        return motyw === "jasny" ? "☀️" : "🌙";
    }

    function odswiezIkonePrzelacznika() {
        const przycisk = document.getElementById("motywPrzelacznik");
        if (!przycisk) return;
        const aktualny = document.documentElement.getAttribute("data-motyw") || "ciemny";
        przycisk.textContent = ikonaDlaMotywu(aktualny);
    }

    function przelaczMotyw() {
        const aktualny = document.documentElement.getAttribute("data-motyw") || "ciemny";
        const nowy = aktualny === "jasny" ? "ciemny" : "jasny";
        document.documentElement.setAttribute("data-motyw", nowy);
        window.GRY_STORAGE.save("motyw", nowy);
        odswiezIkonePrzelacznika();
    }

    window.GRY_APP = { wrocDoMenu, uruchomGre, otworzEdytor, przelaczMotyw };

    window.addEventListener("DOMContentLoaded", () => {
        wczytajZapisaneDane();
        renderMenu();
        odswiezIkonePrzelacznika();
    });
})();
