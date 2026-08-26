# MIGO gryEdukacyjne

Jedna aplikacja HTML z menu wyboru gry. Każda gra to osobny moduł JS,
menu generuje się automatycznie na podstawie zarejestrowanych modułów.

## Architektura (niezmienna)

```
index.html          - szkielet: menu + ekrany gier (kontenery)
css/style.css        - wspólny motyw (ciemne tło, kolor akcentu per gra)
js/app.js             - router: renderuje menu, przełącza ekrany. NIE wymaga
                        zmian przy dodaniu nowej gry.
js/games/czytanie.js  - moduł "Nauka Czytania"
js/games/pisownia.js  - moduł "Mistrz Ortografii"
js/games/mnozenie.js  - moduł "Tabliczka Mnożenia"
js/games/_TEMPLATE.js - szablon nowego modułu gry (nie ładowany w index.html)
```

**Kluczowy fakt architektoniczny:** dodanie nowej gry wymaga TYLKO:
1. nowego pliku `js/games/nazwa.js` rejestrującego się w `window.GRY_MODULES.nazwa`
2. markupu ekranu gry w `index.html` (kontener `id="kontener-<id>"`, wrapper `id="ekran-<id>"`)
3. jednego `<script src="js/games/nazwa.js">` w `index.html`

Menu i router są w pełni dynamiczne — zero zmian w `js/app.js`.

## Status na koniec sesji 1 (2026-08-24) - SZABLON

Zbudowano szkielet aplikacji na bazie 3 istniejących gier (przekonwertowanych
wcześniej z arkuszy Excel/VBA: `Gra_czytanie.xlsm`, `Gra_pisownia.xlsm`,
`Gra_Tabliczka_mnożenia.xlsm`):

- **Nauka Czytania** - placeholder: 17 słów/ikon (pełna baza w
  `Gra_czytanie.xlsm`, arkusz `Arkusz2`, ma **~913 wierszy** słowo+ikona)
- **Mistrz Ortografii** - placeholder: 12 słów (pełna baza w
  `Gra_pisownia.xlsm`, arkusz `WORDS`, ma **~3426 wierszy**: słowo pełne,
  poprawne litery, kategoria rz/ż | u/ó | h/ch, emoji-podpowiedź)
- **Tabliczka Mnożenia** - kompletna, bez zewnętrznej bazy (losowanie 1-10)

Wszystkie 3 gry działają samodzielnie i są spięte wspólnym menu. Style ujednolicone
(jeden plik CSS, kolor akcentu na grę). Wszystkie pliki JS zweryfikowane `node --check`.

Naprawiony przy okazji drobny błąd z oryginalnego pliku pisowni: literówka w kluczu
obiektu (`pemne` zamiast `pelne`) dla wpisu "chmura" - w nowej wersji poprawione,
kategorie `rz/z`→`rz/ż` i `ch/h`→`h/ch` ujednolicone z arkuszem WORDS.

## Następny krok

Dopisywanie prawdziwych danych z arkuszy `.xlsm` do `dane` w `czytanie.js` i
`pisownia.js`, partiami (żeby nie przekroczyć limitu odpowiedzi) - np. po
100-200 słów na turę. Docelowo:
- `czytanie.js` → ~913 par słowo/ikona
- `pisownia.js` → ~3426 wpisów (choć część może być duplikatami/wariantami do
  przejrzenia - warto po imporcie odfiltrować duplikaty)

## Motyw jasny/ciemny

W prawym górnym rogu każdego ekranu jest okrągły przycisk (🌙/☀️)
przełączający motyw. Działa na atrybucie `data-motyw` na `<html>` +
zmiennych CSS w `css/style.css` (`--bg-*`, `--text-*`, `--border-color`
itd.) - kolory akcentu gier (różowy/niebieski/zielony/fioletowy) są
wspólne dla obu motywów.

