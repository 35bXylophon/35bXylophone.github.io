# DIGI-CO Quickcheck Builder

Dieses Paket macht den DIGI-CO Quickcheck konfigurierbar. Das originale Design bleibt erhalten, aber Fragen, Scoring, Empfehlungen, Partnertexte und Thresholds werden über `config.json` gesteuert.

## Dateien

```text
index.html      Öffentlicher Quickcheck
admin.html      Eingabemaske / Builder
style.css       Gemeinsames Design
script.js       Dynamischer Fragebogen
builder.js      Logik für die Eingabemaske
config.json     Zentrale Konfiguration
```

## Nutzung mit GitHub Pages

1. Alle Dateien ins Repository hochladen.
2. GitHub Pages aktivieren.
3. `index.html` ist der öffentliche Quickcheck.
4. `admin.html` ist die Bearbeitungsoberfläche.

## Workflow

1. `admin.html` öffnen.
2. Fragen, Blöcke, Scoring, Empfehlungen bearbeiten.
3. `config.json herunterladen` klicken.
4. Die heruntergeladene Datei im Repository ersetzen.

## Vorschau

Im Builder kann mit `Vorschau im Quickcheck speichern` eine lokale Browser-Vorschau gespeichert werden. Diese landet nur im LocalStorage des Browsers und verändert noch nicht die Repository-Datei.

## Scoring-Logik

- Skala: 1 bis 4.
- KI-Fragen werden je Block erst sichtbar, wenn alle Digitalfragen des Blocks mindestens den konfigurierten Schwellenwert erreichen.
- Ergebnisse werden erst angezeigt, wenn alle sichtbaren Pflichtfragen beantwortet wurden.
- KI-Reifegrad wird gegen alle konfigurierten KI-Fragen gerechnet, nicht nur gegen die sichtbaren KI-Fragen.

## Weitere Quickchecks

Für neue Fragebögen muss nur die `config.json` angepasst oder über den Builder neu erstellt werden.
