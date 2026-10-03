# school-utils

Kleine browserbasierte Hilfsseiten für den Schulalltag. Der **Klammer-Rechner** ist die erste veröffentlichte Seite.

## Lokal ausführen

```sh
npm test
npm run build
```

Danach kann `dist/index.html` direkt im Browser geöffnet werden. Das Veröffentlichen nutzt dieselben Dateien aus `dist/`.

## GitHub Pages

Der Workflow unter `.github/workflows/pages.yml` testet und baut bei jedem Push auf `main` und veröffentlicht `dist/`. Im GitHub-Repository muss unter **Settings → Pages → Build and deployment** die Quelle **GitHub Actions** ausgewählt sein. Danach ist die Übung unter der Repository-Pages-Adresse und zusätzlich unter `/klammer-rechner.html` erreichbar.

## Projektstruktur

- `site/klammer-rechner.html` – Seitenaufbau und Gestaltung
- `src/klammer-rechner.js` – Aufgabenlogik und Browser-Verhalten
- `tests/` – Tests für Primfaktorzerlegung und Aufgabenerzeugung
- `scripts/build.js` – erzeugt das veröffentlichbare `dist/`-Verzeichnis
