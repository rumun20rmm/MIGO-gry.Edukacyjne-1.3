// ==========================================================
// GRA: Nauka Czytania
// Baza: 275 słów/ikon, wyselekcjonowane i odfiltrowane z
// Gra_czytanie.xlsm (Arkusz2, ~913 wierszy) - usunięto duplikaty oraz
// słownictwo biznesowe/biurowe nieodpowiednie dla dzieci (budżet, audyt,
// faktura, kierownik itp.), zostawiając słowa dziecięce/codzienne.
// Baza jest edytowalna w aplikacji (zakładka "Edytor słów") - zmiany
// zapisują się w localStorage przeglądarki, DANE_DOMYSLNE to kopia
// zapasowa do przycisku "Resetuj do domyślnej".
// ==========================================================

const DANE_DOMYSLNE_CZYTANIE = [
    { slowo: "arbuz", ikona: "🍉" },
    { slowo: "auto", ikona: "🚗" },
    { slowo: "autobus", ikona: "🚌" },
    { slowo: "banan", ikona: "🍌" },
    { slowo: "bieganie", ikona: "🏃" },
    { slowo: "brak", ikona: "❗" },
    { slowo: "burger", ikona: "🍔" },
    { slowo: "burza", ikona: "⛈️" },
    { slowo: "buty", ikona: "👟" },
    { slowo: "bęben", ikona: "🥁" },
    { slowo: "błąd", ikona: "❌" },
    { slowo: "cel", ikona: "🎯" },
    { slowo: "chleb", ikona: "🍞" },
    { slowo: "chmura", ikona: "☁️" },
    { slowo: "ciastko", ikona: "🍪" },
    { slowo: "cisza", ikona: "🤫" },
    { slowo: "ciężarówka", ikona: "🚛" },
    { slowo: "cukier", ikona: "🍬" },
    { slowo: "cukierek", ikona: "🍬" },
    { slowo: "cytryna", ikona: "🍋" },
    { slowo: "czapka", ikona: "🧢" },
    { slowo: "czas", ikona: "⏰" },
    { slowo: "czekolada", ikona: "🍫" },
    { slowo: "dach", ikona: "🏠" },
    { slowo: "delfin", ikona: "🐬" },
    { slowo: "deszcz", ikona: "🌧️" },
    { slowo: "dom", ikona: "🏠" },
    { slowo: "droga", ikona: "🛣️" },
    { slowo: "drużyna", ikona: "👥" },
    { slowo: "drzewo", ikona: "🌳" },
    { slowo: "drzwi", ikona: "🚪" },
    { slowo: "dynia", ikona: "🎃" },
    { slowo: "dzień", ikona: "🌞" },
    { slowo: "dźwięk", ikona: "🔊" },
    { slowo: "email", ikona: "📧" },
    { slowo: "energia", ikona: "🔋" },
    { slowo: "farby", ikona: "🎨" },
    { slowo: "film", ikona: "🎬" },
    { slowo: "frytki", ikona: "🍟" },
    { slowo: "gitara", ikona: "🎸" },
    { slowo: "gra", ikona: "🎮" },
    { slowo: "gruszka", ikona: "🍐" },
    { slowo: "grzyb", ikona: "🍄" },
    { slowo: "gwiazda", ikona: "⭐" },
    { slowo: "góra", ikona: "🏔️" },
    { slowo: "hala", ikona: "🏭" },
    { slowo: "hałas", ikona: "📢" },
    { slowo: "helikopter", ikona: "🚁" },
    { slowo: "herbata", ikona: "☕" },
    { slowo: "historia", ikona: "📜" },
    { slowo: "jabłko", ikona: "🍎" },
    { slowo: "jajko", ikona: "🥚" },
    { slowo: "jedzenie", ikona: "🍽️" },
    { slowo: "kaczka", ikona: "🦆" },
    { slowo: "kalendarz", ikona: "📅" },
    { slowo: "kamera", ikona: "🎥" },
    { slowo: "kamień", ikona: "🪨" },
    { slowo: "kanapka", ikona: "🥪" },
    { slowo: "kangur", ikona: "🦘" },
    { slowo: "karetka", ikona: "🚑" },
    { slowo: "karton", ikona: "📦" },
    { slowo: "kask", ikona: "🪖" },
    { slowo: "kawa", ikona: "☕" },
    { slowo: "klocki", ikona: "🧱" },
    { slowo: "klucz", ikona: "🔑" },
    { slowo: "kolacja", ikona: "🍝" },
    { slowo: "komputer", ikona: "💻" },
    { slowo: "koniec", ikona: "🏁" },
    { slowo: "kosmita", ikona: "👽" },
    { slowo: "kosz", ikona: "🗑️" },
    { slowo: "koszulka", ikona: "👕" },
    { slowo: "kot", ikona: "🐈" },
    { slowo: "koń", ikona: "🐎" },
    { slowo: "krab", ikona: "🦀" },
    { slowo: "kredka", ikona: "🖍️" },
    { slowo: "krok", ikona: "👣" },
    { slowo: "krowa", ikona: "🐄" },
    { slowo: "krzesło", ikona: "🪑" },
    { slowo: "książka", ikona: "📖" },
    { slowo: "księżyc", ikona: "🌙" },
    { slowo: "kukurydza", ikona: "🌽" },
    { slowo: "kura", ikona: "🐓" },
    { slowo: "kwiat", ikona: "🌻" },
    { slowo: "lalka", ikona: "🪆" },
    { slowo: "lampa", ikona: "💡" },
    { slowo: "las", ikona: "🌲" },
    { slowo: "lew", ikona: "🦁" },
    { slowo: "lis", ikona: "🦊" },
    { slowo: "liść", ikona: "🍃" },
    { slowo: "lody", ikona: "🍦" },
    { slowo: "lustro", ikona: "🪞" },
    { slowo: "marchewka", ikona: "🥕" },
    { slowo: "marker", ikona: "🖊️" },
    { slowo: "maszyna", ikona: "⚙️" },
    { slowo: "małpa", ikona: "🐒" },
    { slowo: "miasto", ikona: "🏙️" },
    { slowo: "miesiąc", ikona: "🗓️" },
    { slowo: "mięso", ikona: "🍖" },
    { slowo: "miś", ikona: "🧸" },
    { slowo: "mleko", ikona: "🥛" },
    { slowo: "morze", ikona: "🌊" },
    { slowo: "motor", ikona: "🏍️" },
    { slowo: "motyl", ikona: "🦋" },
    { slowo: "muzyka", ikona: "🎵" },
    { slowo: "mydło", ikona: "🧼" },
    { slowo: "mysz", ikona: "🐭" },
    { slowo: "narzędzie", ikona: "🛠️" },
    { slowo: "natura", ikona: "🌿" },
    { slowo: "nauczyciel", ikona: "🍎" },
    { slowo: "nauka", ikona: "📚" },
    { slowo: "niedźwiedź", ikona: "🐻" },
    { slowo: "noc", ikona: "🌙" },
    { slowo: "noga", ikona: "🦶" },
    { slowo: "nos", ikona: "👃" },
    { slowo: "notatka", ikona: "📝" },
    { slowo: "obiad", ikona: "🍲" },
    { slowo: "obraz", ikona: "🖼️" },
    { slowo: "ocena", ikona: "⭐" },
    { slowo: "odpad", ikona: "🚮" },
    { slowo: "odpoczynek", ikona: "🛌" },
    { slowo: "odpowiedź", ikona: "✅" },
    { slowo: "ogień", ikona: "🔥" },
    { slowo: "ogórek", ikona: "🥒" },
    { slowo: "okno", ikona: "🪟" },
    { slowo: "oko", ikona: "👁️" },
    { slowo: "okulary", ikona: "👓" },
    { slowo: "ostrzeżenie", ikona: "⚠️" },
    { slowo: "owca", ikona: "🐑" },
    { slowo: "owoc", ikona: "🍎" },
    { slowo: "ołówek", ikona: "✏️" },
    { slowo: "ośmiornica", ikona: "🐙" },
    { slowo: "pająk", ikona: "🕷️" },
    { slowo: "paleta", ikona: "🧱" },
    { slowo: "papier", ikona: "📃" },
    { slowo: "parasol", ikona: "☂️" },
    { slowo: "parking", ikona: "🅿️" },
    { slowo: "pauza", ikona: "⏸️" },
    { slowo: "piasek", ikona: "🏖️" },
    { slowo: "pieniądze", ikona: "💰" },
    { slowo: "pieprz", ikona: "🌶️" },
    { slowo: "pies", ikona: "🐕" },
    { slowo: "pingwin", ikona: "🐧" },
    { slowo: "piorun", ikona: "⚡" },
    { slowo: "pizza", ikona: "🍕" },
    { slowo: "piętro", ikona: "🧱" },
    { slowo: "piłka", ikona: "⚽" },
    { slowo: "plan", ikona: "🗺️" },
    { slowo: "planeta", ikona: "🪐" },
    { slowo: "plecak", ikona: "🎒" },
    { slowo: "pochwała", ikona: "👍" },
    { slowo: "pociąg", ikona: "🚂" },
    { slowo: "początek", ikona: "🚀" },
    { slowo: "podłoga", ikona: "🧹" },
    { slowo: "policja", ikona: "🚓" },
    { slowo: "pomidor", ikona: "🍅" },
    { slowo: "pomoc", ikona: "🆘" },
    { slowo: "pomoc medyczna", ikona: "🚑" },
    { slowo: "pomysł", ikona: "💡" },
    { slowo: "poprawa", ikona: "🔧" },
    { slowo: "poranek", ikona: "🌅" },
    { slowo: "portfel", ikona: "👛" },
    { slowo: "praca", ikona: "💼" },
    { slowo: "prezent", ikona: "🎁" },
    { slowo: "problem", ikona: "🧨" },
    { slowo: "projekt", ikona: "🧩" },
    { slowo: "przegrana", ikona: "🥈" },
    { slowo: "przerwa", ikona: "☕" },
    { slowo: "przyspieszenie", ikona: "🐇" },
    { slowo: "przyszłość", ikona: "🔮" },
    { slowo: "prąd", ikona: "⚡" },
    { slowo: "prędkość", ikona: "⚡" },
    { slowo: "pszczoła", ikona: "🐝" },
    { slowo: "ptak", ikona: "🐦" },
    { slowo: "pytanie", ikona: "❓" },
    { slowo: "pączek", ikona: "🍩" },
    { slowo: "radio", ikona: "📻" },
    { slowo: "rakieta", ikona: "🚀" },
    { slowo: "recykling", ikona: "♻️" },
    { slowo: "rekin", ikona: "🦈" },
    { slowo: "rok", ikona: "🎆" },
    { slowo: "rower", ikona: "🚲" },
    { slowo: "rozmowa", ikona: "💬" },
    { slowo: "ryba", ikona: "🐟" },
    { slowo: "rywal", ikona: "🤼" },
    { slowo: "ryż", ikona: "🍚" },
    { slowo: "równowaga", ikona: "⚖️" },
    { slowo: "ręka", ikona: "✋" },
    { slowo: "rękawice", ikona: "🧤" },
    { slowo: "samochód", ikona: "🚗" },
    { slowo: "samolot", ikona: "✈️" },
    { slowo: "schody", ikona: "🪜" },
    { slowo: "ser", ikona: "🧀" },
    { slowo: "serce", ikona: "❤️" },
    { slowo: "siłownia", ikona: "🏋️" },
    { slowo: "skarpetki", ikona: "🧦" },
    { slowo: "sklep", ikona: "🛒" },
    { slowo: "smak", ikona: "👅" },
    { slowo: "smok", ikona: "🐉" },
    { slowo: "sok", ikona: "🥤" },
    { slowo: "spodnie", ikona: "👖" },
    { slowo: "spokój", ikona: "😌" },
    { slowo: "sport", ikona: "⚽" },
    { slowo: "sprzątanie", ikona: "🧹" },
    { slowo: "start", ikona: "▶️" },
    { slowo: "statek", ikona: "🚢" },
    { slowo: "stop", ikona: "⏹️" },
    { slowo: "straż", ikona: "🚒" },
    { slowo: "stres", ikona: "😰" },
    { slowo: "sukces", ikona: "🏆" },
    { slowo: "sukienka", ikona: "👗" },
    { slowo: "szczotka", ikona: "🪮" },
    { slowo: "szpital", ikona: "🏥" },
    { slowo: "sól", ikona: "🧂" },
    { slowo: "słoń", ikona: "🐘" },
    { slowo: "słońce", ikona: "☀️" },
    { slowo: "telefon", ikona: "📱" },
    { slowo: "telewizor", ikona: "📺" },
    { slowo: "temperatura", ikona: "🌡️" },
    { slowo: "toaleta", ikona: "🚻" },
    { slowo: "tort", ikona: "🎂" },
    { slowo: "traktor", ikona: "🚜" },
    { slowo: "tramwaj", ikona: "🚃" },
    { slowo: "trener", ikona: "🧑‍🏫" },
    { slowo: "trening", ikona: "🏋️" },
    { slowo: "truskawka", ikona: "🍓" },
    { slowo: "tydzień", ikona: "📆" },
    { slowo: "tęcza", ikona: "🌈" },
    { slowo: "ucho", ikona: "👂" },
    { slowo: "uczeń", ikona: "🎒" },
    { slowo: "usta", ikona: "👄" },
    { slowo: "uwaga", ikona: "👀" },
    { slowo: "warzywo", ikona: "🥕" },
    { slowo: "wejście", ikona: "🚪" },
    { slowo: "wiatr", ikona: "🌬️" },
    { slowo: "wieczór", ikona: "🌇" },
    { slowo: "wiedza", ikona: "🧠" },
    { slowo: "wieloryb", ikona: "🐋" },
    { slowo: "wieś", ikona: "🌾" },
    { slowo: "wilgotność", ikona: "💧" },
    { slowo: "wilk", ikona: "🐺" },
    { slowo: "winda", ikona: "🛗" },
    { slowo: "winogrona", ikona: "🍇" },
    { slowo: "wisienka", ikona: "🍒" },
    { slowo: "woda", ikona: "💧" },
    { slowo: "wulkan", ikona: "🌋" },
    { slowo: "wygrana", ikona: "🥇" },
    { slowo: "wyjście", ikona: "🚶" },
    { slowo: "wynik", ikona: "🏁" },
    { slowo: "wyspa", ikona: "🏝️" },
    { slowo: "wąż", ikona: "🐍" },
    { slowo: "zabawa", ikona: "🎉" },
    { slowo: "zadanie", ikona: "📌" },
    { slowo: "zając", ikona: "🐇" },
    { slowo: "zapach", ikona: "👃" },
    { slowo: "zasada", ikona: "📏" },
    { slowo: "zaufanie", ikona: "🤝" },
    { slowo: "zdjęcie", ikona: "📸" },
    { slowo: "zdrowie", ikona: "❤️" },
    { slowo: "zebra", ikona: "🦓" },
    { slowo: "zegar", ikona: "⏰" },
    { slowo: "zespół", ikona: "🧑‍🤝‍🧑" },
    { slowo: "zgoda", ikona: "🤝" },
    { slowo: "ziemniak", ikona: "🥔" },
    { slowo: "zmiana", ikona: "🔁" },
    { slowo: "zupa", ikona: "🥣" },
    { slowo: "łóżko", ikona: "🛌" },
    { slowo: "ściana", ikona: "🧱" },
    { slowo: "śniadanie", ikona: "🥐" },
    { slowo: "śnieg", ikona: "❄️" },
    { slowo: "środowisko", ikona: "🌍" },
    { slowo: "światło", ikona: "💡" },
    { slowo: "świnia", ikona: "🐖" },
    { slowo: "żaba", ikona: "🐸" },
    { slowo: "żyrafa", ikona: "🦒" },
    { slowo: "żółw", ikona: "🐢" }
];

