# Sicherheit, Rechte und Betrieb

## Sicherheitsziele

- Vertraulichkeit von Projekt-, Honorar-, Vertrags- und Personaldaten.
- Nachvollziehbarkeit von Änderungen.
- Trennung von Rollen und Mandanten.
- Wiederherstellbare Backups.
- Kontrollierte Synchronisation zwischen Einzelplatz und Mehrplatzbetrieb.

## Mindeststandard für eine kommerzielle Version

- Verschlüsselung ruhender Daten für lokale Datenbank und Dokumentenspeicher.
- TLS für jede Netzwerksynchronisation.
- Passwort-Hashing mit Argon2id oder vergleichbarem Standard.
- Rollenbasierte Rechte mit projektbezogenen Freigaben.
- Audit-Log für Login, Rechte, Honorare, Verträge, Rechnungen, Exporte und KI-Aktionen.
- Wiederherstellungstest für Backups, nicht nur Backup-Erstellung.
- Lizenzprüfung ohne Abhängigkeit von dauerhafter Online-Verbindung.

## Rollen

- Büroleitung: Mandant, Rechte, Honorare, Controlling, Abrechnung.
- Projektleitung: eigene Projekte, Aufgaben, Dokumente, Schriftverkehr, Projektbudget.
- Bearbeitung: zugeordnete Projekte, Zeiten, Aufgaben, Dokumente ohne Honorare.
- Controlling: projektübergreifende Auswertungen und Abrechnungssicht.
- Externe: später nur Portalzugriff mit expliziter Freigabe.

## KI-Grenzen

KI-Funktionen dürfen keine verbindlichen Vertrags-, Honorar- oder Rechtsentscheidungen automatisch auslösen. Jede externe Nachricht, jede Rechnung und jeder Nachtrag braucht vor Versand eine menschliche Freigabe.
