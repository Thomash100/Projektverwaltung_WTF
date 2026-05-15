# Datenmodell

## Kernobjekte

- `Project`: Projektstamm, Auftraggeber, Leistungsbild, Phasen, Budget, Risiko, Status.
- `Employee`: Mitarbeiter, Rolle, Stundensatz, Auslastung, Rechte.
- `TimeEntry`: Zeitbuchung mit Projekt, Phase, Taetigkeit, Abrechenbarkeit.
- `Offer`: Angebot, Honorarbasis, Leistungsphasen, Nebenkosten, Nachlass.
- `Contract`: Vertrag, Version, Beauftragungsstand, Abrechnungsart.
- `Addendum`: Nachtrag, Betrag, Status, Bindefrist.
- `Invoice`: Rechnung, Leistungsstand, Zahlung, Mahnung.
- `Document`: Datei, Revision, Status, Verantwortlicher, Projektbezug.
- `Correspondence`: E-Mail, Protokoll, Aktennotiz oder Entscheidung.
- `Task`: Aufgabe mit Frist, Status, Verantwortlichem und Bereich.
- `Milestone`: Terminplan und verbindliche Fristen.
- `Role`: Berechtigungsprofil.
- `AuditLog`: protokollierte sicherheits- und abrechnungsrelevante Aenderungen.

## Beziehungen

```mermaid
erDiagram
  PROJECT ||--o{ TIME_ENTRY : has
  PROJECT ||--o{ TASK : has
  PROJECT ||--o{ DOCUMENT : has
  PROJECT ||--o{ CONTRACT : has
  PROJECT ||--o{ ADDENDUM : has
  PROJECT ||--o{ CORRESPONDENCE : has
  PROJECT ||--o{ MILESTONE : has
  EMPLOYEE ||--o{ TIME_ENTRY : books
  EMPLOYEE ||--o{ TASK : owns
  CONTRACT ||--o{ INVOICE : bills
  ROLE ||--o{ EMPLOYEE : assigned
```

## Prinzipien

- Finanzdaten und Vertragsdaten sind versioniert.
- Dokumente werden nicht ueberschrieben, sondern revisioniert.
- Rollen steuern Sichtbarkeit und Aktionen getrennt.
- KI-Funktionen erhalten nur den minimal noetigen Kontext.
- Alle produktiven Aenderungen an Honorar, Vertrag, Rechnung und Rechten gehoeren ins Audit-Log.
