export const seedData = {
  office: {
    name: "Projektverwaltung_WTF",
    legalName: "Werkzeuge Termine Finanzen GmbH",
    tenantId: "wtf-demo-tenant",
    locale: "de-DE",
    currency: "EUR",
    currentUser: "Thomas Hofmann",
    fiscalYear: 2026,
    backupTarget: "Lokaler Tresor + S3-kompatibler Speicher",
    syncMode: "Einzelplatz aktiv, Mehrplatz vorbereitet"
  },
  projects: [
    {
      id: "P-24017",
      number: "24-017",
      name: "Neubau Feuerwache Nord",
      client: "Stadt Nordheim",
      address: "Industriestraße 18, 74172 Nordheim",
      discipline: "Objektplanung Gebäude",
      phase: "LPH 5 Ausführungsplanung",
      status: "in Arbeit",
      risk: "mittel",
      priority: "hoch",
      manager: "Lena Vogt",
      deputy: "Murat Aydin",
      start: "2025-11-03",
      due: "2026-08-28",
      budgetFee: 438000,
      contractedFee: 421500,
      invoiced: 218600,
      paid: 183400,
      chargeableCosts: 8650000,
      externalCosts: 82000,
      hoursBudget: 2860,
      hoursActual: 1718,
      progress: 58,
      marginTarget: 24,
      marginForecast: 19,
      tags: ["kommunal", "brandschutz", "lp5"]
    },
    {
      id: "P-25004",
      number: "25-004",
      name: "Sanierung Berufskolleg West",
      client: "Kreisbauverwaltung West",
      address: "Schulweg 9, 50668 Köln",
      discipline: "TGA Elektro",
      phase: "LPH 3 Entwurfsplanung",
      status: "kritisch",
      risk: "hoch",
      priority: "hoch",
      manager: "Jasmin Keller",
      deputy: "Oskar Brandt",
      start: "2026-01-12",
      due: "2026-07-17",
      budgetFee: 312000,
      contractedFee: 296400,
      invoiced: 76200,
      paid: 76200,
      chargeableCosts: 3920000,
      externalCosts: 56000,
      hoursBudget: 1940,
      hoursActual: 1311,
      progress: 37,
      marginTarget: 22,
      marginForecast: 11,
      tags: ["sanierung", "schule", "tga"]
    },
    {
      id: "P-25009",
      number: "25-009",
      name: "Wohnquartier am Park",
      client: "Bauwert Rhein GmbH",
      address: "Parkallee 42, 40474 Düsseldorf",
      discipline: "Tragwerksplanung",
      phase: "LPH 4 Genehmigungsplanung",
      status: "in Arbeit",
      risk: "niedrig",
      priority: "mittel",
      manager: "Murat Aydin",
      deputy: "Nora Stein",
      start: "2026-02-02",
      due: "2026-09-30",
      budgetFee: 522000,
      contractedFee: 487000,
      invoiced: 126500,
      paid: 98200,
      chargeableCosts: 18400000,
      externalCosts: 121000,
      hoursBudget: 3140,
      hoursActual: 1064,
      progress: 42,
      marginTarget: 26,
      marginForecast: 28,
      tags: ["wohnungsbau", "tragwerk", "lp4"]
    },
    {
      id: "P-25013",
      number: "25-013",
      name: "Laborgebäude BioTech Campus",
      client: "BioTech Campus AG",
      address: "Forschungsring 3, 69120 Heidelberg",
      discipline: "Projektsteuerung",
      phase: "Stufe 2 Planung",
      status: "angebot",
      risk: "mittel",
      priority: "mittel",
      manager: "Nora Stein",
      deputy: "Jasmin Keller",
      start: "2026-05-20",
      due: "2027-02-19",
      budgetFee: 688000,
      contractedFee: 0,
      invoiced: 0,
      paid: 0,
      chargeableCosts: 31400000,
      externalCosts: 0,
      hoursBudget: 4100,
      hoursActual: 118,
      progress: 8,
      marginTarget: 27,
      marginForecast: 25,
      tags: ["angebot", "labor", "pm"]
    }
  ],
  employees: [
    {
      id: "E-01",
      name: "Lena Vogt",
      role: "Projektleiterin",
      team: "Architektur",
      weeklyHours: 38,
      costRate: 74,
      billRate: 128,
      utilization: 86,
      rights: "Projektleitung"
    },
    {
      id: "E-02",
      name: "Murat Aydin",
      role: "Senior Tragwerksplaner",
      team: "Tragwerk",
      weeklyHours: 40,
      costRate: 82,
      billRate: 136,
      utilization: 79,
      rights: "Projektleitung"
    },
    {
      id: "E-03",
      name: "Jasmin Keller",
      role: "TGA-Fachplanerin",
      team: "TGA",
      weeklyHours: 36,
      costRate: 78,
      billRate: 132,
      utilization: 91,
      rights: "Bearbeitung"
    },
    {
      id: "E-04",
      name: "Nora Stein",
      role: "Controlling",
      team: "Büroleitung",
      weeklyHours: 32,
      costRate: 70,
      billRate: 118,
      utilization: 68,
      rights: "Controlling"
    },
    {
      id: "E-05",
      name: "Oskar Brandt",
      role: "Bauzeichner",
      team: "CAD/BIM",
      weeklyHours: 40,
      costRate: 48,
      billRate: 86,
      utilization: 74,
      rights: "Bearbeitung"
    }
  ],
  users: [
    {
      id: "U-01",
      name: "Thomas Hofmann",
      employeeId: "E-04",
      email: "thomas.hofmann@example.local",
      role: "Büroleitung",
      status: "aktiv",
      lastLogin: "2026-05-15"
    },
    {
      id: "U-02",
      name: "Lena Vogt",
      employeeId: "E-01",
      email: "lena.vogt@example.local",
      role: "Projektleitung",
      status: "aktiv",
      lastLogin: "2026-05-14"
    },
    {
      id: "U-03",
      name: "Jasmin Keller",
      employeeId: "E-03",
      email: "jasmin.keller@example.local",
      role: "Bearbeitung",
      status: "aktiv",
      lastLogin: "2026-05-13"
    }
  ],
  tasks: [
    {
      id: "T-101",
      projectId: "P-24017",
      title: "Positionspläne mit Brandschutzabgleich einfrieren",
      assignee: "Oskar Brandt",
      status: "in Arbeit",
      due: "2026-05-18",
      priority: "hoch",
      area: "Planung"
    },
    {
      id: "T-102",
      projectId: "P-25004",
      title: "Kostenberechnung nach Fachlos Elektro aktualisieren",
      assignee: "Jasmin Keller",
      status: "offen",
      due: "2026-05-20",
      priority: "hoch",
      area: "Honorar"
    },
    {
      id: "T-103",
      projectId: "P-25009",
      title: "Prüfstatiker-Kommentare in Nachweisheft einarbeiten",
      assignee: "Murat Aydin",
      status: "in Arbeit",
      due: "2026-05-24",
      priority: "mittel",
      area: "Berechnung"
    },
    {
      id: "T-104",
      projectId: "P-25013",
      title: "Angebotsvariante mit beschleunigter Stufe 1 erstellen",
      assignee: "Nora Stein",
      status: "offen",
      due: "2026-05-22",
      priority: "mittel",
      area: "Angebot"
    },
    {
      id: "T-105",
      projectId: "P-24017",
      title: "Jour-fixe-Protokoll verteilen und Entscheidungen markieren",
      assignee: "Lena Vogt",
      status: "erledigt",
      due: "2026-05-13",
      priority: "normal",
      area: "Schriftverkehr"
    }
  ],
  deadlines: [
    {
      id: "D-301",
      projectId: "P-24017",
      title: "Abgabe Ausführungsplanung Bauteil A",
      date: "2026-05-29",
      type: "Planlieferung",
      binding: true
    },
    {
      id: "D-302",
      projectId: "P-25004",
      title: "Lenkungskreis Sanierung",
      date: "2026-05-26",
      type: "Termin",
      binding: true
    },
    {
      id: "D-303",
      projectId: "P-25009",
      title: "Genehmigungsunterlagen Bauherr",
      date: "2026-06-05",
      type: "Freigabe",
      binding: true
    },
    {
      id: "D-304",
      projectId: "P-25013",
      title: "Bindefrist Angebot",
      date: "2026-06-14",
      type: "Angebot",
      binding: false
    }
  ],
  timeEntries: [
    {
      id: "Z-9001",
      date: "2026-05-12",
      projectId: "P-24017",
      employee: "Lena Vogt",
      phase: "LPH 5",
      activity: "Planprüfung und Koordination",
      hours: 6.5,
      billable: true
    },
    {
      id: "Z-9002",
      date: "2026-05-13",
      projectId: "P-25004",
      employee: "Jasmin Keller",
      phase: "LPH 3",
      activity: "Kostenermittlung Elektro",
      hours: 7.25,
      billable: true
    },
    {
      id: "Z-9003",
      date: "2026-05-13",
      projectId: "P-25009",
      employee: "Murat Aydin",
      phase: "LPH 4",
      activity: "Statische Vorbemessung",
      hours: 5.75,
      billable: true
    },
    {
      id: "Z-9004",
      date: "2026-05-14",
      projectId: "P-25013",
      employee: "Nora Stein",
      phase: "Akquise",
      activity: "Angebotsstrategie",
      hours: 3.5,
      billable: false
    }
  ],
  contracts: [
    {
      id: "V-501",
      projectId: "P-24017",
      title: "Architektenvertrag Objektplanung",
      version: "2.1",
      signed: "2025-11-21",
      netFee: 421500,
      billingMode: "Leistungsstand",
      status: "aktiv"
    },
    {
      id: "V-502",
      projectId: "P-25004",
      title: "Fachplanungsvertrag TGA Elektro",
      version: "1.4",
      signed: "2026-01-29",
      netFee: 296400,
      billingMode: "Meilenstein",
      status: "aktiv"
    },
    {
      id: "V-503",
      projectId: "P-25013",
      title: "Angebot Projektsteuerung",
      version: "0.8",
      signed: "",
      netFee: 688000,
      billingMode: "Pauschal + Option",
      status: "in Verhandlung"
    }
  ],
  addenda: [
    {
      id: "N-710",
      projectId: "P-24017",
      title: "Nachtrag 01 - geänderte Fahrzeughalle",
      amount: 38600,
      status: "angeboten",
      due: "2026-05-31"
    },
    {
      id: "N-711",
      projectId: "P-25004",
      title: "Nachtrag 02 - zusätzliche Bestandsaufnahme",
      amount: 18400,
      status: "beauftragt",
      due: "2026-06-03"
    },
    {
      id: "N-712",
      projectId: "P-25009",
      title: "Nachtrag 01 - Tiefgarage Variante B",
      amount: 42750,
      status: "in Prüfung",
      due: "2026-06-11"
    }
  ],
  documents: [
    {
      id: "DOC-1001",
      projectId: "P-24017",
      name: "FWN_A_LPH5_GR_2OG_240513.pdf",
      type: "Plan",
      revision: "C",
      owner: "Oskar Brandt",
      status: "freigegeben",
      updated: "2026-05-13"
    },
    {
      id: "DOC-1002",
      projectId: "P-25004",
      name: "BK-West_Kostenberechnung_ELT.xlsx",
      type: "Berechnung",
      revision: "B",
      owner: "Jasmin Keller",
      status: "in Arbeit",
      updated: "2026-05-14"
    },
    {
      id: "DOC-1003",
      projectId: "P-25009",
      name: "WQAP_Standsicherheitsnachweis_Rohbau.docx",
      type: "Berechnung",
      revision: "A",
      owner: "Murat Aydin",
      status: "Prüflauf",
      updated: "2026-05-10"
    },
    {
      id: "DOC-1004",
      projectId: "P-25013",
      name: "Angebot_BioTechCampus_Projektsteuerung.pdf",
      type: "Angebot",
      revision: "0.8",
      owner: "Nora Stein",
      status: "Entwurf",
      updated: "2026-05-14"
    }
  ],
  correspondence: [
    {
      id: "MAIL-4401",
      projectId: "P-24017",
      date: "2026-05-14",
      channel: "E-Mail",
      from: "Stadt Nordheim",
      subject: "Freigabe geänderte Fahrzeughalle",
      decision: "Entscheidung liegt vor",
      owner: "Lena Vogt"
    },
    {
      id: "PROT-222",
      projectId: "P-25004",
      date: "2026-05-13",
      channel: "Protokoll",
      from: "Lenkungskreis",
      subject: "Jour fixe Sanierung Berufskolleg",
      decision: "Kostenrahmen kritisch",
      owner: "Jasmin Keller"
    },
    {
      id: "AKT-031",
      projectId: "P-25009",
      date: "2026-05-12",
      channel: "Aktennotiz",
      from: "Intern",
      subject: "Variante Untergeschoss",
      decision: "Risiko Setzungen markieren",
      owner: "Murat Aydin"
    }
  ],
  recommendations: [
    {
      id: "HE-1",
      projectId: "P-25004",
      title: "Nachtrag für zusätzliche Bestandsaufnahme absichern",
      impact: "Honorar +18.400 EUR, Risiko Stundenüberlauf sinkt",
      urgency: "hoch"
    },
    {
      id: "HE-2",
      projectId: "P-24017",
      title: "LPH-5-Planlieferung vor interner Kollision prüfen",
      impact: "Vermeidet Revisionsschleife vor Abgabe",
      urgency: "mittel"
    },
    {
      id: "HE-3",
      projectId: "P-25013",
      title: "Angebot in zwei Optionen trennen",
      impact: "Bessere Vergleichbarkeit für Bauherr und Einkauf",
      urgency: "mittel"
    }
  ],
  schedule: [
    {
      projectId: "P-24017",
      phase: "LPH 5",
      start: "2026-03-02",
      end: "2026-08-28",
      progress: 64
    },
    {
      projectId: "P-25004",
      phase: "LPH 3",
      start: "2026-02-09",
      end: "2026-07-17",
      progress: 38
    },
    {
      projectId: "P-25009",
      phase: "LPH 4",
      start: "2026-04-06",
      end: "2026-09-30",
      progress: 44
    },
    {
      projectId: "P-25013",
      phase: "Angebot",
      start: "2026-05-01",
      end: "2026-06-14",
      progress: 21
    }
  ],
  roles: [
    {
      name: "Büroleitung",
      projects: "alle",
      finances: "voll",
      documents: "voll",
      admin: true
    },
    {
      name: "Projektleitung",
      projects: "zugeordnet",
      finances: "Projektbudget",
      documents: "voll",
      admin: false
    },
    {
      name: "Bearbeitung",
      projects: "zugeordnet",
      finances: "keine Honorare",
      documents: "lesen/schreiben",
      admin: false
    },
    {
      name: "Controlling",
      projects: "alle",
      finances: "voll",
      documents: "lesen",
      admin: false
    }
  ],
  backups: [
    {
      id: "B-1",
      target: "Lokaler verschlüsselter Tresor",
      lastRun: "2026-05-14 22:00",
      status: "ok",
      retention: "30 täglich / 12 monatlich"
    },
    {
      id: "B-2",
      target: "S3-kompatibler Offsite-Speicher",
      lastRun: "2026-05-14 22:15",
      status: "ok",
      retention: "90 Tage"
    }
  ],
  licenses: [
    {
      plan: "Einzelplatz",
      seats: 1,
      sync: "lokal",
      status: "aktiv"
    },
    {
      plan: "Team",
      seats: 10,
      sync: "Mehrplatz + Rechte",
      status: "vorbereitet"
    },
    {
      plan: "Enterprise",
      seats: 50,
      sync: "Mandanten + API",
      status: "Roadmap"
    }
  ],
  integrations: [
    {
      name: "DMS/Dateiserver",
      status: "geplant",
      scope: "Dokumente, Pläne, Versionen"
    },
    {
      name: "DATEV/FiBu",
      status: "geplant",
      scope: "Rechnungsausgang, Zahlungseingang"
    },
    {
      name: "KI-Assistent",
      status: "konzipiert",
      scope: "Protokollauswertung, Risiken, Handlungsempfehlungen"
    },
    {
      name: "REST/GraphQL API",
      status: "konzipiert",
      scope: "Externe Portale, Mobile App, BI"
    }
  ]
};

