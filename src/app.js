import { honorarProfiles, honorarZones, seedData } from "./data.js";

const STORAGE_KEY = "projektverwaltung-wtf-state-v1";
const HELP_KEY = "projektverwaltung-wtf-help-open";
const SYNC_SETTINGS_KEY = "projektverwaltung-wtf-sync-settings-v1";
const app = document.querySelector("#app");
const today = new Date("2026-05-15T00:00:00");
const rpiInstallCommands = `sudo apt update
sudo apt install -y git curl
git clone https://github.com/Thomash100/Projektverwaltung_WTF.git
cd Projektverwaltung_WTF
chmod +x rpi/install-rpi-server.sh
sudo ./rpi/install-rpi-server.sh
hostname -I
sudo grep SYNC_TOKEN /etc/projektverwaltung-wtf.env`;

const routes = [
  ["dashboard", "Übersicht", "dashboard"],
  ["projects", "Projekte", "building"],
  ["team", "Team & Zeiten", "users"],
  ["honorar", "Angebote & Honorar", "calculator"],
  ["contracts", "Verträge & Nachträge", "file"],
  ["documents", "Dokumente & Pläne", "folder"],
  ["communication", "Schriftverkehr", "message"],
  ["tasks", "Aufgaben & Fristen", "check"],
  ["schedule", "Terminplan", "calendar"],
  ["controlling", "Controlling", "chart"],
  ["security", "Rechte & Sicherheit", "lock"],
  ["integrations", "KI & API", "plug"],
  ["settings", "Einstellungen", "settings"]
];

const contextHelpByRoute = {
  dashboard: {
    title: "Übersicht",
    summary: "Die Übersicht bündelt Portfolio-KPIs, das aktive Projekt, Fristen, Aufgaben und aktuelle Handlungsempfehlungen.",
    steps: [
      "Projekt über die linke Liste oder den Projektauswahlschalter aktivieren.",
      "Offene Fristen und Aufgaben im rechten Projektbereich prüfen.",
      "Neue Projekte oder Schnellaufgaben direkt über die Multifunktionsleiste anlegen."
    ],
    tips: ["Die Suche filtert Projekte nach Nummer, Name, Auftraggeber, Leistungsbild, Projektleitung und Status."]
  },
  projects: {
    title: "Projektakte",
    summary: "Hier werden Stammdaten, Leistungsstand, Stundenbudget, Risiko und Projektstatus gepflegt.",
    steps: [
      "Mit Neu ein Projekt anlegen oder mit Bearbeiten das aktive Projekt ändern.",
      "Duplizieren nutzt das aktive Projekt als Vorlage für wiederkehrende Bürostandards.",
      "Löschen entfernt auch zugehörige Aufgaben, Fristen, Zeiten, Dokumente, Verträge und Nachträge."
    ],
    tips: ["Vor dem Löschen immer die Projektdatei speichern oder exportieren."]
  },
  team: {
    title: "Team und Zeiten",
    summary: "Diese Ansicht verwaltet Mitarbeiter, Benutzerkonten, Auslastung und lokale Zeitbuchungen.",
    steps: [
      "Mitarbeiter mit Funktion, Team, Kosten- und Abrechnungssatz erfassen.",
      "Bei Bedarf direkt ein Benutzerkonto mit Rollenbezug anlegen.",
      "Zeitbuchungen projektbezogen erfassen, damit Stundenverbrauch und Controlling aktuell bleiben."
    ],
    tips: ["Rollen werden in Rechte & Sicherheit zentral gepflegt und hier als Auswahl verwendet."]
  },
  honorar: {
    title: "Angebote und Honorar",
    summary: "Die Kalkulation ist HOAI-orientiert, bleibt aber bewusst konfigurierbar und fachlich prüfpflichtig.",
    steps: [
      "Leistungsbild, Honorarzone und anrechenbare Kosten wählen.",
      "Leistungsphasen aktivieren, die angeboten oder beauftragt werden.",
      "Nebenkosten, Satzfaktor und Nachlass prüfen, bevor das Angebot gespeichert wird."
    ],
    tips: ["Die Werte sind keine Rechtsberatung und müssen vor produktiver Nutzung validiert werden."]
  },
  contracts: {
    title: "Verträge und Nachträge",
    summary: "Verträge, Nachträge und Abrechnungsstände werden projektbezogen sichtbar gemacht.",
    steps: [
      "Aktive Verträge und Angebotsstände je Projekt vergleichen.",
      "Nachträge nach Fälligkeit, Status und Betrag priorisieren.",
      "Abrechnungsstand gegen Auftrag und offene Honorare prüfen."
    ],
    tips: ["Für die kommerzielle Version braucht dieses Modul später prüfbare Vertrags- und Rechnungsworkflows."]
  },
  documents: {
    title: "Dokumente und Pläne",
    summary: "Dokumente, Pläne, Berechnungen und lokale Dateipfade werden in der Projektakte registriert.",
    steps: [
      "Datei registrieren, Projektreferenz, Typ, Revision und Verantwortlichen erfassen.",
      "Optional einen lokalen Dateipfad hinterlegen.",
      "In der Windows-App können verknüpfte Dateien direkt geöffnet werden."
    ],
    tips: ["Die aktuelle Einzelplatzversion speichert Dateiverweise, noch keine vollständige Dokumentenablage."]
  },
  communication: {
    title: "Schriftverkehr",
    summary: "Schriftverkehr, Protokolle und Aktennotizen werden mit Entscheidungen und Verantwortlichen verdichtet.",
    steps: [
      "Projektbezogene Kommunikation nach Betreff, Datum und Verantwortlichem prüfen.",
      "Entscheidungen als Projektrisiko, Aufgabe oder Handlungsempfehlung weiterverfolgen.",
      "Relevante Dokumente zusätzlich in der Dokumentenakte registrieren."
    ],
    tips: ["Eine spätere KI-Anbindung kann hier Protokolle und Mails auswerten."]
  },
  tasks: {
    title: "Aufgaben und Fristen",
    summary: "Das Board zeigt offene, laufende und erledigte Aufgaben sowie verbindliche Projektfristen.",
    steps: [
      "Aufgabe oder Frist über die Multifunktionsleiste anlegen.",
      "Priorität, Verantwortlichen und Fälligkeit setzen.",
      "Fristen regelmäßig gegen Terminplan und Projektstatus prüfen."
    ],
    tips: ["Überfällige Fristen werden im Dashboard als Risiko sichtbar."]
  },
  schedule: {
    title: "Terminplan",
    summary: "Der Terminplan visualisiert Projektphasen und Fortschritt über den Bürozeitraum.",
    steps: [
      "Projektphasen und Fortschritte im Zeitstrahl vergleichen.",
      "Kritische Projekte gegen Fristen und Aufgaben spiegeln.",
      "Terminverschiebungen später in eine echte Planungslogik überführen."
    ],
    tips: ["Die aktuelle Darstellung ist eine Steuerungssicht, noch kein vollwertiges Terminplanungsmodul."]
  },
  controlling: {
    title: "Projektcontrolling",
    summary: "Controlling verbindet Honorar, Abrechnung, Stundenverbrauch, Kosten und Risikoprojekte.",
    steps: [
      "Forecast-Marge, offene Honorare und externe Kosten prüfen.",
      "Stundenverbrauch mit Budget und Leistungsstand vergleichen.",
      "Risikoprojekte priorisieren und Handlungsempfehlungen ableiten."
    ],
    tips: ["Die Aussagekraft steigt mit sauberen Zeitbuchungen und gepflegten Vertragswerten."]
  },
  security: {
    title: "Rechte und Sicherheit",
    summary: "Benutzerkonten, Rollenmatrix, Backup, Verschlüsselung und Lizenzmodell werden zentral vorbereitet.",
    steps: [
      "Benutzer anlegen und mit Mitarbeitern verbinden.",
      "Rollen prüfen und Rechte nach Bürostandard zuordnen.",
      "Backup- und Verschlüsselungsstatus kontrollieren."
    ],
    tips: ["Produktive Benutzerrechte benötigen später Authentifizierung, Audit-Log und Mandantenfähigkeit."]
  },
  integrations: {
    title: "KI und API",
    summary: "Diese Ansicht sammelt geplante Schnittstellen für DMS, DATEV/FiBu, KI und externe Portale.",
    steps: [
      "Integrationsstatus und fachlichen Umfang prüfen.",
      "API-Endpunkte als spätere technische Verträge verstehen.",
      "KI-Funktionen erst nach stabiler Datenstruktur anbinden."
    ],
    tips: ["Schnittstellen sollten erst nach stabilen Rollen-, Dokumenten- und Projektmodellen produktiv werden."]
  },
  settings: {
    title: "Einstellungen und Server-Sync",
    summary: "Hier wird ein Raspberry-Pi- oder Büroserver im Netzwerk gesucht, geprüft und als Synchronisationsziel hinterlegt.",
    steps: [
      "IP-Adresse oder Serveradresse manuell eintragen oder einen IP-Bereich scannen.",
      "Verbindung testen und optional einen Sync-Token eintragen.",
      "Daten gezielt zum Server hochladen oder vom Server laden."
    ],
    tips: ["Für Internetzugriff unterwegs bitte HTTPS, VPN oder Tailscale/WireGuard einsetzen und die Sync-API nicht ungeschützt veröffentlichen."]
  }
};

const state = {
  data: loadData(),
  route: "dashboard",
  search: "",
  selectedProjectId: "",
  modal: null,
  lastSavedFileName: window.localStorage.getItem("projektverwaltung-wtf-file-name") || "Projektverwaltung_WTF.wtf.json",
  dirty: false,
  status: "Bereit",
  helpOpen: window.localStorage.getItem(HELP_KEY) === "1",
  sync: loadSyncSettings(),
  syncStatus: "Noch nicht verbunden",
  syncBusy: false,
  discoveredServers: [],
  hoai: {
    profileId: "building",
    zoneId: "III",
    chargeableCosts: 8650000,
    rateFactor: 1,
    incidentalPercent: 5,
    discountPercent: 0,
    selectedPhases: honorarProfiles[0].phases.map(([name]) => name)
  }
};

state.selectedProjectId = state.data.projects[0]?.id || "";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return normalizeData(stored ? JSON.parse(stored) : clone(seedData));
  } catch {
    return normalizeData(clone(seedData));
  }
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function defaultSyncEndpoint() {
  const hostName = window.location.hostname;
  if (hostName && hostName !== "localhost" && hostName !== "127.0.0.1") {
    return `${window.location.protocol}//${window.location.host}`;
  }

  return "";
}

