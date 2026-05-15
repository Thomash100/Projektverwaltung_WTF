# Architektur

## Zielbild

Projektverwaltung_WTF soll langfristig als kommerzielle Büro-Plattform funktionieren. Die erste Version ist bewusst lokal und einfach startbar, aber entlang einer Architektur geschnitten, die später Backend, Desktop-App, Mehrplatzbetrieb und API-Anbindungen aufnehmen kann.

## Schichten

```mermaid
flowchart TD
  UI["Web/Desktop UI"] --> App["Application Services"]
  App --> Domain["Domain Model"]
  App --> Documents["Document Service"]
  App --> Billing["Billing & Honorar Service"]
  App --> Auth["Auth, Roles, Audit"]
  Domain --> Database["SQL Database"]
  Documents --> ObjectStore["Encrypted File/Object Store"]
  Billing --> Accounting["Accounting Export"]
  App --> API["REST/GraphQL API"]
  API --> AI["AI Assistants"]
```

## Frontend

- Aktuell: Vanilla HTML/CSS/JavaScript ohne externe Abhängigkeiten.
- Ziel: React/Vue/Svelte oder Tauri/Electron-Frontend, sobald die Produktlogik stabiler ist.
- UI-Prinzip: Arbeitsoberfläche statt Landingpage, dichte Informationen, kurze Wege, klare Projektakte.

## Backend

Empfohlener Ausbau:

- API: TypeScript/Node, .NET oder Python/FastAPI.
- Datenbank: PostgreSQL für Mehrplatzbetrieb, SQLite für Einzelplatz/offline.
- Dateien: lokaler verschlüsselter Speicher plus S3-kompatibles Offsite-Backup.
- Suche: PostgreSQL Full Text oder OpenSearch später.
- Jobs: Backup, Lizenzprüfung, Fristenmonitor, Dokumentenindexierung.

## Einzelplatz und Mehrplatz

Einzelplatz:

- Lokale Datenbank.
- Lokaler Dateispeicher.
- Aktivierbare Lizenzdatei.
- Optionales verschlüsseltes Backup.

Mehrplatz:

- Zentraler Server oder gehostete Instanz.
- Rollen, Mandanten, Sperren und Audit-Log.
- Konfliktarme Synchronisation für mobile/offline Clients.
- Protokollierte Änderungen an Honoraren, Verträgen und Rechnungen.

## KI/API

Die KI-Anbindung sollte nicht direkt auf Rohdaten zugreifen. Empfohlen ist eine Service-Schicht mit:

- expliziten Nutzerrechten,
- dokumentierten Tool-Endpunkten,
- Datenminimierung,
- Audit-Log für KI-Aktionen,
- Freigabe-Workflow für externe Kommunikation und Vertragsinhalte.
