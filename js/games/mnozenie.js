// ==========================================================
// GRA: Tabliczka Mnożenia
// Bez zewnętrznej bazy danych - działania generowane losowo (1-10)
// ==========================================================

window.GRY_MODULES = window.GRY_MODULES || {};

window.GRY_MODULES.mnozenie = {
    id: "mnozenie",
    nazwa: "Tabliczka Mnożenia",
    ikona: "✖️",
    opis: "Wylicz wynik mnożenia 1-10",

    _poprawnyWynik: 0,

    init(kontener) {
        this._render(kontener);
        this._losuj();
    },

    _render(kontener) {
        kontener.innerHTML = `
            <div class="pole-glowne" id="mnozenie-dzialanie" style="--accent-gry: var(--accent-mnozenie);">0 × 0</div>
            <div class="siatka-opcje" id="mnozenie-grid"></div>
            <div class="feedback-box" id="mnozenie-feedback"></div>
        `;
    },

    _losuj() {
        const feedback = document.getElementById("mnozenie-feedback");
        feedback.textContent = "";
        feedback.className = "feedback-box";

        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        this._poprawnyWynik = a * b;
        document.getElementById("mnozenie-dzialanie").textContent = `${a} × ${b}`;

        let wyniki = new Array(10).fill(0);
        const miejscePoprawnej = Math.floor(Math.random() * 10);
        wyniki[miejscePoprawnej] = this._poprawnyWynik;

        for (let i = 0; i < 10; i++) {
            if (i === miejscePoprawnej) continue;
            let falszywy = 0;
            let dubel = false;
            do {
                dubel = false;
                falszywy = this._poprawnyWynik + (Math.floor(Math.random() * 21) - 10);
                if (falszywy <= 0 || falszywy === this._poprawnyWynik) {
                    dubel = true;
                } else {
                    for (let j = 0; j < 10; j++) {
                        if (wyniki[j] === falszywy) {
                            dubel = true;
                            break;
                        }
                    }
                }
            } while (dubel);
            wyniki[i] = falszywy;
        }

        const grid = document.getElementById("mnozenie-grid");
        grid.innerHTML = "";
        wyniki.forEach((wynik) => {
            const btn = document.createElement("button");
            btn.className = "btn-opcja";
            btn.textContent = wynik;
            btn.onclick = () => this._sprawdz(wynik);
            grid.appendChild(btn);
        });
    },

    _sprawdz(kliknietyWynik) {
        const feedback = document.getElementById("mnozenie-feedback");
        if (kliknietyWynik === this._poprawnyWynik && this._poprawnyWynik !== 0) {
            feedback.textContent = `BRAWO! ${this._poprawnyWynik} to świetny wynik! ( ^ _ ^ )`;
            feedback.className = "feedback-box sukces";
            setTimeout(() => this._losuj(), 1500);
        } else {
            feedback.textContent = "Ojej! Spróbuj policzyć jeszcze raz!";
            feedback.className = "feedback-box blad";
        }
    },
};
