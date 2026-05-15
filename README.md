# Projektverwaltung_WTF

Professionelle Erstversion einer zentralen Buero-Plattform fuer Architektur- und Ingenieurburos in der Baubranche.

Die Anwendung ist als lokale Windows-Desktop-App umgesetzt. Sie installiert eine eigene `Projektverwaltung_WTF.exe`, startet in einem eigenen Fenster und bringt die benoetigte Runtime fuer den Einzelplatzbetrieb mit. Abgebildet werden die wichtigsten Domaenen: Projekte, Mitarbeiter, Arbeitszeiten, Angebote, HOAI-orientierte Honorarkalkulation, Vertraege, Nachtraege, Abrechnung, Dokumente, Plaene, Berechnungen, Schriftverkehr, Protokolle, Aktennotizen, Handlungsempfehlungen, Aufgaben, Fristen, Terminplaene, Controlling, Benutzerrechte, Backup, Lizenzierung und spaetere KI-/API-Anbindungen.

## Start

Fuer die normale Nutzung die Windows-Setup-Datei herunterladen und ausfuehren:

[Projektverwaltung_WTF_Setup_Einzelplatz.exe](dist/Projektverwaltung_WTF_Setup_Einzelplatz.exe)

Die Installation erfolgt per-user nach `%LOCALAPPDATA%\Projektverwaltung_WTF`, erstellt Desktop- und Startmenue-Verknuepfungen und startet die Anwendung als richtige Windows-App mit eigenem Fenster. Die App laeuft nicht als normaler Browser-Tab.

Hinweis: Die Setup-EXE ist aktuell nicht code-signiert. Windows kann deshalb eine SmartScreen-Warnung anzeigen.

## Entwicklung

Die Desktop-App und die Setup-EXE koennen lokal neu gebaut werden:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\installer\build-setup.ps1
```

Das Ergebnis liegt danach hier:

```text
dist\Projektverwaltung_WTF_Setup_Einzelplatz.exe
```

Fuer reine UI-/Server-Entwicklung kann die lokale Entwicklungsumgebung ohne Installer gestartet werden:

```powershell
.\start.cmd
```

Falls `node server.mjs` nicht funktioniert, ist Node.js nicht im Windows-PATH. `start.cmd` sucht automatisch nach einer vorhandenen Runtime.

Dieser lokale Start ist nur fuer Entwicklung und Fehlersuche gedacht. Fuer Anwender ist die Windows-Setup-EXE der richtige Weg.

## Aktueller Umfang

- Zentrales Dashboard mit Portfolio-KPIs, aktivem Projekt, Fristen, Aufgaben und Handlungsempfehlungen.
- Projektakte mit Leistungsstand, Honorar, Stundenverbrauch, Risiko, Auftraggeber und Tags.
- Mitarbeiter- und Zeiterfassung mit lokalen Buchungen.
- HOAI-orientierte Angebots- und Honorarmaske mit Leistungsbild, Honorarzone, Leistungsphasen, Nebenkosten und Nachlass.
- Vertrags-, Nachtrags- und Abrechnungsuebersicht.
- Dokumenten- und Planliste mit Revision, Status und Verantwortlichen.
- Schriftverkehr, Protokolle und Aktennotizen.
- Aufgabenboard, Fristenliste und Terminplan.
- Projektcontrolling mit Forecast, offenen Honoraren, externen Kosten und Risikoprojekten.
- Rollenmatrix, Backup-Status, Lizenzmodelle und Integrationsplanung.
- Lokale Speicherung im Browser und JSON-Export.

## Wichtige fachliche Setzung

Die Honorarkalkulation ist bewusst konfigurierbar und nicht als verbindliche Rechts- oder Steuerberatung implementiert. Fuer eine kommerzielle Version muessen HOAI-Tabellen, Vertragslogik, Umsatzsteuer, Archivierung und Rechnungslegung fachlich und rechtlich validiert werden.

## Projektstruktur

```text
Projektverwaltung_WTF/
  index.html
  server.mjs
  src/
    app.js
    data.js
    styles.css
  docs/
    ARCHITECTURE.md
    DATA_MODEL.md
    ROADMAP.md
    SECURITY.md
  database/
    schema.sql
```

## Naechste technische Ausbaustufe

1. Backend mit PostgreSQL oder SQLite-Sync-Schicht einfuehren.
2. Authentifizierung, Mandanten, Rollen und Audit-Log produktiv machen.
3. Dokumentenspeicher mit Versionierung und Volltextsuche anbinden.
4. Rechnungs- und Vertragsmodul mit pruefbaren Workflows ausbauen.
5. Desktop-Verpackung fuer Einzelplatzbetrieb und Server-Sync fuer Mehrplatzbetrieb ergaenzen.
6. KI-Assistent ueber dokumentierte API-Schicht anbinden.
