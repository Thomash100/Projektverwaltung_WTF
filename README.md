# Projektverwaltung_WTF

Professionelle Erstversion einer zentralen Buero-Plattform fuer Architektur- und Ingenieurburos in der Baubranche.

Die Anwendung ist als lokale, abhaengigkeitsfreie Web-App umgesetzt. Sie kann sofort gestartet werden und bildet die wichtigsten Domaenen ab: Projekte, Mitarbeiter, Arbeitszeiten, Angebote, HOAI-orientierte Honorarkalkulation, Vertraege, Nachtraege, Abrechnung, Dokumente, Plaene, Berechnungen, Schriftverkehr, Protokolle, Aktennotizen, Handlungsempfehlungen, Aufgaben, Fristen, Terminplaene, Controlling, Benutzerrechte, Backup, Lizenzierung und spaetere KI/API-Anbindungen.

## Start

```powershell
cd "D:\Users\ThomasHofmann\Documents\New project\Projektverwaltung_WTF"
node server.mjs
```

Danach im Browser oeffnen:

```text
http://localhost:4173
```

Alternativ kann `index.html` direkt geoeffnet werden. Der lokale Server ist fuer spaetere API- und Desktop-Integration aber der bessere Weg.

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