window.GRY_MODULES = window.GRY_MODULES || {};

window.GRY_MODULES.czytanie = {
    id: "czytanie",
    nazwa: "Nauka Czytania",
    ikona: "📖",
    opis: "Dopasuj obrazek do wylosowanego słowa",
    edytowalna: true,

    dane: DANE_DOMYSLNE_CZYTANIE.slice(),
    _domyslneDane: DANE_DOMYSLNE_CZYTANIE,

    _poprawnaIkona: "",
    _lock: false,

    init(kontener) {
        this._render(kontener);
        this._losuj();
    },

    _render(kontener) {
        kontener.innerHTML = `
            <div class="pole-glowne" id="czytanie-slowo" style="--accent-gry: var(--accent-czytanie);">...</div>
            <div class="siatka-opcje" id="czytanie-grid"></div>
            <div class="feedback-box" id="czytanie-feedback"></div>
        `;
    },

    _losuj() {
        const dane = this.dane;
        if (dane.length < 11) return; // za mało danych na 10 unikalnych opcji

        const feedback = document.getElementById("czytanie-feedback");
        feedback.textContent = "";
        feedback.className = "feedback-box";

        const wylosowana = dane[Math.floor(Math.random() * dane.length)];
        document.getElementById("czytanie-slowo").textContent = wylosowana.slowo;
        this._poprawnaIkona = wylosowana.ikona;

        let ikony = new Array(10).fill("");
        const miejscePoprawnej = Math.floor(Math.random() * 10);
        ikony[miejscePoprawnej] = this._poprawnaIkona;

        for (let i = 0; i < 10; i++) {
            if (i === miejscePoprawnej) continue;
            let nowaIkona = "";
            let dubel = false;
            do {
                dubel = false;
                const losowa = dane[Math.floor(Math.random() * dane.length)];
                nowaIkona = losowa.ikona;
                for (let j = 0; j < 10; j++) {
                    if (ikony[j] === nowaIkona) {
                        dubel = true;
                        break;
                    }
                }
            } while (dubel);
            ikony[i] = nowaIkona;
        }

        const grid = document.getElementById("czytanie-grid");
        grid.innerHTML = "";
        ikony.forEach((ikona) => {
            const btn = document.createElement("button");
            btn.className = "btn-opcja";
            btn.innerHTML = window.GRY_UTILS.ikonaHtml(ikona);
            btn.onclick = () => this._sprawdz(ikona);
            grid.appendChild(btn);
        });
    },

    _sprawdz(klikniętaIkona) {
        if (this._lock) return;
        const feedback = document.getElementById("czytanie-feedback");

        if (klikniętaIkona === this._poprawnaIkona && this._poprawnaIkona !== "") {
            feedback.textContent = "BRAWO! To jest dobra odpowiedź! ( ^ _ ^ )";
            feedback.className = "feedback-box sukces";
            this._lock = true;
            setTimeout(() => {
                this._lock = false;
                this._losuj();
            }, 1500);
        } else {
            feedback.textContent = "Ojej! To nie to. Spróbuj jeszcze raz!";
            feedback.className = "feedback-box blad";
        }
    },
};
