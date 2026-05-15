# Projektverwaltung_WTF

Professionelle Erstversion einer zentralen Büro-Plattform für Architektur- und Ingenieurbüros in der Baubranche.

Die Anwendung ist als lokale Windows-Desktop-App umgesetzt. Sie installiert eine eigene `Projektverwaltung_WTF.exe`, startet in einem eigenen Fenster und bringt die benötigte Runtime für den Einzelplatzbetrieb mit. Abgebildet werden die wichtigsten Domänen: Projekte, Mitarbeiter, Arbeitszeiten, Angebote, HOAI-orientierte Honorarkalkulation, Verträge, Nachträge, Abrechnung, Dokumente, Pläne, Berechnungen, Schriftverkehr, Protokolle, Aktennotizen, Handlungsempfehlungen, Aufgaben, Fristen, Terminpläne, Controlling, Benutzerrechte, Backup, Lizenzierung und spätere KI-/API-Anbindungen.

## Start

Für die normale Nutzung die Windows-Setup-Datei herunterladen und ausführen:

[Projektverwaltung_WTF_Setup_Einzelplatz.exe](dist/Projektverwaltung_WTF_Setup_Einzelplatz.exe)

Die Installation erfolgt per-user nach `%LOCALAPPDATA%\Projektverwaltung_WTF`, erstellt Desktop- und Startmenü-Verknüpfungen und startet die Anwendung als richtige Windows-App mit eigenem Fenster. Die App läuft nicht als normaler Browser-Tab.

Aktuelle Version: `26.05.15.003.DEV.BETA`

Beim Start prüft die App automatisch, ob unter `update.json` eine neuere Version veröffentlicht wurde. Falls ein Update verfügbar ist, fragt die App per Popup nach, lädt nach Bestätigung die neue Setup-Datei herunter und startet die Installation. Zusätzlich gibt es in der App unter `Hilfe > Nach Updates suchen` eine manuelle Prüfung.

Die Anwendung enthält eine kontextbezogene Hilfe. Sie kann in der Windows-App über `Hilfe > Kontextbezogene Hilfe`, über die Hilfe-Schaltfläche in der Multifunktionsleiste oder per `F1` ein- und ausgeblendet werden.

Hinweis: Diese Version ist eine Developer Beta. Setup und App zeigen deshalb eine Risiko-Bestätigung an. Die Setup-EXE ist aktuell nicht code-signiert. Windows kann deshalb eine SmartScreen-Warnung anzeigen; dieser Windows-Hinweis kann technisch erst durch Code-Signing und wachsende Publisher-Reputation zuverlässig reduziert werden.

## Web-Demo und RPi-Sync

Die Oberfläche kann auch als Demo-Webversion auf einer Internetseite bereitgestellt werden. Für eine öffentliche Homepage-Demo sollte nur der statische Demo-Modus verwendet werden, damit Besucher keine produktiven Daten auf einem öffentlichen Server speichern.

Für Büro-/Unterwegsbetrieb ist ein Raspberry Pi oder Linux-Server als Sync-Ziel vorbereitet. Die App hat unter `Einstellungen` eine IP-/Netzwerksuche, Verbindungstest sowie gezieltes Hochladen und Laden des Projektstands. Details stehen in [docs/WEB_DEMO_RPI_SYNC.md](docs/WEB_DEMO_RPI_SYNC.md).

## Entwicklung

Die Desktop-App und die Setup-EXE können lokal neu gebaut werden:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\installer\build-setup.ps1
```

Das Ergebnis liegt danach hier:

```text
dist\Projektverwaltung_WTF_Setup_Einzelplatz.exe
```

Für reine UI-/Server-Entwicklung kann die lokale Entwicklungsumgebung ohne Installer gestartet werden:

```powershell
.\start.cmd
```

Falls `node server.mjs` nicht funktioniert, ist Node.js nicht im Windows-PATH. `start.cmd` sucht automatisch nach einer vorhandenen Runtime.

Dieser lokale Start ist nur für Entwicklung und Fehlersuche gedacht. Für Anwender ist die Windows-Setup-EXE der richtige Weg.

## Aktueller Umfang

- Zentrales Dashboard mit Portfolio-KPIs, aktivem Projekt, Fristen, Aufgaben und Handlungsempfehlungen.
- Kontextabhängige Multifunktionsleiste mit Datei-, Projekt-, Team-, Aufgaben- und Dokumentaktionen.
- Projektakte mit Projektanlage, Bearbeitung, Duplizieren, Löschen, Leistungsstand, Honorar, Stundenverbrauch, Risiko, Auftraggeber und Tags.
- Mitarbeiter-, Benutzer- und Zeiterfassung mit lokalen Buchungen und Rollenbezug.
- Projektdateien nativ öffnen und speichern in der Windows-App; Browser-Fallback per JSON-Export/-Import.
- Dokumente und Pläne registrieren und mit lokalen Dateipfaden verknüpfen.
- HOAI-orientierte Angebots- und Honorarmaske mit Leistungsbild, Honorarzone, Leistungsphasen, Nebenkosten und Nachlass.
- Vertrags-, Nachtrags- und Abrechnungsübersicht.
- Dokumenten- und Planliste mit Revision, Status und Verantwortlichen.
- Schriftverkehr, Protokolle und Aktennotizen.
- Aufgabenboard, Fristenliste und Terminplan.
- Projektcontrolling mit Forecast, offenen Honoraren, externen Kosten und Risikoprojekten.
- Rollenmatrix, Backup-Status, Lizenzmodelle und Integrationsplanung.
- Lokale Speicherung im Browser und JSON-Export.

## Wichtige fachliche Setzung

Die Honorarkalkulation ist bewusst konfigurierbar und nicht als verbindliche Rechts- oder Steuerberatung implementiert. Für eine kommerzielle Version müssen HOAI-Tabellen, Vertragslogik, Umsatzsteuer, Archivierung und Rechnungslegung fachlich und rechtlich validiert werden.

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
    WEB_DEMO_RPI_SYNC.md
  database/
    schema.sql
  rpi/
    install-rpi-server.sh
    projektverwaltung-wtf.service
```

## Nächste technische Ausbaustufe

1. Backend mit PostgreSQL oder SQLite-Sync-Schicht einführen.
2. Authentifizierung, Mandanten, Rollen und Audit-Log produktiv machen.
3. Dokumentenspeicher mit Versionierung und Volltextsuche anbinden.
4. Rechnungs- und Vertragsmodul mit prüfbaren Workflows ausbauen.
5. Desktop-Verpackung für Einzelplatzbetrieb und Server-Sync für Mehrplatzbetrieb ergänzen.
6. KI-Assistent über dokumentierte API-Schicht anbinden.