function loadSyncSettings() {
  const defaults = {
    endpoint: defaultSyncEndpoint(),
    token: "",
    scanPrefix: "192.168.178",
    scanPort: 4173,
    scanStart: 2,
    scanEnd: 254,
    autoSync: false,
    lastSync: ""
  };

  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(SYNC_SETTINGS_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveSyncSettings(settings = state.sync) {
  window.localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
}

function normalizeData(data) {
  const normalized = { ...clone(seedData), ...data };
  normalized.projects = Array.isArray(data.projects) ? data.projects : [];
  normalized.employees = Array.isArray(data.employees) ? data.employees : [];
  normalized.users = Array.isArray(data.users)
    ? data.users
    : normalized.employees.slice(0, 3).map((employee, index) => ({
        id: `U-${String(index + 1).padStart(2, "0")}`,
        name: employee.name,
        employeeId: employee.id,
        email: `${employee.name.toLowerCase().replaceAll(" ", ".")}@example.local`,
        role: employee.rights || "Bearbeitung",
        status: "aktiv",
        lastLogin: ""
      }));
  normalized.tasks = Array.isArray(data.tasks) ? data.tasks : [];
  normalized.deadlines = Array.isArray(data.deadlines) ? data.deadlines : [];
  normalized.timeEntries = Array.isArray(data.timeEntries) ? data.timeEntries : [];
  normalized.contracts = Array.isArray(data.contracts) ? data.contracts : [];
  normalized.addenda = Array.isArray(data.addenda) ? data.addenda : [];
  normalized.documents = Array.isArray(data.documents) ? data.documents : [];
  normalized.correspondence = Array.isArray(data.correspondence) ? data.correspondence : [];
  normalized.recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
  normalized.schedule = Array.isArray(data.schedule) ? data.schedule : [];
  normalized.roles = Array.isArray(data.roles) ? data.roles : [];
  normalized.backups = Array.isArray(data.backups) ? data.backups : [];
  normalized.licenses = Array.isArray(data.licenses) ? data.licenses : [];
  normalized.integrations = Array.isArray(data.integrations) ? data.integrations : [];
  return normalized;
}

function markDirty(message = "Ungespeicherte Änderungen") {
  state.dirty = true;
  state.status = message;
  persist();
}

const currency = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1
});

const percent = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1
});

