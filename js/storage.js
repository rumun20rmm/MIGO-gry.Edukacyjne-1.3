// ==========================================================
// Zapis edytowanych baz danych do localStorage przeglądarki.
// Działa niezależnie dla każdej edytowalnej gry (klucz = id gry).
// ==========================================================

window.GRY_STORAGE = (function () {
    const PREFIX = "migo-gryedukacyjne-";

    function key(id) {
        return PREFIX + id;
    }

    function load(id) {
        try {
            const raw = localStorage.getItem(key(id));
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn("GRY_STORAGE.load błąd:", e);
            return null;
        }
    }

    function save(id, dane) {
        try {
            localStorage.setItem(key(id), JSON.stringify(dane));
            return true;
        } catch (e) {
            console.warn("GRY_STORAGE.save błąd (localStorage pełny lub niedostępny):", e);
            return false;
        }
    }

    function clear(id) {
        try {
            localStorage.removeItem(key(id));
            return true;
        } catch (e) {
            return false;
        }
    }

    return { load, save, clear };
})();
