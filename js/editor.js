// ==========================================================
// EDYTOR SŁÓW I OBRAZKÓW
// Pozwala dopisywać, edytować i usuwać hasła w edytowalnych bazach
// (moduły z flagą `edytowalna: true`). Zmiany zapisują się od razu
// w localStorage (window.GRY_STORAGE) i są widoczne w grze natychmiast
// (bez przeładowania strony), bo edytor operuje na tej samej tablicy
// `dane`, którą czyta silnik gry.
// ==========================================================

(function () {
    // Definicja pól formularza dla każdej edytowalnej bazy.
    const POLA = {
        czytanie: [
            { klucz: "slowo", etykieta: "Słowo", typ: "text" },
            { klucz: "ikona", etykieta: "Ikona (emoji) lub URL obrazka", typ: "text" },
        ],
        pisownia: [
            { klucz: "pelne", etykieta: "Słowo (pełne)", typ: "text" },
            { klucz: "poprawna", etykieta: "Poprawna litera / cząstka", typ: "text" },
            { klucz: "kat", etykieta: "Kategoria", typ: "select", opcje: ["rz/ż", "u/ó", "h/ch", "wyjątki"] },
            { klucz: "ikona", etykieta: "Ikona (emoji) lub URL obrazka", typ: "text" },
        ],
    };

    const KLUCZ_GLOWNY = { czytanie: "slowo", pisownia: "pelne" };
    const LIMIT_START = 60;
    const LIMIT_KROK = 60;

    function edytowalneModuly() {
        return Object.values(window.GRY_MODULES || {}).filter((m) => m.edytowalna);
    }

    window.GRY_EDITOR = {
        _aktywnyId: null,
        _szukaj: "",
        _edytowanyIndeks: null,
        _kontener: null,
        _limitWidoczny: LIMIT_START,

        init(kontener) {
            this._kontener = kontener;
            const moduly = edytowalneModuly();
            this._aktywnyId = moduly.length ? moduly[0].id : null;
            this._limitWidoczny = LIMIT_START;
            this._render();
        },

        wznow() {
            this._render();
        },

        _modul() {
            return window.GRY_MODULES[this._aktywnyId];
        },

        _pola() {
            return POLA[this._aktywnyId] || [];
        },

        _render() {
            const kontener = this._kontener;
            const moduly = edytowalneModuly();

            if (!moduly.length || !this._aktywnyId) {
                kontener.innerHTML = `<p>Brak baz danych do edycji.</p>`;
                return;
            }

            const opcjeSelect = moduly
                .map((m) => `<option value="${m.id}" ${m.id === this._aktywnyId ? "selected" : ""}>${m.nazwa}</option>`)
                .join("");

            kontener.innerHTML = `
                <div class="editor-toolbar">
                    <select id="editor-gra" class="editor-select">${opcjeSelect}</select>
                    <input type="text" id="editor-szukaj" class="editor-search" placeholder="Szukaj słowa..." value="${window.GRY_UTILS.escapeHtml(this._szukaj)}">
                </div>
                <details class="editor-dodaj-details">
                    <summary>+ Dodaj nowe hasło</summary>
                    <div id="editor-dodaj"></div>
                </details>
                <div class="editor-info" id="editor-info"></div>
                <div class="editor-lista" id="editor-lista"></div>
                <div class="editor-plik-akcje">
                    <button class="btn-mini" id="editor-eksport">⬇️ Zapisz bazę do pliku</button>
                    <button class="btn-mini" id="editor-import-btn">⬆️ Wczytaj bazę z pliku</button>
                </div>
                <input type="file" accept=".json,application/json" id="editor-import-plik" style="display:none;">
                <button class="btn-powrot editor-reset" id="editor-reset">↺ Resetuj tę bazę do domyślnej zawartości</button>
            `;

            document.getElementById("editor-gra").onchange = (e) => {
                this._aktywnyId = e.target.value;
                this._szukaj = "";
                this._edytowanyIndeks = null;
                this._limitWidoczny = LIMIT_START;
                this._render();
            };
            document.getElementById("editor-szukaj").oninput = (e) => {
                this._szukaj = e.target.value;
                this._limitWidoczny = LIMIT_START;
                this._renderLista();
            };
            document.getElementById("editor-reset").onclick = () => this._resetuj();
            document.getElementById("editor-eksport").onclick = () => this._eksportuj();
            document.getElementById("editor-import-btn").onclick = () => document.getElementById("editor-import-plik").click();
            document.getElementById("editor-import-plik").onchange = (e) => this._importuj(e.target.files[0]);

            this._renderFormularzDodawania();
            this._renderLista();
        },

        // Zapisuje bieżącą bazę do pliku .json na dysku użytkownika - to
        // jedyny sposób na TRWAŁY, przenośny backup (localStorage żyje tylko
        // w tej przeglądarce i ginie np. przy czyszczeniu danych strony).
        _eksportuj() {
            const modul = this._modul();
            const json = JSON.stringify(modul.dane, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `migo-${this._aktywnyId}-baza.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this._pokazInfo("Zapisano plik z bazą - sprawdź folder Pobrane.", "ok");
        },

        _importuj(plik) {
            if (!plik) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                let dane;
                try {
                    dane = JSON.parse(e.target.result);
                } catch (err) {
                    this._pokazInfo("To nie jest poprawny plik JSON.", "blad");
                    return;
                }
                if (!Array.isArray(dane)) {
                    this._pokazInfo("Plik musi zawierać listę haseł (tablicę).", "blad");
                    return;
                }
                if (!window.confirm(`Wczytać ${dane.length} haseł z pliku? To ZASTĄPI obecną bazę "${this._modul().nazwa}".`)) return;

                this._modul().dane = dane;
                this._zapiszDoStorage();
                this._edytowanyIndeks = null;
                this._pokazInfo(`Wczytano ${dane.length} haseł z pliku.`, "ok");
                this._renderLista();
            };
            reader.onerror = () => this._pokazInfo("Nie udało się odczytać pliku.", "blad");
            reader.readAsText(plik);
        },

        _poleHtml(pole, wartosc, prefix) {
            const id = `editor-${prefix}-${pole.klucz}`;

            if (pole.klucz === "ikona") {
                return this._ikonaPickerHtml(pole, wartosc, prefix, id);
            }

            const wartoscBezp = window.GRY_UTILS.escapeHtml(wartosc || "");
            if (pole.typ === "select") {
                const opcje = pole.opcje
                    .map((o) => `<option value="${o}" ${o === wartosc ? "selected" : ""}>${o}</option>`)
                    .join("");
                return `<label class="editor-label">${pole.etykieta}
                    <select id="${id}" class="editor-input">${opcje}</select>
                </label>`;
            }
            return `<label class="editor-label">${pole.etykieta}
                <input id="${id}" type="text" class="editor-input" value="${wartoscBezp}">
            </label>`;
        },

        // Picker obrazka: podgląd + "z dysku" (input file) + "wklej ze schowka"
        // (Ctrl+V) + pole tekstowe jako trzecia opcja (emoji lub gotowy URL).
        // Wszystkie trzy ścieżki kończą się w tym samym polu tekstowym (id),
        // więc _odczytajPola() nie wymaga żadnych zmian.
        _ikonaPickerHtml(pole, wartosc, prefix, id) {
            const wartoscBezp = window.GRY_UTILS.escapeHtml(wartosc || "");
            const podgladHtml = window.GRY_UTILS.ikonaHtml(wartosc || "");
            return `<div class="editor-label">${pole.etykieta}</div>
                <div class="ikona-picker">
                    <div class="ikona-podglad" id="editor-${prefix}-podglad">${podgladHtml}</div>
                    <div class="ikona-przyciski">
                        <button type="button" class="btn-mini" id="editor-${prefix}-plikbtn">📁 Z dysku</button>
                        <div class="ikona-wklej" id="editor-${prefix}-wklej" tabindex="0">📋 Kliknij tu i wklej (Ctrl+V)</div>
                    </div>
                    <input type="file" accept="image/*" id="editor-${prefix}-plik" style="display:none;">
                    <input id="${id}" type="text" class="editor-input ikona-tekst" placeholder="...albo wpisz emoji, np. 🐱" value="${wartoscBezp}">
                </div>`;
        },

        // Podpina obsługę pliku z dysku, wklejania ze schowka i ręcznego
        // wpisu dla pickera obrazka o danym prefiksie ("nowy" lub "w<idx>").
        _wirujIkonaPicker(prefix) {
            const plikBtn = document.getElementById(`editor-${prefix}-plikbtn`);
            if (!plikBtn) return; // ten formularz nie ma pola ikony - nic do zrobienia

            const plikInput = document.getElementById(`editor-${prefix}-plik`);
            const wklejDiv = document.getElementById(`editor-${prefix}-wklej`);
            const tekstInput = document.getElementById(`editor-${prefix}-ikona`);

            plikBtn.onclick = () => plikInput.click();

            plikInput.onchange = (e) => {
                const plik = e.target.files[0];
                if (!plik) return;
                this._przetworzObrazek(plik, (dataUrl) => {
                    tekstInput.value = dataUrl;
                    this._aktualizujPodglad(prefix, dataUrl);
                });
            };

            wklejDiv.onpaste = (e) => {
                const items = e.clipboardData && e.clipboardData.items;
                if (!items) return;
                for (const item of items) {
                    if (item.type && item.type.startsWith("image/")) {
                        const blob = item.getAsFile();
                        this._przetworzObrazek(blob, (dataUrl) => {
                            tekstInput.value = dataUrl;
                            this._aktualizujPodglad(prefix, dataUrl);
                        });
                        e.preventDefault();
                        break;
                    }
                }
            };

            tekstInput.oninput = () => this._aktualizujPodglad(prefix, tekstInput.value);
        },

        _aktualizujPodglad(prefix, wartosc) {
            const podglad = document.getElementById(`editor-${prefix}-podglad`);
            if (podglad) podglad.innerHTML = window.GRY_UTILS.ikonaHtml(wartosc);
        },

        // Wczytuje plik/blob obrazka, skaluje go do rozsądnego rozmiaru
        // ikony (max 128px) i kompresuje do WebP (fallback PNG), żeby
        // zapis w localStorage nie napuchł zbyt szybko przy wielu hasłach.
        _przetworzObrazek(plik, callback) {
            const MAX_ROZMIAR = 128;
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;
                    if (width > height && width > MAX_ROZMIAR) {
                        height = Math.round((height * MAX_ROZMIAR) / width);
                        width = MAX_ROZMIAR;
                    } else if (height > MAX_ROZMIAR) {
                        width = Math.round((width * MAX_ROZMIAR) / height);
                        height = MAX_ROZMIAR;
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    let dataUrl = canvas.toDataURL("image/webp", 0.85);
                    if (!dataUrl.startsWith("data:image/webp")) {
                        dataUrl = canvas.toDataURL("image/png"); // fallback gdy przeglądarka nie wspiera WebP
                    }
                    callback(dataUrl);
                };
                img.onerror = () => this._pokazInfo("Nie udało się wczytać tego obrazka.", "blad");
                img.src = e.target.result;
            };
            reader.onerror = () => this._pokazInfo("Nie udało się odczytać pliku.", "blad");
            reader.readAsDataURL(plik);
        },

        _odczytajPola(prefix) {
            const wynik = {};
            this._pola().forEach((p) => {
                const el = document.getElementById(`editor-${prefix}-${p.klucz}`);
                wynik[p.klucz] = el ? el.value.trim() : "";
            });
            return wynik;
        },

        // Zwraca null jeśli OK, string z komunikatem błędu (blokującym zapis)
        // lub obiekt {ostrzezenie: true, tekst: ...} jeśli można zapisać mimo ostrzeżenia.
        _walidacja(wpis) {
            if (this._aktywnyId === "czytanie") {
                if (!wpis.slowo || !wpis.ikona) return "Uzupełnij słowo i ikonę/obrazek.";
            }
            if (this._aktywnyId === "pisownia") {
                if (!wpis.pelne || !wpis.poprawna || !wpis.kat || !wpis.ikona) {
                    return "Uzupełnij wszystkie pola.";
                }
                if (!wpis.pelne.toLowerCase().includes(wpis.poprawna.toLowerCase())) {
                    return {
                        ostrzezenie: true,
                        tekst: `Uwaga: "${wpis.poprawna}" nie występuje w słowie "${wpis.pelne}" - w grze luka nie wyświetli się poprawnie. Popraw literę lub słowo.`,
                    };
                }
            }
            return null;
        },

        _pokazInfo(tekst, typ) {
            const info = document.getElementById("editor-info");
            if (!info) return;
            info.textContent = tekst;
            info.className = "editor-info" + (typ === "blad" ? " editor-info-blad" : typ === "ostrzezenie" ? " editor-info-ostrzezenie" : " editor-info-ok");
        },

        _zapiszDoStorage() {
            window.GRY_STORAGE.save(this._aktywnyId, this._modul().dane);
        },

        _renderFormularzDodawania() {
            const kontener = document.getElementById("editor-dodaj");
            if (!kontener) return;
            kontener.innerHTML =
                this._pola()
                    .map((p) => this._poleHtml(p, "", "nowy"))
                    .join("") + `<button class="btn-dodaj" id="editor-dodaj-btn">+ Dodaj hasło</button>`;
            document.getElementById("editor-dodaj-btn").onclick = () => this._dodaj();
            this._wirujIkonaPicker("nowy");
        },

        _dodaj() {
            const wpis = this._odczytajPola("nowy");
            const walidacja = this._walidacja(wpis);

            if (typeof walidacja === "string") {
                this._pokazInfo(walidacja, "blad");
                return;
            }

            this._modul().dane.push(wpis);
            this._zapiszDoStorage();

            if (walidacja && walidacja.ostrzezenie) {
                this._pokazInfo(`Dodano (z ostrzeżeniem): ${walidacja.tekst}`, "ostrzezenie");
            } else {
                this._pokazInfo("Dodano hasło.", "ok");
            }

            this._renderFormularzDodawania();
            this._renderLista();
        },

        _przelaczEdycje(idx) {
            this._edytowanyIndeks = this._edytowanyIndeks === idx ? null : idx;
            this._renderLista();
        },

        _zapiszEdycje(idx) {
            const wpis = this._odczytajPola(`w${idx}`);
            const walidacja = this._walidacja(wpis);

            if (typeof walidacja === "string") {
                this._pokazInfo(walidacja, "blad");
                return;
            }

            this._modul().dane[idx] = wpis;
            this._zapiszDoStorage();
            this._edytowanyIndeks = null;

            if (walidacja && walidacja.ostrzezenie) {
                this._pokazInfo(`Zapisano (z ostrzeżeniem): ${walidacja.tekst}`, "ostrzezenie");
            } else {
                this._pokazInfo("Zapisano zmiany.", "ok");
            }

            this._renderLista();
        },

        _usun(idx) {
            const dane = this._modul().dane;
            const wpis = dane[idx];
            const nazwa = wpis[KLUCZ_GLOWNY[this._aktywnyId]];
            if (!window.confirm(`Usunąć hasło "${nazwa}"?`)) return;

            dane.splice(idx, 1);
            this._zapiszDoStorage();
            this._edytowanyIndeks = null;
            this._pokazInfo(`Usunięto "${nazwa}".`, "ok");
            this._renderLista();
        },

        _resetuj() {
            const modul = this._modul();
            if (!window.confirm(`Przywrócić domyślną zawartość bazy "${modul.nazwa}"? Wszystkie Twoje zmiany w tej bazie zostaną utracone.`)) return;

            modul.dane = modul._domyslneDane.slice();
            window.GRY_STORAGE.clear(this._aktywnyId);
            this._edytowanyIndeks = null;
            this._szukaj = "";
            this._limitWidoczny = LIMIT_START;
            this._pokazInfo("Przywrócono domyślną zawartość bazy.", "ok");
            this._render();
        },

        _doladujWiecej() {
            const lista = document.getElementById("editor-lista");
            const scrollBackup = lista ? lista.scrollTop : 0;
            this._limitWidoczny += LIMIT_KROK;
            this._renderLista();
            const listaNowa = document.getElementById("editor-lista");
            if (listaNowa) listaNowa.scrollTop = scrollBackup;
        },

        _renderLista() {
            const lista = document.getElementById("editor-lista");
            if (!lista) return;

            const dane = this._modul().dane;
            const kluczGlowny = KLUCZ_GLOWNY[this._aktywnyId];
            const szukaj = this._szukaj.toLowerCase();

            const wyniki = dane
                .map((wpis, idx) => ({ wpis, idx }))
                .filter(({ wpis }) => !szukaj || (wpis[kluczGlowny] || "").toLowerCase().includes(szukaj));

            if (!this._limitWidoczny) this._limitWidoczny = LIMIT_START;
            const limit = Math.min(this._limitWidoczny, wyniki.length);
            const pokazywane = wyniki.slice(0, limit);
            const zostajeJeszcze = wyniki.length - pokazywane.length;

            const licznik = `<div class="editor-licznik">Pokazano ${pokazywane.length} z ${wyniki.length}</div>`;
            const wiersze = pokazywane.map(({ wpis, idx }) => this._wierszHtml(wpis, idx)).join("");
            const przyciskWiecej =
                zostajeJeszcze > 0
                    ? `<button class="btn-mini editor-wiecej" id="editor-wiecej">Pokaż więcej (zostało ${zostajeJeszcze})</button>`
                    : "";

            lista.innerHTML = licznik + wiersze + przyciskWiecej;

            pokazywane.forEach(({ idx }) => {
                if (this._edytowanyIndeks === idx) {
                    const zapiszBtn = document.getElementById(`editor-zapisz-${idx}`);
                    const anulujBtn = document.getElementById(`editor-anuluj-${idx}`);
                    if (zapiszBtn) zapiszBtn.onclick = () => this._zapiszEdycje(idx);
                    if (anulujBtn) anulujBtn.onclick = () => this._przelaczEdycje(idx);
                    this._wirujIkonaPicker(`w${idx}`);
                } else {
                    const edytujBtn = document.getElementById(`editor-edytuj-${idx}`);
                    const usunBtn = document.getElementById(`editor-usun-${idx}`);
                    if (edytujBtn) edytujBtn.onclick = () => this._przelaczEdycje(idx);
                    if (usunBtn) usunBtn.onclick = () => this._usun(idx);
                }
            });

            const wiecejBtn = document.getElementById("editor-wiecej");
            if (wiecejBtn) wiecejBtn.onclick = () => this._doladujWiecej();

            // Doładowanie kolejnej porcji przy przewinięciu blisko dołu -
            // dzięki temu WSZYSTKIE słowa da się znaleźć przewijając,
            // nie tylko przez wyszukiwarkę. Pełna lista (do ~1600 wierszy)
            // nigdy nie trafia do DOM na raz - to ona powodowała, że
            // przewijanie "zawieszało się" przed końcem na słabszych
            // urządzeniach/mobile.
            lista.onscroll = () => {
                if (zostajeJeszcze <= 0) return;
                const bliskoDolu = lista.scrollTop + lista.clientHeight >= lista.scrollHeight - 80;
                if (bliskoDolu) this._doladujWiecej();
            };
        },

        _wierszHtml(wpis, idx) {
            if (this._edytowanyIndeks === idx) {
                return `<div class="editor-row editor-row-edycja">
                    ${this._pola()
                        .map((p) => this._poleHtml(p, wpis[p.klucz], `w${idx}`))
                        .join("")}
                    <div class="editor-row-akcje">
                        <button id="editor-zapisz-${idx}" class="btn-dodaj">💾 Zapisz</button>
                        <button id="editor-anuluj-${idx}" class="btn-anuluj">Anuluj</button>
                    </div>
                </div>`;
            }

            const opisDodatkowy =
                this._aktywnyId === "pisownia" ? ` <span class="editor-row-detal">(${window.GRY_UTILS.escapeHtml(wpis.poprawna)} • ${window.GRY_UTILS.escapeHtml(wpis.kat)})</span>` : "";

            return `<div class="editor-row">
                <span class="editor-row-ikona">${window.GRY_UTILS.ikonaHtml(wpis.ikona)}</span>
                <span class="editor-row-tekst">${window.GRY_UTILS.escapeHtml(wpis[KLUCZ_GLOWNY[this._aktywnyId]])}${opisDodatkowy}</span>
                <button id="editor-edytuj-${idx}" class="btn-small" title="Edytuj">✏️</button>
                <button id="editor-usun-${idx}" class="btn-small" title="Usuń">🗑️</button>
            </div>`;
        },
    };
})();