export const honorarProfiles = [
  {
    id: "building",
    name: "Objektplanung Gebäude",
    basePercent: 0.071,
    phases: [
      ["LPH 1", 2],
      ["LPH 2", 7],
      ["LPH 3", 15],
      ["LPH 4", 3],
      ["LPH 5", 25],
      ["LPH 6", 10],
      ["LPH 7", 4],
      ["LPH 8", 32],
      ["LPH 9", 2]
    ]
  },
  {
    id: "structural",
    name: "Tragwerksplanung",
    basePercent: 0.031,
    phases: [
      ["LPH 1", 3],
      ["LPH 2", 10],
      ["LPH 3", 15],
      ["LPH 4", 30],
      ["LPH 5", 40],
      ["LPH 6", 2]
    ]
  },
  {
    id: "technical",
    name: "Technische Ausrüstung",
    basePercent: 0.086,
    phases: [
      ["LPH 1", 2],
      ["LPH 2", 9],
      ["LPH 3", 17],
      ["LPH 4", 2],
      ["LPH 5", 22],
      ["LPH 6", 7],
      ["LPH 7", 5],
      ["LPH 8", 35],
      ["LPH 9", 1]
    ]
  },
  {
    id: "project-control",
    name: "Projektsteuerung",
    basePercent: 0.024,
    phases: [
      ["Stufe 1", 18],
      ["Stufe 2", 24],
      ["Stufe 3", 26],
      ["Stufe 4", 22],
      ["Stufe 5", 10]
    ]
  }
];

export const honorarZones = [
  { id: "I", name: "Zone I", factor: 0.82 },
  { id: "II", name: "Zone II", factor: 0.94 },
  { id: "III", name: "Zone III", factor: 1 },
  { id: "IV", name: "Zone IV", factor: 1.14 },
  { id: "V", name: "Zone V", factor: 1.28 }
];
