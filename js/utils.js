// ==========================================================
// Funkcje pomocnicze współdzielone przez gry i edytor
// ==========================================================

window.GRY_UTILS = (function () {
    function escapeHtml(tekst) {
        return String(tekst)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // Zwraca HTML dla pola ikony: <img> jeśli wartość wygląda na URL/obrazek,
    // w przeciwnym razie zwykły tekst (emoji) - bezpiecznie zescapowany.
    function ikonaHtml(wartosc) {
        const w = (wartosc || "").toString().trim();
        const wygladaJakObrazek = /^(https?:\/\/|data:image\/)/i.test(w);
        if (wygladaJakObrazek) {
            return `<img src="${escapeHtml(w)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;">`;
        }
        return escapeHtml(w);
    }

    return { escapeHtml, ikonaHtml };
})();