Wybór zapisuje się w `localStorage` (przez `window.GRY_STORAGE`, klucz
`migo-gryedukacyjne-motyw`) i jest odczytywany od razu w `<head>`, zanim
strona się wyrenderuje - dzięki temu przy starcie/odświeżeniu nie ma
"mignięcia" złego motywu. Jeśli użytkownik nigdy nie kliknął przełącznika,
aplikacja startuje w motywie zgodnym z ustawieniem systemowym przeglądarki
(`prefers-color-scheme`), a jak i to jest niedostępne - domyślnie ciemnym.

## Logo MIGO.apps

W `assets/` są 3 warianty logo (dostarczone przez użytkownika), użyte tak:
- `logo-pelne.png` (ikona + napis, układ pionowy) - duże logo na ekranie **menu głównego**
- `logo-ikona.png` (sam znak, bez napisu) - mała ikonka (30px) w nagłówku **każdego** ekranu gry i edytora, obok przycisku "← Menu"; ten sam plik jest też **faviconem** karty przeglądarki
- `logo-baner.png` (poziomy układ ikona+napis) - zapasowy wariant w `assets/`, nieużyty jeszcze w interfejsie (do wykorzystania np. w przyszłym ekranie powitalnym/onboardingu)

## Edytor słów i obrazków (sesja 3)

Na ekranie menu jest przycisk **"⚙️ Edytor słów i obrazków"**. Pozwala on:
- **dodawać** nowe hasła (słowo/ikona dla Czytania; słowo/litera/kategoria/ikona dla Ortografii)
- **edytować** istniejące hasła (przycisk ✏️ przy wierszu)
- **usuwać** hasła (przycisk 🗑️, z potwierdzeniem)
- **resetować** całą bazę do domyślnej zawartości (przycisk na dole edytora)

**Zapis:** wszystkie zmiany trafiają natychmiast do `localStorage` przeglądarki
(klucz `migo-gryedukacyjne-<id_gry>`) i są od razu widoczne w grze - nie trzeba
przeładowywać strony. To zapis **w tej przeglądarce/na tym urządzeniu** -
localStorage nie synchronizuje się między urządzeniami i ginie np. przy
czyszczeniu danych przeglądarki.

**Trwały backup (⬇️/⬆️ w edytorze):** żeby zabezpieczyć zmiany na stałe
(albo przenieść je na inny komputer), użyj przycisku "Zapisz bazę do pliku" -
pobiera się plik `.json` z całą bazą. Przyciskiem "Wczytaj bazę z pliku"
można taki plik z powrotem wczytać (nadpisuje bieżącą bazę, z potwierdzeniem).

**Ikona/obrazek — trzy sposoby:**
- **📁 Z dysku** — przycisk otwiera wybór pliku (zdjęcie z komputera/telefonu)
- **📋 Wklej ze schowka** — kliknij w oznaczone pole i wciśnij Ctrl+V (np. po skopiowaniu obrazka z internetu lub zrzutu ekranu)
- **wpisz ręcznie** — emoji (np. `🐱`) albo gotowy URL obrazka

Każdy wgrany/wklejony obrazek jest automatycznie skalowany (maks. 128px) i
kompresowany do WebP (fallback PNG w starszych przeglądarkach), żeby nie
napuchł zapis w przeglądarce przy setkach haseł.

**Walidacja (Ortografia):** jeśli wpisana "poprawna litera" nie występuje w
podanym słowie, edytor i tak zapisze wpis, ale pokaże ostrzeżenie - taki wpis
zepsułby wyświetlanie luki w grze, więc warto go poprawić.

**Wydajność:** lista w edytorze pokazuje maksymalnie 60 wyników naraz (baza
Ortografii ma ~1600 pozycji) - żeby znaleźć/edytować konkretne hasło, trzeba
wpisać je (lub jego część) w polu wyszukiwania.

Zarówno dodawanie/edycja/usuwanie, jak i reset, były przetestowane end-to-end
w symulowanej przeglądarce (jsdom) przed dostarczeniem.

## Jak dodać nową grę

Skopiuj `js/games/_TEMPLATE.js`, wypełnij `id`/`nazwa`/`ikona`/`opis`/`dane`/`init`,
dodaj markup ekranu w `index.html` i wpis `<script>`. Zobacz komentarze w szablonie.