function money(value) {
  return currency.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "offen";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(value) {
  const date = new Date(`${value}T00:00:00`);
  return Math.ceil((date - today) / 86400000);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

function projectName(id) {
  return state.data.projects.find((project) => project.id === id)?.name || "Ohne Projekt";
}

function activeProject() {
  return state.data.projects.find((project) => project.id === state.selectedProjectId) || state.data.projects[0];
}

function icon(name) {
  const icons = {
    dashboard:
      '<path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-12h8V3h-8v6Z"/>',
    building:
      '<path d="M4 21V5l8-3 8 3v16h-5v-6H9v6H4Zm4-10h2V8H8v3Zm6 0h2V8h-2v3Z"/>',
    users:
      '<path d="M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 1a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM2 21v-2c0-3 2.7-5 6-5s6 2 6 5v2H2Zm12 0v-2.2c0-1.3-.4-2.4-1.1-3.3 1-.7 2.1-1 3.1-1 3 0 5.5 1.8 5.5 4.5V21H14Z"/>',
    calculator:
      '<path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 4v4h10V6H7Zm0 7v2h2v-2H7Zm4 0v2h2v-2h-2Zm4 0v2h2v-2h-2Zm-8 4v2h2v-2H7Zm4 0v2h2v-2h-2Zm4 0v2h2v-2h-2Z"/>',
    file:
      '<path d="M6 2h8l5 5v15H6V2Zm7 1.5V8h4.5L13 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z"/>',
    folder:
      '<path d="M3 5h7l2 2h9v12a2 2 0 0 1-2 2H3V5Zm2 4v10h14V9H5Z"/>',
    message:
      '<path d="M4 4h16v12H7l-3 4V4Zm2 2v9h2.1l1.3-1.5H18V6H6Z"/>',
    check:
      '<path d="M9.5 16.2 4.8 11.5l1.4-1.4 3.3 3.3 8.3-8.3 1.4 1.4-9.7 9.7ZM4 20h16v2H4v-2Z"/>',
    calendar:
      '<path d="M7 2h2v3h6V2h2v3h4v16H3V5h4V2Zm12 8H5v9h14v-9ZM5 7v1h14V7H5Z"/>',
    chart:
      '<path d="M4 19h16v2H2V3h2v16Zm3-2V9h3v8H7Zm5 0V5h3v12h-3Zm5 0v-6h3v6h-3Z"/>',
    lock:
      '<path d="M6 10V8a6 6 0 1 1 12 0v2h2v12H4V10h2Zm2 0h8V8a4 4 0 0 0-8 0v2Zm3 4v4h2v-4h-2Z"/>',
    plug:
      '<path d="M8 2h2v5h4V2h2v5h2v4a6 6 0 0 1-5 5.9V22h-2v-5.1A6 6 0 0 1 6 11V7h2V2Zm0 7v2a4 4 0 1 0 8 0V9H8Z"/>',
    settings:
      '<path d="m19.4 13.5.1-1.5-.1-1.5 2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.6A8 8 0 0 0 7 6.6l-2.4-1-2 3.4 2 1.5-.1 1.5.1 1.5-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.6 1.5l.4 2.6h4l.4-2.6a8 8 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>',
    plus:
      '<path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z"/>',
    refresh:
      '<path d="M17.7 6.3A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.8-4.3L13 11h8V3l-3.3 3.3Z"/>',
    export:
      '<path d="M5 20h14v2H5v-2ZM11 3h2v10l3.5-3.5 1.4 1.4L12 16.8 6.1 10.9l1.4-1.4L11 13V3Z"/>',
    save:
      '<path d="M5 3h12l2 2v16H5V3Zm2 2v5h9V5H7Zm0 14h10v-6H7v6Zm2-12h5V5H9v2Z"/>',
    open:
      '<path d="M4 5h6l2 2h8v3h-2V9H4v10l2.4-7H22l-3 9H3V5h1Z"/>',
    edit:
      '<path d="m4 17.2 9.6-9.6 2.8 2.8L6.8 20H4v-2.8ZM15 6.2l1.4-1.4a2 2 0 0 1 2.8 2.8L17.8 9 15 6.2Z"/>',
    trash:
      '<path d="M8 4V2h8v2h5v2H3V4h5Zm-2 4h12l-1 14H7L6 8Zm4 3v8h2v-8h-2Zm4 0v8h2v-8h-2Z"/>',
    copy:
      '<path d="M8 7h11v14H8V7Zm2 2v10h7V9h-7ZM5 17H3V3h11v2H5v12Z"/>',
    help:
      '<path d="M11 18h2v2h-2v-2Zm1-16a7 7 0 0 0-7 7h2a5 5 0 1 1 8.2 3.8c-1.7 1.3-2.7 2.4-2.7 4.2h-2c0-2.6 1.4-4 3.4-5.5A3 3 0 1 0 9 9H7a5 5 0 0 1 5-5Z"/>'
  };

  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${icons[name] || icons.dashboard}</svg>`;
}

function toneClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (["hoch", "kritisch", "überfällig"].includes(normalized)) return "tone-danger";
  if (["mittel", "angeboten", "in prüfung", "in arbeit"].includes(normalized)) return "tone-warning";
  if (["niedrig", "ok", "aktiv", "freigegeben", "erledigt", "beauftragt"].includes(normalized)) return "tone-good";
  return "tone-neutral";
}

function render() {
  const project = activeProject();
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">WTF</div>
          <div>
            <strong>${escapeHtml(state.data.office.name)}</strong>
            <span>Büro-Plattform</span>
          </div>
        </div>
        <nav class="nav" aria-label="Hauptnavigation">
          ${routes
            .map(
              ([id, label, iconName]) => `
                <button class="nav-item ${state.route === id ? "is-active" : ""}" data-route="${id}" title="${escapeHtml(label)}">
                  ${icon(iconName)}
                  <span>${escapeHtml(label)}</span>
                </button>
              `
            )
            .join("")}
        </nav>
        <div class="office-status">
          <span class="status-dot"></span>
          <div>
            <strong>${escapeHtml(state.data.office.syncMode)}</strong>
            <span>${escapeHtml(state.data.office.backupTarget)}</span>
          </div>
        </div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div>
            <span class="eyebrow">${escapeHtml(currentRouteLabel())}</span>
            <h1>${escapeHtml(project?.name || "Projektportfolio")}</h1>
            <small class="workspace-status">${state.dirty ? "Nicht gespeichert" : "Gespeichert"} · ${escapeHtml(state.lastSavedFileName)}</small>
          </div>
          <div class="topbar-actions">
            <label class="search">
              <span>Suchen</span>
              <input data-search type="search" value="${escapeHtml(state.search)}" placeholder="Projekt, Aufgabe, Dokument..." />
            </label>
            <select data-project-select aria-label="Aktives Projekt">
              ${state.data.projects
                .map(
                  (item) =>
                    `<option value="${item.id}" ${item.id === state.selectedProjectId ? "selected" : ""}>${escapeHtml(item.number)} - ${escapeHtml(item.name)}</option>`
                )
                .join("")}
            </select>
            <button class="icon-button" data-action="export" title="Daten als JSON exportieren">${icon("export")}</button>
            <button class="icon-button" data-action="reset-demo" title="Demo-Daten zurücksetzen">${icon("refresh")}</button>
            <button class="icon-button ${state.helpOpen ? "is-active" : ""}" data-action="toggle-help" title="Kontextbezogene Hilfe">${icon("help")}</button>
          </div>
        </header>
        ${renderRibbon()}
        ${renderContextHelp()}
        ${renderMain()}
        ${renderModal()}
        <input class="hidden-file-input" data-file-input type="file" accept="application/json,.json,.wtf.json" />
      </main>
    </div>
  `;
}

function currentRouteLabel() {
  return routes.find(([id]) => id === state.route)?.[1] || "Übersicht";
}

function renderRibbon() {
  const groups = [
    {
      title: "Datei",
      items: [
        ["open-file", "Öffnen", "open", "Projektdatei laden"],
        ["save-file", "Speichern", "save", "Aktuellen Stand sichern"],
        ["save-file-as", "Speichern unter", "export", "Neue Datei anlegen"]
      ]
    },
    ribbonContextGroup(),
    {
      title: "Hilfe",
      items: [["toggle-help", "Hilfe", "help", "Kontextbezogene Hilfe zur aktuellen Ansicht"]]
    }
  ].filter(Boolean);

  return `
    <section class="ribbon" aria-label="Multifunktionsleiste">
      ${groups
        .map(
          (group) => `
            <div class="ribbon-group">
              <span class="ribbon-title">${escapeHtml(group.title)}</span>
              <div class="ribbon-actions">
                ${group.items.map(([action, label, iconName, detail]) => renderRibbonButton(action, label, iconName, detail)).join("")}
              </div>
            </div>
          `
        )
        .join("")}
      <div class="ribbon-status">
        <strong>${state.dirty ? "Änderungen offen" : "Aktuell"}</strong>
        <span>${escapeHtml(state.status)}</span>
      </div>
    </section>
  `;
}

function ribbonContextGroup() {
  const byRoute = {
    dashboard: {
      title: "Start",
      items: [
        ["new-project", "Projekt", "plus", "Neues Projekt"],
        ["new-task", "Aufgabe", "check", "Schnell anlegen"]
      ]
    },
    projects: {
      title: "Projekt",
      items: [
        ["new-project", "Neu", "plus", "Projekt anlegen"],
        ["edit-project", "Bearbeiten", "edit", "Aktives Projekt"],
        ["duplicate-project", "Duplizieren", "copy", "Vorlage kopieren"],
        ["delete-project", "Löschen", "trash", "Aktives Projekt"]
      ]
    },
    team: {
      title: "Team",
      items: [
        ["new-employee", "Mitarbeiter", "users", "Person anlegen"],
        ["new-user", "Benutzer", "lock", "Login/Rechte"],
        ["new-time", "Zeit", "plus", "Zeitbuchung"]
      ]
    },
    documents: {
      title: "Dokumente",
      items: [
        ["new-document", "Registrieren", "folder", "Datei erfassen"],
        ["open-document", "Öffnen", "open", "Aktives Dokument"]
      ]
    },
    tasks: {
      title: "Aufgaben",
      items: [
        ["new-task", "Aufgabe", "plus", "Neue Aufgabe"],
        ["new-deadline", "Frist", "calendar", "Termin setzen"]
      ]
    },
    security: {
      title: "Benutzer",
      items: [
        ["new-user", "Benutzer", "plus", "Konto anlegen"],
        ["new-employee", "Mitarbeiter", "users", "Person anlegen"]
      ]
    },
    honorar: {
      title: "Honorar",
      items: [
        ["new-project", "Projekt", "building", "Basis anlegen"],
        ["save-file", "Sichern", "save", "Kalkulationsstand"]
      ]
    },
    settings: {
      title: "Server",
      items: [
        ["discover-sync-servers", "Suchen", "settings", "Server im Netzwerk suchen"],
        ["test-sync-server", "Testen", "plug", "Verbindung prüfen"],
        ["push-sync", "Sync", "save", "Zum Server hochladen"]
      ]
    }
  };

  return byRoute[state.route] || {
    title: "Aktionen",
    items: [["new-task", "Aufgabe", "plus", "Neue Aufgabe"]]
  };
}

function renderRibbonButton(action, label, iconName, detail) {
  return `
    <button class="ribbon-button" data-action="${escapeHtml(action)}" title="${escapeHtml(detail || label)}">
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function renderContextHelp() {
  if (!state.helpOpen) return "";
  const help = contextHelpByRoute[state.route] || contextHelpByRoute.dashboard;
  const project = activeProject();

  return `
    <aside class="context-help" aria-label="Kontextbezogene Hilfe">
      <div class="context-help-main">
        <div>
          <span class="eyebrow">Hilfe zur Ansicht</span>
          <h2>${escapeHtml(help.title)}</h2>
          <p>${escapeHtml(help.summary)}</p>
          <small>Aktives Projekt: ${escapeHtml(project?.number || "")} ${escapeHtml(project?.name || "kein Projekt gewählt")}</small>
        </div>
        <button class="icon-button" data-action="toggle-help" title="Hilfe schließen">x</button>
      </div>
      <div class="help-grid">
        <div>
          <strong>Vorgehen</strong>
          <ol class="help-steps">
            ${help.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
        </div>
        <div>
          <strong>Hinweise</strong>
          <ul class="help-tips">
            ${help.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </aside>
  `;
}

function renderModal() {
  if (!state.modal) return "";
  const title = modalTitle(state.modal.type);
  return `
    <div class="modal-backdrop" role="presentation" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}" data-modal-panel>
        <div class="modal-header">
          <div>
            <span class="eyebrow">Bearbeiten</span>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <button class="icon-button" data-action="close-modal" title="Schließen">x</button>
        </div>
        ${renderModalBody(state.modal)}
      </section>
    </div>
  `;
}

function modalTitle(type) {
  return {
    project: "Projekt anlegen",
    editProject: "Projekt bearbeiten",
    employee: "Mitarbeiter anlegen",
    user: "Benutzer anlegen",
    document: "Datei registrieren",
    task: "Aufgabe anlegen",
    deadline: "Frist anlegen",
    time: "Zeit buchen"
  }[type] || "Eintrag bearbeiten";
}

function renderModalBody(modal) {
  if (modal.type === "project" || modal.type === "editProject") return renderProjectForm(modal);
  if (modal.type === "employee") return renderEmployeeForm();
  if (modal.type === "user") return renderUserForm();
  if (modal.type === "document") return renderDocumentForm();
  if (modal.type === "task") return renderTaskForm();
  if (modal.type === "deadline") return renderDeadlineForm();
  if (modal.type === "time") return renderTimeForm();
  return "";
}

function renderProjectForm(modal) {
  const project = modal.type === "editProject" ? activeProject() : {};
  return `
    <form class="modal-form" data-form="${modal.type === "editProject" ? "project-edit" : "project"}">
      <div class="form-grid">
        ${field("number", "Projektnummer", project.number || nextProjectNumber(), "text", true)}
        ${field("name", "Projektname", project.name || "", "text", true)}
        ${field("client", "Auftraggeber", project.client || "", "text", true)}
        ${field("address", "Adresse", project.address || "", "text")}
        ${field("discipline", "Leistungsbild", project.discipline || "Objektplanung Gebäude", "text", true)}
        ${field("phase", "Phase", project.phase || "LPH 1 Grundlagenermittlung", "text")}
        ${selectField("status", "Status", ["angebot", "in Arbeit", "kritisch", "pausiert", "abgeschlossen"], project.status || "angebot")}
        ${selectField("risk", "Risiko", ["niedrig", "mittel", "hoch"], project.risk || "mittel")}
        ${selectField("priority", "Priorität", ["normal", "mittel", "hoch"], project.priority || "mittel")}
        ${selectField("manager", "Projektleitung", state.data.employees.map((employee) => employee.name), project.manager || state.data.employees[0]?.name || "")}
        ${field("start", "Start", project.start || "2026-05-15", "date")}
        ${field("due", "Fällig", project.due || "2026-12-31", "date")}
        ${field("chargeableCosts", "Anrechenbare Kosten", project.chargeableCosts || 0, "number")}
        ${field("contractedFee", "Auftrag netto", project.contractedFee || 0, "number")}
        ${field("hoursBudget", "Stundenbudget", project.hoursBudget || 0, "number")}
        ${field("tags", "Tags", (project.tags || []).join(", "), "text")}
      </div>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderEmployeeForm() {
  return `
    <form class="modal-form" data-form="employee">
      <div class="form-grid">
        ${field("name", "Name", "", "text", true)}
        ${field("role", "Funktion", "", "text", true)}
        ${field("team", "Team", "Architektur", "text")}
        ${field("weeklyHours", "Wochenstunden", 40, "number")}
        ${field("costRate", "Interner Kostensatz", 70, "number")}
        ${field("billRate", "Abrechnungssatz", 120, "number")}
        ${field("utilization", "Auslastung %", 70, "number")}
        ${selectField("rights", "Rechte", state.data.roles.map((role) => role.name), "Bearbeitung")}
      </div>
      <label class="checkbox-line"><input name="createUser" type="checkbox" checked /> auch Benutzerkonto anlegen</label>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderUserForm() {
  return `
    <form class="modal-form" data-form="user">
      <div class="form-grid">
        ${field("name", "Anzeigename", "", "text", true)}
        ${field("email", "E-Mail / Login", "", "email", true)}
        ${selectField("employeeId", "Mitarbeiterbezug", [{ value: "", label: "Nicht zugeordnet" }, ...state.data.employees.map((employee) => ({ value: employee.id, label: employee.name }))], "")}
        ${selectField("role", "Rolle", state.data.roles.map((role) => role.name), "Bearbeitung")}
        ${selectField("status", "Status", ["aktiv", "gesperrt", "vorbereitet"], "aktiv")}
      </div>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderDocumentForm() {
  return `
    <form class="modal-form" data-form="document">
      <div class="form-grid">
        ${selectField("projectId", "Projekt", projectSelectItems(), state.selectedProjectId)}
        ${field("name", "Dateiname / Titel", "", "text", true)}
        ${selectField("type", "Typ", ["Plan", "Berechnung", "Angebot", "Vertrag", "Protokoll", "Schriftverkehr"], "Plan")}
        ${field("revision", "Revision", "A", "text")}
        ${selectField("owner", "Verantwortlich", state.data.employees.map((employee) => employee.name), state.data.employees[0]?.name || "")}
        ${selectField("status", "Status", ["Entwurf", "in Arbeit", "Prüflauf", "freigegeben", "archiviert"], "Entwurf")}
        ${field("storageUri", "Dateipfad oder Ablagehinweis", "", "text")}
        ${field("updated", "Stand", "2026-05-15", "date")}
      </div>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderTaskForm() {
  return `
    <form class="modal-form" data-form="task">
      <div class="form-grid">
        ${field("title", "Aufgabe", "", "text", true)}
        ${selectField("projectId", "Projekt", projectSelectItems(), state.selectedProjectId)}
        ${selectField("assignee", "Verantwortlich", state.data.employees.map((employee) => employee.name), state.data.employees[0]?.name || "")}
        ${selectField("priority", "Priorität", ["normal", "mittel", "hoch"], "normal")}
        ${selectField("area", "Bereich", ["Planung", "Honorar", "Berechnung", "Angebot", "Schriftverkehr"], "Planung")}
        ${field("due", "Fällig", "2026-05-22", "date", true)}
      </div>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderDeadlineForm() {
  return `
    <form class="modal-form" data-form="deadline">
      <div class="form-grid">
        ${field("title", "Frist / Termin", "", "text", true)}
        ${selectField("projectId", "Projekt", projectSelectItems(), state.selectedProjectId)}
        ${selectField("type", "Typ", ["Planlieferung", "Termin", "Freigabe", "Angebot", "Vertrag"], "Termin")}
        ${field("date", "Datum", "2026-05-22", "date", true)}
      </div>
      <label class="checkbox-line"><input name="binding" type="checkbox" checked /> verbindlich</label>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function renderTimeForm() {
  return `
    <form class="modal-form" data-form="time">
      <div class="form-grid">
        ${selectField("projectId", "Projekt", projectSelectItems(), state.selectedProjectId)}
        ${selectField("employee", "Mitarbeiter", state.data.employees.map((employee) => employee.name), state.data.employees[0]?.name || "")}
        ${field("date", "Datum", "2026-05-15", "date")}
        ${field("hours", "Stunden", 1, "number")}
        ${field("phase", "Phase", activeProject()?.phase || "LPH 1", "text")}
        ${field("activity", "Tätigkeit", "", "text", true)}
      </div>
      <label class="checkbox-line"><input name="billable" type="checkbox" checked /> abrechenbar</label>
      <div class="modal-actions">
        <button class="primary-action" type="submit">${icon("save")} Speichern</button>
        <button class="icon-button text-button" type="button" data-action="close-modal">Abbrechen</button>
      </div>
    </form>
  `;
}

function field(name, label, value = "", type = "text", required = false) {
  return `
    <label>
      ${escapeHtml(label)}
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${required ? "required" : ""} />
    </label>
  `;
}

function projectSelectItems() {
  return state.data.projects.map((project) => ({
    value: project.id,
    label: `${project.number} - ${project.name}`
  }));
}

function selectField(name, label, options, value = "") {
  return `
    <label>
      ${escapeHtml(label)}
      <select name="${escapeHtml(name)}">
        ${options
          .map((option) => {
            const optionValue = typeof option === "object" ? option.value : option;
            const optionLabel = typeof option === "object" ? option.label : option;
            return `<option value="${escapeHtml(optionValue)}" ${String(optionValue) === String(value) ? "selected" : ""}>${escapeHtml(optionLabel || "Nicht zugeordnet")}</option>`;
          })
          .join("")}
      </select>
    </label>
  `;
}

function renderMain() {
  const renderers = {
    dashboard: renderDashboard,
    projects: renderProjects,
    team: renderTeam,
    honorar: renderHonorar,
    contracts: renderContracts,
    documents: renderDocuments,
    communication: renderCommunication,
    tasks: renderTasks,
    schedule: renderSchedule,
    controlling: renderControlling,
    security: renderSecurity,
    integrations: renderIntegrations,
    settings: renderSettings
  };

  return (renderers[state.route] || renderDashboard)();
}

function filteredProjects() {
  const query = state.search.trim().toLowerCase();
  if (!query) return state.data.projects;
  return state.data.projects.filter((project) => {
    return [project.number, project.name, project.client, project.discipline, project.manager, project.status]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function kpis() {
  const fee = state.data.projects.reduce((sum, project) => sum + project.contractedFee, 0);
  const invoiced = state.data.projects.reduce((sum, project) => sum + project.invoiced, 0);
  const openTasks = state.data.tasks.filter((task) => task.status !== "erledigt").length;
  const dueSoon = state.data.deadlines.filter((deadline) => {
    const delta = daysUntil(deadline.date);
    return delta >= 0 && delta <= 21;
  }).length;
  const hoursActual = state.data.projects.reduce((sum, project) => sum + project.hoursActual, 0);
  const hoursBudget = state.data.projects.reduce((sum, project) => sum + project.hoursBudget, 0);
  return { fee, invoiced, openTasks, dueSoon, hoursActual, hoursBudget };
}

function metric(label, value, detail, tone = "neutral") {
  return `
    <article class="metric metric-${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${value}</strong>
      <small>${escapeHtml(detail)}</small>
    </article>
  `;
}

function renderDashboard() {
  const project = activeProject();
  const dashboardKpis = kpis();
  const projectTasks = state.data.tasks.filter((task) => task.projectId === project.id);
  const projectDeadlines = state.data.deadlines.filter((deadline) => deadline.projectId === project.id);
  const projectDocs = state.data.documents.filter((document) => document.projectId === project.id);

  return `
    <section class="metric-grid">
      ${metric("Projektvolumen", money(dashboardKpis.fee), `${state.data.projects.length} aktive Vorgänge`, "ink")}
      ${metric("Abgerechnet", money(dashboardKpis.invoiced), `${percent.format((dashboardKpis.invoiced / Math.max(dashboardKpis.fee, 1)) * 100)} % vom Auftrag`, "good")}
      ${metric("Offene Aufgaben", dashboardKpis.openTasks, `${dashboardKpis.dueSoon} Fristen in 21 Tagen`, "warning")}
      ${metric("Stundenverbrauch", `${percent.format((dashboardKpis.hoursActual / dashboardKpis.hoursBudget) * 100)} %`, `${number.format(dashboardKpis.hoursActual)} von ${number.format(dashboardKpis.hoursBudget)} h`, "blue")}
    </section>

    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Portfolio</span>
            <h2>Projektlage</h2>
          </div>
          <button class="primary-action" data-route="projects">${icon("building")} Projektliste</button>
        </div>
        <div class="project-list">
          ${filteredProjects().map(renderProjectRow).join("")}
        </div>
      </div>

      <div class="panel panel-strong">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Aktives Projekt</span>
            <h2>${escapeHtml(project.name)}</h2>
          </div>
          <span class="pill ${toneClass(project.status)}">${escapeHtml(project.status)}</span>
        </div>
        <div class="detail-grid">
          <div>
            <span>Auftraggeber</span>
            <strong>${escapeHtml(project.client)}</strong>
          </div>
          <div>
            <span>Leistungsbild</span>
            <strong>${escapeHtml(project.discipline)}</strong>
          </div>
          <div>
            <span>Phase</span>
            <strong>${escapeHtml(project.phase)}</strong>
          </div>
          <div>
            <span>Projektleitung</span>
            <strong>${escapeHtml(project.manager)}</strong>
          </div>
        </div>
        ${progressBar(project.progress, "Leistungsstand")}
        ${progressBar((project.hoursActual / project.hoursBudget) * 100, "Stundenverbrauch")}
        <div class="mini-columns">
          <div>
            <h3>Nächste Fristen</h3>
            ${projectDeadlines.map(renderDeadlineItem).join("") || emptyState("Keine Frist im aktiven Projekt")}
          </div>
          <div>
            <h3>Aufgaben</h3>
            ${projectTasks.slice(0, 4).map(renderTaskItem).join("") || emptyState("Keine Aufgabe im aktiven Projekt")}
          </div>
        </div>
        <div class="document-strip">
          ${projectDocs.map((document) => `<span>${escapeHtml(document.type)}: ${escapeHtml(document.revision)}</span>`).join("")}
        </div>
      </div>
    </section>

    <section class="layout-three">
      ${renderRecommendationPanel()}
      ${renderQuickTaskPanel()}
      ${renderRecentCommunicationPanel()}
    </section>
  `;
}

function renderProjectRow(project) {
  return `
    <button class="project-row ${project.id === state.selectedProjectId ? "is-selected" : ""}" data-project-id="${project.id}">
      <span>
        <strong>${escapeHtml(project.number)} ${escapeHtml(project.name)}</strong>
        <small>${escapeHtml(project.client)} · ${escapeHtml(project.phase)}</small>
      </span>
      <span class="pill ${toneClass(project.risk)}">${escapeHtml(project.risk)}</span>
      <span>${money(project.contractedFee || project.budgetFee)}</span>
      <span>${project.progress}%</span>
    </button>
  `;
}

function progressBar(value, label) {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));
  return `
    <div class="progress-block">
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${percent.format(safeValue)} %</strong>
      </div>
      <div class="progress"><span style="width:${safeValue}%"></span></div>
    </div>
  `;
}

function renderDeadlineItem(deadline) {
  const delta = daysUntil(deadline.date);
  const label = delta < 0 ? "überfällig" : `${delta} Tage`;
  return `
    <div class="list-item">
      <span>
        <strong>${escapeHtml(deadline.title)}</strong>
        <small>${escapeHtml(projectName(deadline.projectId))}</small>
      </span>
      <span class="pill ${delta < 0 ? "tone-danger" : "tone-warning"}">${escapeHtml(label)}</span>
    </div>
  `;
}

function renderTaskItem(task) {
  return `
    <div class="list-item">
      <span>
        <strong>${escapeHtml(task.title)}</strong>
        <small>${escapeHtml(task.assignee)} · ${formatDate(task.due)}</small>
      </span>
      <span class="pill ${toneClass(task.priority)}">${escapeHtml(task.priority)}</span>
    </div>
  `;
}

function renderRecommendationPanel() {
  return `
    <div class="panel">
      <div class="panel-header compact">
        <h2>Handlungsempfehlungen</h2>
      </div>
      ${state.data.recommendations.map((item) => `
        <article class="recommendation">
          <span class="pill ${toneClass(item.urgency)}">${escapeHtml(item.urgency)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(projectName(item.projectId))}</small>
          <p>${escapeHtml(item.impact)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderQuickTaskPanel() {
  return `
    <div class="panel">
      <div class="panel-header compact">
        <h2>Schnellaufgabe</h2>
      </div>
      <form class="stack-form" data-form="task">
        <input name="title" required placeholder="Aufgabe" />
        <div class="form-row">
          <select name="projectId">${projectOptions()}</select>
          <select name="assignee">${employeeOptions()}</select>
        </div>
        <div class="form-row">
          <input name="due" required type="date" value="2026-05-22" />
          <select name="priority">
            <option>normal</option>
            <option>mittel</option>
            <option>hoch</option>
          </select>
        </div>
        <button class="primary-action" type="submit">${icon("plus")} Anlegen</button>
      </form>
    </div>
  `;
}

function renderRecentCommunicationPanel() {
  return `
    <div class="panel">
      <div class="panel-header compact">
        <h2>Schriftverkehr</h2>
      </div>
      ${state.data.correspondence.slice(0, 4).map((item) => `
        <div class="list-item">
          <span>
            <strong>${escapeHtml(item.subject)}</strong>
            <small>${escapeHtml(item.channel)} · ${formatDate(item.date)} · ${escapeHtml(item.owner)}</small>
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProjects() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Projektakte</span>
          <h2>Projekte, Leistungsstand und Risiko</h2>
        </div>
      </div>
      <div class="data-table">
        <div class="table-head">
          <span>Projekt</span>
          <span>Auftraggeber</span>
          <span>Phase</span>
          <span>Honorar</span>
          <span>Stunden</span>
          <span>Status</span>
        </div>
        ${filteredProjects().map((project) => `
          <button class="table-row" data-project-id="${project.id}">
            <span><strong>${escapeHtml(project.number)}</strong> ${escapeHtml(project.name)}</span>
            <span>${escapeHtml(project.client)}</span>
            <span>${escapeHtml(project.phase)}</span>
            <span>${money(project.contractedFee || project.budgetFee)}</span>
            <span>${number.format(project.hoursActual)} / ${number.format(project.hoursBudget)} h</span>
            <span class="pill ${toneClass(project.status)}">${escapeHtml(project.status)}</span>
          </button>
        `).join("")}
      </div>
    </section>
    <section class="layout-three">
      ${state.data.projects.map((project) => `
        <article class="panel project-card">
          <div class="panel-header compact">
            <h2>${escapeHtml(project.number)}</h2>
            <span class="pill ${toneClass(project.risk)}">${escapeHtml(project.risk)}</span>
          </div>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.address)}</p>
          ${progressBar(project.progress, "Leistungsstand")}
          <div class="tag-row">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderTeam() {
  const totalHours = state.data.timeEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
  return `
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Mitarbeiter</span>
            <h2>Kapazität und Rechte</h2>
          </div>
          <span class="pill tone-neutral">${number.format(totalHours)} h gebucht</span>
        </div>
        <div class="employee-grid">
          ${state.data.employees.map((employee) => `
            <article class="employee">
              <div>
                <strong>${escapeHtml(employee.name)}</strong>
                <span>${escapeHtml(employee.role)}</span>
              </div>
              ${progressBar(employee.utilization, "Auslastung")}
              <dl>
                <div><dt>Team</dt><dd>${escapeHtml(employee.team)}</dd></div>
                <div><dt>Rechte</dt><dd>${escapeHtml(employee.rights)}</dd></div>
                <div><dt>Satz</dt><dd>${money(employee.billRate)} / h</dd></div>
              </dl>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header compact">
          <h2>Zeit buchen</h2>
        </div>
        <form class="stack-form" data-form="time">
          <select name="projectId">${projectOptions()}</select>
          <select name="employee">${employeeOptions()}</select>
          <div class="form-row">
            <input name="date" type="date" value="2026-05-15" />
            <input name="hours" min="0.25" step="0.25" type="number" value="1.00" />
          </div>
          <input name="phase" placeholder="Phase" value="LPH 5" />
          <input name="activity" placeholder="Tätigkeit" required />
          <label class="checkbox-line"><input name="billable" type="checkbox" checked /> abrechenbar</label>
          <button class="primary-action" type="submit">${icon("plus")} Buchen</button>
        </form>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Benutzerverwaltung</span>
          <h2>Benutzerkonten und Rollen</h2>
        </div>
        <button class="primary-action" data-action="new-user">${icon("plus")} Benutzer anlegen</button>
      </div>
      <div class="data-table">
        <div class="table-head five"><span>Name</span><span>Login</span><span>Mitarbeiter</span><span>Rolle</span><span>Status</span></div>
        ${state.data.users.map((user) => `
          <div class="table-row five">
            <span>${escapeHtml(user.name)}</span>
            <span>${escapeHtml(user.email)}</span>
            <span>${escapeHtml(employeeNameById(user.employeeId))}</span>
            <span>${escapeHtml(user.role)}</span>
            <span class="pill ${toneClass(user.status)}">${escapeHtml(user.status)}</span>
          </div>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-header compact"><h2>Letzte Zeitbuchungen</h2></div>
      <div class="data-table">
        <div class="table-head six">
          <span>Datum</span><span>Projekt</span><span>Mitarbeiter</span><span>Phase</span><span>Tätigkeit</span><span>Stunden</span>
        </div>
        ${state.data.timeEntries.slice().reverse().map((entry) => `
          <div class="table-row six">
            <span>${formatDate(entry.date)}</span>
            <span>${escapeHtml(projectName(entry.projectId))}</span>
            <span>${escapeHtml(entry.employee)}</span>
            <span>${escapeHtml(entry.phase)}</span>
            <span>${escapeHtml(entry.activity)}</span>
            <span>${number.format(entry.hours)} h</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHonorar() {
  const result = calculateHonorar();
  const profile = honorarProfiles.find((item) => item.id === state.hoai.profileId) || honorarProfiles[0];

  return `
    <section class="layout-two wide-left">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Angebot</span>
            <h2>HOAI-orientierte Honorarkalkulation</h2>
          </div>
          <span class="pill tone-neutral">konfigurierbare Matrix</span>
        </div>
        <div class="calculator-grid">
          <label>
            Leistungsbild
            <select data-hoai name="profileId">
              ${honorarProfiles.map((item) => `<option value="${item.id}" ${item.id === state.hoai.profileId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </label>
          <label>
            Honorarzone
            <select data-hoai name="zoneId">
              ${honorarZones.map((item) => `<option value="${item.id}" ${item.id === state.hoai.zoneId ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </label>
          <label>
            Anrechenbare Kosten
            <input data-hoai name="chargeableCosts" type="number" min="0" step="1000" value="${state.hoai.chargeableCosts}" />
          </label>
          <label>
            Satzfaktor
            <input data-hoai name="rateFactor" type="number" min="0.5" max="1.8" step="0.01" value="${state.hoai.rateFactor}" />
          </label>
          <label>
            Nebenkosten %
            <input data-hoai name="incidentalPercent" type="number" min="0" max="30" step="0.5" value="${state.hoai.incidentalPercent}" />
          </label>
          <label>
            Nachlass %
            <input data-hoai name="discountPercent" type="number" min="0" max="40" step="0.5" value="${state.hoai.discountPercent}" />
          </label>
        </div>
        <div class="phase-grid">
          ${profile.phases.map(([phase, share]) => `
            <label class="phase-box">
              <input data-phase value="${escapeHtml(phase)}" type="checkbox" ${state.hoai.selectedPhases.includes(phase) ? "checked" : ""} />
              <span>${escapeHtml(phase)}</span>
              <strong>${share}%</strong>
            </label>
          `).join("")}
        </div>
      </div>
      <aside class="panel panel-strong">
        <div class="panel-header compact">
          <h2>Kalkulation</h2>
        </div>
        <div class="sum-list">
          <div><span>Grundhonorar</span><strong>${money(result.baseFee)}</strong></div>
          <div><span>Leistungsphasen</span><strong>${percent.format(result.phaseShare)} %</strong></div>
          <div><span>Honorar netto</span><strong>${money(result.phaseFee)}</strong></div>
          <div><span>Nebenkosten</span><strong>${money(result.incidentals)}</strong></div>
          <div><span>Nachlass</span><strong>-${money(result.discount)}</strong></div>
          <div class="sum-total"><span>Angebot netto</span><strong>${money(result.net)}</strong></div>
          <div><span>USt. 19 %</span><strong>${money(result.vat)}</strong></div>
          <div class="sum-total"><span>Angebot brutto</span><strong>${money(result.gross)}</strong></div>
        </div>
        <div class="notice">
          <strong>Prüfpunkt</strong>
          <span>Die Tabellenwerte sind bewusst konfigurierbar und müssen vor produktiver Nutzung fachlich und rechtlich validiert werden.</span>
        </div>
      </aside>
    </section>
  `;
}

function calculateHonorar() {
  const profile = honorarProfiles.find((item) => item.id === state.hoai.profileId) || honorarProfiles[0];
  const zone = honorarZones.find((item) => item.id === state.hoai.zoneId) || honorarZones[2];
  const phaseShare = profile.phases
    .filter(([phase]) => state.hoai.selectedPhases.includes(phase))
    .reduce((sum, [, share]) => sum + share, 0);
  const baseFee = Number(state.hoai.chargeableCosts || 0) * profile.basePercent * zone.factor * Number(state.hoai.rateFactor || 1);
  const phaseFee = baseFee * (phaseShare / 100);
  const incidentals = phaseFee * (Number(state.hoai.incidentalPercent || 0) / 100);
  const discount = (phaseFee + incidentals) * (Number(state.hoai.discountPercent || 0) / 100);
  const net = phaseFee + incidentals - discount;
  const vat = net * 0.19;
  return { baseFee, phaseShare, phaseFee, incidentals, discount, net, vat, gross: net + vat };
}

function renderContracts() {
  return `
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Verträge</span>
            <h2>Aufträge und Abrechnung</h2>
          </div>
        </div>
        <div class="data-table">
          <div class="table-head five"><span>Titel</span><span>Projekt</span><span>Version</span><span>Netto</span><span>Status</span></div>
          ${state.data.contracts.map((contract) => `
            <div class="table-row five">
              <span>${escapeHtml(contract.title)}</span>
              <span>${escapeHtml(projectName(contract.projectId))}</span>
              <span>${escapeHtml(contract.version)}</span>
              <span>${money(contract.netFee)}</span>
              <span class="pill ${toneClass(contract.status)}">${escapeHtml(contract.status)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header compact"><h2>Nachträge</h2></div>
        ${state.data.addenda.map((addendum) => `
          <article class="record">
            <div>
              <strong>${escapeHtml(addendum.title)}</strong>
              <span>${escapeHtml(projectName(addendum.projectId))} · fällig ${formatDate(addendum.due)}</span>
            </div>
            <span>${money(addendum.amount)}</span>
            <span class="pill ${toneClass(addendum.status)}">${escapeHtml(addendum.status)}</span>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-header compact"><h2>Abrechnungsstand</h2></div>
      ${state.data.projects.map((project) => `
        <div class="billing-row">
          <span>${escapeHtml(project.number)} ${escapeHtml(project.name)}</span>
          ${progressBar((project.invoiced / Math.max(project.contractedFee || project.budgetFee, 1)) * 100, `${money(project.invoiced)} abgerechnet`)}
          <strong>${money((project.contractedFee || project.budgetFee) - project.invoiced)} offen</strong>
        </div>
      `).join("")}
    </section>
  `;
}

function renderDocuments() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Dokumentenakte</span>
          <h2>Pläne, Berechnungen und Versionen</h2>
        </div>
        <span class="pill tone-neutral">${state.data.documents.length} Dateien</span>
      </div>
      <div class="data-table docs">
        <div class="table-head six"><span>Name</span><span>Projekt</span><span>Typ</span><span>Revision</span><span>Status</span><span>Stand</span></div>
        ${state.data.documents.map((document) => `
          <div class="table-row six">
            <span>
              <strong>${escapeHtml(document.name)}</strong>
              ${document.storageUri ? `<button class="inline-action" data-action="open-document-file" data-document-id="${escapeHtml(document.id)}" title="Datei öffnen">${icon("open")} Öffnen</button>` : ""}
            </span>
            <span>${escapeHtml(projectName(document.projectId))}</span>
            <span>${escapeHtml(document.type)}</span>
            <span>${escapeHtml(document.revision)}</span>
            <span class="pill ${toneClass(document.status)}">${escapeHtml(document.status)}</span>
            <span>${formatDate(document.updated)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCommunication() {
  return `
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Kommunikation</span>
            <h2>Schriftverkehr, Protokolle, Aktennotizen</h2>
          </div>
        </div>
        ${state.data.correspondence.map((item) => `
          <article class="mail-row">
            <span class="pill tone-neutral">${escapeHtml(item.channel)}</span>
            <div>
              <strong>${escapeHtml(item.subject)}</strong>
              <small>${escapeHtml(projectName(item.projectId))} · ${escapeHtml(item.from)} · ${formatDate(item.date)}</small>
            </div>
            <span>${escapeHtml(item.decision)}</span>
          </article>
        `).join("")}
      </div>
      ${renderRecommendationPanel()}
    </section>
  `;
}

function renderTasks() {
  const columns = ["offen", "in Arbeit", "erledigt"];
  return `
    <section class="layout-two wide-left">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Aufgaben</span>
            <h2>Board</h2>
          </div>
        </div>
        <div class="kanban">
          ${columns.map((column) => `
            <section class="kanban-column">
              <h3>${escapeHtml(column)}</h3>
              ${state.data.tasks.filter((task) => task.status === column).map((task) => `
                <article class="task-card">
                  <strong>${escapeHtml(task.title)}</strong>
                  <span>${escapeHtml(projectName(task.projectId))}</span>
                  <small>${escapeHtml(task.assignee)} · ${formatDate(task.due)}</small>
                  <div>
                    <span class="pill ${toneClass(task.priority)}">${escapeHtml(task.priority)}</span>
                    <span class="pill tone-neutral">${escapeHtml(task.area)}</span>
                  </div>
                </article>
              `).join("") || emptyState("Leer")}
            </section>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header compact"><h2>Fristen</h2></div>
        ${state.data.deadlines
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(renderDeadlineItem)
          .join("")}
      </div>
    </section>
    <section class="layout-three">
      ${renderQuickTaskPanel()}
      <div class="panel">
        <div class="panel-header compact"><h2>Prioritäten</h2></div>
        ${["hoch", "mittel", "normal"].map((priority) => {
          const count = state.data.tasks.filter((task) => task.priority === priority && task.status !== "erledigt").length;
          return `<div class="list-item"><span>${escapeHtml(priority)}</span><strong>${count}</strong></div>`;
        }).join("")}
      </div>
      <div class="panel">
        <div class="panel-header compact"><h2>Bereiche</h2></div>
        ${["Planung", "Honorar", "Berechnung", "Angebot", "Schriftverkehr"].map((area) => {
          const count = state.data.tasks.filter((task) => task.area === area).length;
          return `<div class="list-item"><span>${escapeHtml(area)}</span><strong>${count}</strong></div>`;
        }).join("")}
      </div>
    </section>
  `;
}

function renderSchedule() {
  const rangeStart = new Date("2026-03-01T00:00:00");
  const rangeEnd = new Date("2027-02-28T00:00:00");
  const total = rangeEnd - rangeStart;

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Terminplan</span>
          <h2>Projektphasen</h2>
        </div>
        <span class="pill tone-neutral">März 2026 - Februar 2027</span>
      </div>
      <div class="timeline">
        ${state.data.schedule.map((item) => {
          const start = new Date(`${item.start}T00:00:00`);
          const end = new Date(`${item.end}T00:00:00`);
          const left = Math.max(0, ((start - rangeStart) / total) * 100);
          const width = Math.min(100 - left, ((end - start) / total) * 100);
          return `
            <div class="timeline-row">
              <span>${escapeHtml(projectName(item.projectId))}<small>${escapeHtml(item.phase)}</small></span>
              <div class="timeline-track">
                <div class="timeline-bar" style="left:${left}%;width:${width}%">
                  <span style="width:${Math.max(8, item.progress)}%"></span>
                </div>
              </div>
              <strong>${item.progress}%</strong>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderControlling() {
  return `
    <section class="metric-grid">
      ${metric("Forecast Marge", `${percent.format(average(state.data.projects.map((project) => project.marginForecast)))} %`, "gewichtete Sicht im Ausbau", "good")}
      ${metric("Offene Honorare", money(state.data.projects.reduce((sum, project) => sum + (project.contractedFee || project.budgetFee) - project.invoiced, 0)), "noch nicht berechnet", "blue")}
      ${metric("Externe Kosten", money(state.data.projects.reduce((sum, project) => sum + project.externalCosts, 0)), "Nebenkosten und Fremdleistungen", "warning")}
      ${metric("Risikoprojekte", state.data.projects.filter((project) => project.risk !== "niedrig").length, "mittleres oder hohes Risiko", "ink")}
    </section>
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Projektcontrolling</span>
          <h2>Budget, Ist und Ergebnis</h2>
        </div>
      </div>
      <div class="data-table">
        <div class="table-head six"><span>Projekt</span><span>Auftrag</span><span>Abgerechnet</span><span>Stunden</span><span>Marge</span><span>Risiko</span></div>
        ${state.data.projects.map((project) => `
          <div class="table-row six">
            <span>${escapeHtml(project.number)} ${escapeHtml(project.name)}</span>
            <span>${money(project.contractedFee || project.budgetFee)}</span>
            <span>${money(project.invoiced)}</span>
            <span>${percent.format((project.hoursActual / project.hoursBudget) * 100)} %</span>
            <span>${project.marginForecast} %</span>
            <span class="pill ${toneClass(project.risk)}">${escapeHtml(project.risk)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSecurity() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <span class="eyebrow">Benutzer</span>
          <h2>Konten, Status und Rollen</h2>
        </div>
        <button class="primary-action" data-action="new-user">${icon("plus")} Benutzer anlegen</button>
      </div>
      <div class="data-table">
        <div class="table-head five"><span>Name</span><span>Login</span><span>Mitarbeiter</span><span>Rolle</span><span>Status</span></div>
        ${state.data.users.map((user) => `
          <div class="table-row five">
            <span>${escapeHtml(user.name)}</span>
            <span>${escapeHtml(user.email)}</span>
            <span>${escapeHtml(employeeNameById(user.employeeId))}</span>
            <span>${escapeHtml(user.role)}</span>
            <span class="pill ${toneClass(user.status)}">${escapeHtml(user.status)}</span>
          </div>
        `).join("")}
      </div>
    </section>
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Benutzerrechte</span>
            <h2>Rollenmatrix</h2>
          </div>
        </div>
        <div class="data-table">
          <div class="table-head five"><span>Rolle</span><span>Projekte</span><span>Finanzen</span><span>Dokumente</span><span>Admin</span></div>
          ${state.data.roles.map((role) => `
            <div class="table-row five">
              <span>${escapeHtml(role.name)}</span>
              <span>${escapeHtml(role.projects)}</span>
              <span>${escapeHtml(role.finances)}</span>
              <span>${escapeHtml(role.documents)}</span>
              <span class="pill ${role.admin ? "tone-good" : "tone-neutral"}">${role.admin ? "ja" : "nein"}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header compact"><h2>Backup & Verschlüsselung</h2></div>
        ${state.data.backups.map((backup) => `
          <article class="record">
            <div>
              <strong>${escapeHtml(backup.target)}</strong>
              <span>${escapeHtml(backup.retention)} · ${escapeHtml(backup.lastRun)}</span>
            </div>
            <span class="pill ${toneClass(backup.status)}">${escapeHtml(backup.status)}</span>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="panel-header compact"><h2>Lizenzierung</h2></div>
      <div class="license-grid">
        ${state.data.licenses.map((license) => `
          <article class="license">
            <strong>${escapeHtml(license.plan)}</strong>
            <span>${license.seats} Seats</span>
            <small>${escapeHtml(license.sync)}</small>
            <span class="pill ${toneClass(license.status)}">${escapeHtml(license.status)}</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderIntegrations() {
  return `
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Schnittstellen</span>
            <h2>KI- und API-Anbindungen</h2>
          </div>
        </div>
        ${state.data.integrations.map((integration) => `
          <article class="record">
            <div>
              <strong>${escapeHtml(integration.name)}</strong>
              <span>${escapeHtml(integration.scope)}</span>
            </div>
            <span class="pill ${toneClass(integration.status)}">${escapeHtml(integration.status)}</span>
          </article>
        `).join("")}
      </div>
      <div class="panel panel-strong">
        <div class="panel-header compact"><h2>API-Entwurf</h2></div>
        <div class="api-list">
          <code>GET /api/projects</code>
          <code>POST /api/time-entries</code>
          <code>POST /api/honorars/calculate</code>
          <code>GET /api/documents/:projectId</code>
          <code>PUT /api/sync/state</code>
          <code>POST /api/ai/recommendations</code>
        </div>
      </div>
    </section>
  `;
}

function renderSettings() {
  const sync = state.sync;
  return `
    <section class="layout-two wide-left">
      <div class="panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Server-Synchronisation</span>
            <h2>RPi- oder Büroserver einrichten</h2>
          </div>
          <span class="pill ${state.syncBusy ? "tone-warning" : "tone-neutral"}">${escapeHtml(state.syncStatus)}</span>
        </div>
        <form class="settings-form" data-form="sync-settings">
          <div class="settings-grid">
            ${field("endpoint", "Serveradresse / IP", sync.endpoint || "", "text")}
            ${field("token", "Sync-Token", sync.token || "", "password")}
            ${field("scanPrefix", "IP-Suchbereich", sync.scanPrefix || "192.168.178", "text")}
            ${field("scanPort", "Port", sync.scanPort || 4173, "number")}
            ${field("scanStart", "Start-IP", sync.scanStart || 2, "number")}
            ${field("scanEnd", "End-IP", sync.scanEnd || 254, "number")}
          </div>
          <label class="checkbox-line"><input name="autoSync" type="checkbox" ${sync.autoSync ? "checked" : ""} /> automatische Synchronisation vorbereiten</label>
          <div class="settings-actions">
            <button class="primary-action" type="submit">${icon("save")} Einstellungen speichern</button>
            <button class="icon-button text-button" type="button" data-action="test-sync-server">${icon("plug")} Verbindung testen</button>
            <button class="icon-button text-button" type="button" data-action="discover-sync-servers">${icon("settings")} Server suchen</button>
            <button class="icon-button text-button" type="button" data-action="push-sync">${icon("save")} Zum Server hochladen</button>
            <button class="icon-button text-button" type="button" data-action="pull-sync">${icon("open")} Vom Server laden</button>
          </div>
        </form>
      </div>
      <aside class="panel panel-strong">
        <div class="panel-header compact"><h2>Status</h2></div>
        <div class="sync-status">
          <div><span>Aktiver Server</span><strong>${escapeHtml(sync.endpoint || "nicht gesetzt")}</strong></div>
          <div><span>Letzter Sync</span><strong>${escapeHtml(sync.lastSync || "noch nie")}</strong></div>
          <div><span>Browser-Demo</span><strong>${desktopBridgeAvailable() ? "Windows-App" : "Web-/Browserbetrieb"}</strong></div>
        </div>
        <div class="notice">
          <strong>Hinweis</strong>
          <span>Für unterwegs bitte nicht ungeschützt ins Internet stellen. Sicherer ist Zugriff per VPN, Tailscale/WireGuard oder HTTPS-Reverse-Proxy mit Authentifizierung.</span>
        </div>
      </aside>
    </section>
    <section class="layout-two">
      <div class="panel">
        <div class="panel-header compact">
          <div>
            <span class="eyebrow">Raspberry-Pi-Installation</span>
            <h2>Sync-Server auf dem RPi installieren</h2>
          </div>
        </div>
        <div class="install-steps">
          <p>Auf Raspberry Pi OS Lite oder einer anderen Debian-/Ubuntu-Linux-Umgebung per SSH ausführen:</p>
          <pre class="command-block"><code>${escapeHtml(rpiInstallCommands)}</code></pre>
          <p>Danach in dieser Ansicht als Serveradresse <code>http://&lt;rpi-ip&gt;:4173</code> eintragen, den angezeigten Sync-Token übernehmen und Verbindung testen.</p>
        </div>
      </div>
      <aside class="panel panel-strong">
        <div class="panel-header compact"><h2>RPi-Prüfung</h2></div>
        <div class="sync-status">
          <div><span>Dienststatus</span><strong>sudo systemctl status projektverwaltung-wtf</strong></div>
          <div><span>Server-Test</span><strong>curl http://localhost:4173/api/health</strong></div>
          <div><span>Konfiguration</span><strong>/etc/projektverwaltung-wtf.env</strong></div>
        </div>
      </aside>
    </section>
    <section class="panel">
      <div class="panel-header compact">
        <h2>Gefundene Server</h2>
      </div>
      <div class="server-list">
        ${
          state.discoveredServers.length
            ? state.discoveredServers.map((server) => `
                <article class="server-card">
                  <div>
                    <strong>${escapeHtml(server.endpoint)}</strong>
                    <span>${escapeHtml(server.mode)} · ${escapeHtml(server.version || "")}</span>
                  </div>
                  <button class="icon-button text-button" type="button" data-action="use-discovered-server" data-endpoint="${escapeHtml(server.endpoint)}">Verwenden</button>
                </article>
              `).join("")
            : emptyState("Noch kein Server gefunden. IP-Bereich eintragen und Suche starten.")
        }
      </div>
    </section>
  `;
}

function projectOptions() {
  return state.data.projects
    .map((project) => `<option value="${project.id}" ${project.id === state.selectedProjectId ? "selected" : ""}>${escapeHtml(project.number)} - ${escapeHtml(project.name)}</option>`)
    .join("");
}

function employeeOptions() {
  return state.data.employees.map((employee) => `<option>${escapeHtml(employee.name)}</option>`).join("");
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, item) => sum + Number(item || 0), 0) / values.length;
}

function emptyState(label) {
  return `<div class="empty">${escapeHtml(label)}</div>`;
}

function nextId(prefix, items) {
  const max = items.reduce((highest, item) => {
    const numberPart = Number(String(item.id || "").replace(`${prefix}-`, ""));
    return Number.isFinite(numberPart) ? Math.max(highest, numberPart) : highest;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(2, "0")}`;
}

function nextProjectNumber() {
  const max = state.data.projects.reduce((highest, project) => {
    const numeric = Number(String(project.number || "").replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
  }, 25000);
  return String(max + 1).replace(/^(\d{2})(\d{3})$/, "$1-$2");
}

function employeeNameById(id) {
  if (!id) return "Nicht zugeordnet";
  return state.data.employees.find((employee) => employee.id === id)?.name || id;
}

function activeDocument() {
  return state.data.documents.find((document) => document.projectId === state.selectedProjectId && document.storageUri) || state.data.documents.find((document) => document.storageUri);
}

function closeModal() {
  state.modal = null;
  render();
}

function openModal(type) {
  state.modal = { type };
  render();
}

function toggleContextHelp() {
  state.helpOpen = !state.helpOpen;
  window.localStorage.setItem(HELP_KEY, state.helpOpen ? "1" : "0");
  render();
}

function normalizeEndpoint(value) {
  const trimmed = String(value || "").trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

function clampIpPart(value, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(1, Math.min(254, Math.round(numberValue)));
}

function readSyncSettingsForm() {
  const form = document.querySelector('[data-form="sync-settings"]');
  if (!form) return state.sync;
  const data = Object.fromEntries(new FormData(form).entries());
  const next = {
    ...state.sync,
    endpoint: normalizeEndpoint(data.endpoint),
    token: String(data.token || ""),
    scanPrefix: String(data.scanPrefix || "192.168.178").trim().replace(/\.$/, ""),
    scanPort: Math.max(1, Math.min(65535, Number(data.scanPort || 4173))),
    scanStart: clampIpPart(data.scanStart, 2),
    scanEnd: clampIpPart(data.scanEnd, 254),
    autoSync: data.autoSync === "on"
  };
  if (next.scanStart > next.scanEnd) {
    [next.scanStart, next.scanEnd] = [next.scanEnd, next.scanStart];
  }

  state.sync = next;
  saveSyncSettings();
  return next;
}

function syncHeaders() {
  const headers = { Accept: "application/json" };
  if (state.sync.token) {
    headers["X-Sync-Token"] = state.sync.token;
  }
  return headers;
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 1200) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      mode: "cors",
      ...options,
      signal: controller.signal
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function syncRequest(path, options = {}) {
  const endpoint = normalizeEndpoint(state.sync.endpoint);
  if (!endpoint) {
    throw new Error("Bitte zuerst eine Serveradresse eintragen.");
  }

  const headers = {
    ...syncHeaders(),
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  return await fetchJsonWithTimeout(`${endpoint}${path}`, { ...options, headers }, options.timeoutMs || 10000);
}

function setSyncBusy(message) {
  state.syncBusy = true;
  state.syncStatus = message;
  render();
}

function setSyncDone(message) {
  state.syncBusy = false;
  state.syncStatus = message;
  render();
}

async function testSyncServer() {
  readSyncSettingsForm();
  try {
    setSyncBusy("Verbindung wird geprüft...");
    const result = await syncRequest("/api/health", { timeoutMs: 3000 });
    setSyncDone(`${result.product || "Server"} ${result.version || ""} erreichbar`);
  } catch (error) {
    setSyncDone(`Verbindung fehlgeschlagen: ${error.message}`);
  }
}

function discoveryCandidates(settings) {
  const candidates = new Set();
  if (settings.endpoint) candidates.add(normalizeEndpoint(settings.endpoint));
  candidates.add(`http://projektverwaltung-wtf.local:${settings.scanPort || 4173}`);
  candidates.add(`http://raspberrypi.local:${settings.scanPort || 4173}`);

  if (settings.scanPrefix) {
    for (let ip = settings.scanStart; ip <= settings.scanEnd; ip += 1) {
      candidates.add(`http://${settings.scanPrefix}.${ip}:${settings.scanPort || 4173}`);
    }
  }

  return [...candidates];
}

async function probeSyncServer(endpoint) {
  try {
    const result = await fetchJsonWithTimeout(`${endpoint}/api/health`, { headers: syncHeaders() }, 850);
    if (result.product !== "Projektverwaltung_WTF") return null;
    return {
      endpoint,
      version: result.version || "",
      mode: result.mode || "server",
      syncEnabled: Boolean(result.syncEnabled)
    };
  } catch {
    return null;
  }
}

async function discoverSyncServers() {
  const settings = readSyncSettingsForm();
  setSyncBusy("Netzwerk wird durchsucht...");
  const candidates = discoveryCandidates(settings);
  const found = [];
  let index = 0;
  const workers = Array.from({ length: Math.min(24, candidates.length) }, async () => {
    while (index < candidates.length) {
      const endpoint = candidates[index];
      index += 1;
      const result = await probeSyncServer(endpoint);
      if (result) found.push(result);
    }
  });

  await Promise.all(workers);
  state.discoveredServers = found.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
  setSyncDone(found.length ? `${found.length} Server gefunden` : "Kein Server gefunden");
}

async function pushSyncState() {
  readSyncSettingsForm();
  try {
    setSyncBusy("Daten werden zum Server übertragen...");
    const result = await syncRequest("/api/sync/state", {
      method: "PUT",
      body: JSON.stringify(projectFilePayload()),
      timeoutMs: 15000
    });
    state.sync.lastSync = result.savedAt || new Date().toISOString();
    saveSyncSettings();
    state.dirty = false;
    state.status = "Mit Server synchronisiert";
    setSyncDone(`Gespeichert: ${state.sync.lastSync}`);
  } catch (error) {
    setSyncDone(`Sync fehlgeschlagen: ${error.message}`);
  }
}

async function pullSyncState() {
  readSyncSettingsForm();
  if (!window.confirm("Daten vom Server laden und lokale Browserdaten ersetzen?")) return;

  try {
    setSyncBusy("Daten werden vom Server geladen...");
    const result = await syncRequest("/api/sync/state", { timeoutMs: 15000 });
    if (!result.payload?.data) {
      throw new Error("Auf dem Server ist noch kein Projektstand gespeichert.");
    }

    state.data = normalizeData(result.payload.data);
    state.selectedProjectId = state.data.projects[0]?.id || "";
    state.dirty = false;
    state.status = "Vom Server geladen";
    state.sync.lastSync = result.savedAt || new Date().toISOString();
    saveSyncSettings();
    persist();
    setSyncDone(`Geladen: ${state.sync.lastSync}`);
  } catch (error) {
    setSyncDone(`Laden fehlgeschlagen: ${error.message}`);
  }
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    state.route = routeButton.dataset.route;
    render();
    return;
  }

  const projectButton = event.target.closest("[data-project-id]");
  if (projectButton) {
    state.selectedProjectId = projectButton.dataset.projectId;
    render();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  const actionName = action.dataset.action;
  if (actionName === "toggle-help") {
    toggleContextHelp();
    return;
  }

  if (actionName === "test-sync-server") return testSyncServer();
  if (actionName === "discover-sync-servers") return discoverSyncServers();
  if (actionName === "push-sync") return pushSyncState();
  if (actionName === "pull-sync") return pullSyncState();
  if (actionName === "use-discovered-server") {
    state.sync.endpoint = action.dataset.endpoint || state.sync.endpoint;
    state.syncStatus = "Server übernommen";
    saveSyncSettings();
    render();
    return;
  }

  if (actionName === "close-modal") {
    if (event.target.closest("[data-modal-panel]") && event.target === action) {
      closeModal();
    } else if (!event.target.closest("[data-modal-panel]") || action.tagName === "BUTTON") {
      closeModal();
    }
    return;
  }

  if (actionName === "reset-demo") {
    state.data = normalizeData(clone(seedData));
    state.selectedProjectId = state.data.projects[0]?.id || "";
    markDirty("Demo-Daten wiederhergestellt");
    render();
    return;
  }

  if (actionName === "export") {
    exportData();
    return;
  }

  if (actionName === "open-file") return openProjectFile();
  if (actionName === "save-file") return saveProjectFile(false);
  if (actionName === "save-file-as") return saveProjectFile(true);
  if (actionName === "new-project") return openModal("project");
  if (actionName === "edit-project") return openModal("editProject");
  if (actionName === "duplicate-project") return duplicateActiveProject();
  if (actionName === "delete-project") return deleteActiveProject();
  if (actionName === "new-employee") return openModal("employee");
  if (actionName === "new-user") return openModal("user");
  if (actionName === "new-document") return openModal("document");
  if (actionName === "new-task") return openModal("task");
  if (actionName === "new-deadline") return openModal("deadline");
  if (actionName === "new-time") return openModal("time");
  if (actionName === "open-document") return openDocumentFile(activeDocument());
  if (actionName === "open-document-file") {
    return openDocumentFile(state.data.documents.find((document) => document.id === action.dataset.documentId));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    toggleContextHelp();
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-search]")) {
    const cursor = target.selectionStart;
    state.search = target.value;
    render();
    const search = document.querySelector("[data-search]");
    search?.focus();
    search?.setSelectionRange(cursor, cursor);
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-project-select]")) {
    state.selectedProjectId = target.value;
    render();
  }

  if (target.matches("[data-hoai]")) {
    state.hoai[target.name] = target.type === "number" ? Number(target.value) : target.value;
    if (target.name === "profileId") {
      const profile = honorarProfiles.find((item) => item.id === state.hoai.profileId) || honorarProfiles[0];
      state.hoai.selectedPhases = profile.phases.map(([phase]) => phase);
    }
    render();
  }

  if (target.matches("[data-phase]")) {
    const phase = target.value;
    state.hoai.selectedPhases = target.checked
      ? [...new Set([...state.hoai.selectedPhases, phase])]
      : state.hoai.selectedPhases.filter((item) => item !== phase);
    render();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!form.matches("[data-form]")) return;
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  if (form.dataset.form === "sync-settings") {
    readSyncSettingsForm();
    state.syncStatus = "Einstellungen gespeichert";
    render();
    return;
  }

  if (form.dataset.form === "project") {
    const project = {
      id: `P-${Date.now().toString().slice(-5)}`,
      number: data.number,
      name: data.name,
      client: data.client,
      address: data.address,
      discipline: data.discipline,
      phase: data.phase,
      status: data.status,
      risk: data.risk,
      priority: data.priority,
      manager: data.manager,
      deputy: "",
      start: data.start,
      due: data.due,
      budgetFee: Number(data.contractedFee || 0),
      contractedFee: Number(data.contractedFee || 0),
      invoiced: 0,
      paid: 0,
      chargeableCosts: Number(data.chargeableCosts || 0),
      externalCosts: 0,
      hoursBudget: Number(data.hoursBudget || 0),
      hoursActual: 0,
      progress: 0,
      marginTarget: 24,
      marginForecast: 24,
      tags: String(data.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
    };
    state.data.projects.push(project);
    state.selectedProjectId = project.id;
    state.route = "projects";
    state.modal = null;
    markDirty("Projekt angelegt");
    render();
    return;
  }

  if (form.dataset.form === "project-edit") {
    const project = activeProject();
    Object.assign(project, {
      number: data.number,
      name: data.name,
      client: data.client,
      address: data.address,
      discipline: data.discipline,
      phase: data.phase,
      status: data.status,
      risk: data.risk,
      priority: data.priority,
      manager: data.manager,
      start: data.start,
      due: data.due,
      contractedFee: Number(data.contractedFee || 0),
      budgetFee: Number(data.contractedFee || 0),
      chargeableCosts: Number(data.chargeableCosts || 0),
      hoursBudget: Number(data.hoursBudget || 0),
      tags: String(data.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
    });
    state.modal = null;
    markDirty("Projekt aktualisiert");
    render();
    return;
  }

  if (form.dataset.form === "employee") {
    const employee = {
      id: nextId("E", state.data.employees),
      name: data.name,
      role: data.role,
      team: data.team,
      weeklyHours: Number(data.weeklyHours || 0),
      costRate: Number(data.costRate || 0),
      billRate: Number(data.billRate || 0),
      utilization: Number(data.utilization || 0),
      rights: data.rights
    };
    state.data.employees.push(employee);
    if (data.createUser === "on") {
      state.data.users.push({
        id: nextId("U", state.data.users),
        name: employee.name,
        employeeId: employee.id,
        email: `${employee.name.toLowerCase().replaceAll(" ", ".")}@example.local`,
        role: employee.rights,
        status: "vorbereitet",
        lastLogin: ""
      });
    }
    state.modal = null;
    state.route = "team";
    markDirty("Mitarbeiter angelegt");
    render();
    return;
  }

  if (form.dataset.form === "user") {
    state.data.users.push({
      id: nextId("U", state.data.users),
      name: data.name,
      employeeId: data.employeeId,
      email: data.email,
      role: data.role,
      status: data.status,
      lastLogin: ""
    });
    state.modal = null;
    markDirty("Benutzer angelegt");
    render();
    return;
  }

  if (form.dataset.form === "document") {
    state.data.documents.push({
      id: `DOC-${Date.now().toString().slice(-6)}`,
      projectId: data.projectId,
      name: data.name,
      type: data.type,
      revision: data.revision,
      owner: data.owner,
      status: data.status,
      storageUri: data.storageUri,
      updated: data.updated
    });
    state.modal = null;
    state.route = "documents";
    markDirty("Datei registriert");
    render();
    return;
  }

  if (form.dataset.form === "deadline") {
    state.data.deadlines.push({
      id: `D-${Date.now().toString().slice(-5)}`,
      projectId: data.projectId,
      title: data.title,
      date: data.date,
      type: data.type,
      binding: data.binding === "on"
    });
    state.modal = null;
    markDirty("Frist angelegt");
    render();
    return;
  }

  if (form.dataset.form === "task") {
    state.data.tasks.push({
      id: `T-${Date.now().toString().slice(-5)}`,
      projectId: data.projectId,
      title: data.title,
      assignee: data.assignee,
      status: "offen",
      due: data.due,
      priority: data.priority,
      area: data.area || "Planung"
    });
    state.modal = null;
  }

  if (form.dataset.form === "time") {
    state.data.timeEntries.push({
      id: `Z-${Date.now().toString().slice(-5)}`,
      date: data.date,
      projectId: data.projectId,
      employee: data.employee,
      phase: data.phase,
      activity: data.activity,
      hours: Number(data.hours || 0),
      billable: data.billable === "on"
    });

    const project = state.data.projects.find((item) => item.id === data.projectId);
    if (project) project.hoursActual += Number(data.hours || 0);
    state.modal = null;
  }

  markDirty("Änderung gespeichert");
  render();
});

document.addEventListener("change", async (event) => {
  const target = event.target;
  if (!target.matches("[data-file-input]") || !target.files?.length) return;
  const file = target.files[0];
  const text = await file.text();
  importProjectData(text, file.name);
  target.value = "";
});

function duplicateActiveProject() {
  const project = activeProject();
  if (!project) return;
  const copy = {
    ...clone(project),
    id: `P-${Date.now().toString().slice(-5)}`,
    number: nextProjectNumber(),
    name: `${project.name} Kopie`,
    status: "angebot",
    invoiced: 0,
    paid: 0,
    hoursActual: 0,
    progress: 0
  };
  state.data.projects.push(copy);
  state.selectedProjectId = copy.id;
  state.route = "projects";
  markDirty("Projekt dupliziert");
  render();
}

function deleteActiveProject() {
  const project = activeProject();
  if (!project) return;
  const linkedItems = [
    ...state.data.tasks.filter((item) => item.projectId === project.id),
    ...state.data.documents.filter((item) => item.projectId === project.id),
    ...state.data.contracts.filter((item) => item.projectId === project.id)
  ];
  const message = linkedItems.length
    ? `Projekt "${project.name}" hat ${linkedItems.length} verknüpfte Einträge. Trotzdem löschen?`
    : `Projekt "${project.name}" löschen?`;
  if (!window.confirm(message)) return;
  state.data.projects = state.data.projects.filter((item) => item.id !== project.id);
  state.data.tasks = state.data.tasks.filter((item) => item.projectId !== project.id);
  state.data.deadlines = state.data.deadlines.filter((item) => item.projectId !== project.id);
  state.data.timeEntries = state.data.timeEntries.filter((item) => item.projectId !== project.id);
  state.data.documents = state.data.documents.filter((item) => item.projectId !== project.id);
  state.data.contracts = state.data.contracts.filter((item) => item.projectId !== project.id);
  state.data.addenda = state.data.addenda.filter((item) => item.projectId !== project.id);
  state.selectedProjectId = state.data.projects[0]?.id || "";
  markDirty("Projekt gelöscht");
  render();
}

function projectFilePayload() {
  return {
    format: "Projektverwaltung_WTF",
    version: 1,
    savedAt: new Date().toISOString(),
    data: state.data
  };
}

function desktopBridgeAvailable() {
  return Boolean(window.chrome?.webview);
}

function saveProjectFile(forceDialog) {
  const payload = JSON.stringify(projectFilePayload(), null, 2);
  if (desktopBridgeAvailable()) {
    window.chrome.webview.postMessage({
      type: forceDialog ? "saveDataAs" : "saveData",
      fileName: state.lastSavedFileName,
      payload
    });
    return;
  }

  downloadText(payload, state.lastSavedFileName || "Projektverwaltung_WTF.wtf.json");
  state.dirty = false;
  state.status = "Datei exportiert";
  render();
}

function openProjectFile() {
  if (desktopBridgeAvailable()) {
    window.chrome.webview.postMessage({ type: "openData" });
    return;
  }
  document.querySelector("[data-file-input]")?.click();
}

function importProjectData(text, fileName = "Projektverwaltung_WTF.wtf.json") {
  try {
    const parsed = JSON.parse(text);
    state.data = normalizeData(parsed.data || parsed);
    state.selectedProjectId = state.data.projects[0]?.id || "";
    state.lastSavedFileName = fileName;
    window.localStorage.setItem("projektverwaltung-wtf-file-name", fileName);
    state.dirty = false;
    state.status = `Datei geöffnet: ${fileName}`;
    persist();
    render();
  } catch (error) {
    window.alert(`Die Datei konnte nicht geöffnet werden: ${error.message}`);
  }
}

function downloadText(text, fileName) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function openDocumentFile(document) {
  if (!document?.storageUri) {
    window.alert("Für dieses Dokument ist noch kein Dateipfad hinterlegt.");
    return;
  }

  if (desktopBridgeAvailable()) {
    window.chrome.webview.postMessage({ type: "openExternalFile", path: document.storageUri });
    return;
  }

  window.alert(`Dateipfad: ${document.storageUri}`);
}

if (desktopBridgeAvailable()) {
  window.chrome.webview.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "fileOpened") {
      importProjectData(message.payload, message.fileName);
    }
    if (message.type === "fileSaved") {
      state.lastSavedFileName = message.fileName || state.lastSavedFileName;
      window.localStorage.setItem("projektverwaltung-wtf-file-name", state.lastSavedFileName);
      state.dirty = false;
      state.status = `Gespeichert: ${state.lastSavedFileName}`;
      render();
    }
    if (message.type === "desktopError") {
      window.alert(message.message || "Desktop-Aktion fehlgeschlagen.");
    }
  });
}

window.ProjektverwaltungApp = {
  openFile: openProjectFile,
  saveFile: () => saveProjectFile(false),
  saveFileAs: () => saveProjectFile(true),
  toggleHelp: toggleContextHelp
};

function exportData() {
  downloadText(JSON.stringify(projectFilePayload(), null, 2), "projektverwaltung-wtf-export.json");
}

render();
