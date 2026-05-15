# Sicherheit, Rechte und Betrieb

## Sicherheitsziele

- Vertraulichkeit von Projekt-, Honorar-, Vertrags- und Personaldaten.
- Nachvollziehbarkeit von Aenderungen.
- Trennung von Rollen und Mandanten.
- Wiederherstellbare Backups.
- Kontrollierte Synchronisation zwischen Einzelplatz und Mehrplatzbetrieb.

## Mindeststandard fuer eine kommerzielle Version

- Verschluesselung ruhender Daten fuer lokale Datenbank und Dokumentenspeicher.
- TLS fuer jede Netzwerksynchronisation.
- Passwort-Hashing mit Argon2id oder vergleichbarem Standard.
- Rollenbasierte Rechte mit projektbezogenen Freigaben.
- Audit-Log fuer Login, Rechte, Honorare, Vertraege, Rechnungen, Exporte und KI-Aktionen.
- Wiederherstellungstest fuer Backups, nicht nur Backup-Erstellung.
- Lizenzpruefung ohne Abhaengigkeit von dauerhafter Online-Verbindung.

## Rollen

- Bueroleitung: Mandant, Rechte, Honorare, Controlling, Abrechnung.
- Projektleitung: eigene Projekte, Aufgaben, Dokumente, Schriftverkehr, Projektbudget.
- Bearbeitung: zugeordnete Projekte, Zeiten, Aufgaben, Dokumente ohne Honorare.
- Controlling: projektuebergreifende Auswertungen und Abrechnungssicht.
- Externe: spaeter nur Portalzugriff mit expliziter Freigabe.

## KI-Grenzen

KI-Funktionen duerfen keine verbindlichen Vertrags-, Honorar- oder Rechtsentscheidungen automatisch ausloesen. Jede externe Nachricht, jede Rechnung und jeder Nachtrag braucht vor Versand eine menschliche Freigabe.
