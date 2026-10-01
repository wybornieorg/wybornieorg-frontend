# wybornie.org — frontend

Aplikacja kliencka strony [wybornie.org](https://wybornie.org) — pozwala
zagłosować na projekty ustaw tak jak poseł, a następnie pokazuje, z którymi
posłami użytkownik zgadza się najbardziej.

Dane pobierane są z API: [wybornieorg-backend](../wybornieorg-backend).

## Stack

Zmodernizowane z Vue 2 + vue-cli 3 na:

- **Vue 3** + `<script>` Options API (bez przepisywania na Composition API)
- **Vite** (zamiast vue-cli / webpack)
- **Pinia** (zamiast Vuex)
- **vue-router 4** (hash history — linki `#/wczytaj/...` są współdzielone)
- **floating-vue** (zamiast `v-tooltip` 2)
- **FontAwesome 7** (`@fortawesome/*`) — rejestrowane są tylko używane ikony
- **dart-sass** (zamiast `node-sass`)
- `moment` (z aliasem na build `moment-with-locales`, patrz niżej)

## Wymagania

- Node.js **>= 20** (testowane na Node 26)

## Uruchomienie

```bash
npm install
npm run dev       # serwer deweloperski -> http://localhost:5173
npm run build     # produkcyjny build do ./dist
npm run preview   # podgląda zbudowany ./dist
```

W trybie deweloperskim aplikacja uderza w API pod `http://localhost:3000`
(czyli odpal najpierw backend).

## Adres API

Kolejność ustalania adresu API:

1. `VITE_API_URL` (jeśli ustawione),
2. `http://localhost:3000` w trybie `dev`,
3. `https://api.wybornie.org` w buildzie produkcyjnym.

Przykład produkcyjnego builda wskazującego na lokalne API:

```bash
VITE_API_URL=http://localhost:3000 npm run build
```

## Struktura

```
index.html            # szablon Vite (był: public/index.html)
vite.config.js        # aliasy, zmienne SCSS, alias moment
public/               # assety kopiowane 1:1 (img, fonty, manifest.json)
src/
  main.js             # bootstrap: Pinia, router, floating-vue, FA, moment
  router.js           # trasy (hash history)
  store.js            # magazyn Pinia (głosy, cache głosowań, API)
  App.vue             # style globalne + motywy floating-vue
  views/              # Home, MainApp, Loading, NotFound
  components/         # Voting, VotingsList(+Item), Deputies, Stats...
```

## Kadencje

Lista kadencji w filtrach nie jest już zapisana na sztywno — pobierana jest z
`/dev/kadencje`, więc nowa kadencja pojawia się automatycznie, gdy tylko
backend ma dla niej dane. Aplikacja domyślnie otwiera najnowszą dostępną
kadencję. Zapasowa lista (`[3..10]`) używana jest tylko wtedy, gdy to
zapytanie się nie powiedzie.

## Deploy

Build jest statyczny (SPA + hash routing), więc wystarczy wrzucić `dist/` do
repozytorium `wybornieorg.github.io` (GitHub Pages, CNAME: `wybornie.org`).

## Dwie rzeczy, o których warto wiedzieć

- **`moment`** — pliki lokalizacji są UMD i robią `require('../moment')`, przez
  co bundler potrafi dać im własną kopię momentu i `moment.locale('pl')`
  cicho nic nie robi. Dlatego w `vite.config.js` alias `moment` wskazuje na
  `moment/min/moment-with-locales.js`. Jeśli kiedyś zmienisz na `dayjs`,
  pamiętaj o analogicznej pułapce.
- **`floating-vue`** — motyw `popover` jest zdefiniowany w `main.js` jako
  rozszerzenie wbudowanego `dropdown` (dziedziczy m.in. trigger `click`).
  Zawartość popovera wstawia się w slot **`#popper`** (nie `#popover`, jak
  było w `v-tooltip` 2).

## Znane braki

- Service worker / PWA nie jest podłączony (stary `register-service-worker`
  zastąpiony no-opem). Żeby wrócić do offline: dodać `vite-plugin-pwa`.
- Podstrona „O stronie" była w starym kodzie martwa (komponent `about` nie
  istniał) i została usunięta.
