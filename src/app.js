import { honorarProfiles, honorarZones, seedData } from "./data.js";

const STORAGE_KEY = "projektverwaltung-wtf-state-v1";
const app = document.querySelector("#app");
const today = new Date("2026-05-15T00:00:00");

const routes = [
  ["dashboard", "Uebersicht", "dashboard"],
  ["projects", "Projekte", "building"],
  ["team", "Team & Zeiten", "users"],
  ["honorar", "Angebote & Honorar", "calculator"],
  ["contracts", "Vertraege & Nachtraege", "file"],
  ["documents", "Dokumente & Plaene", "folder"],
  ["communication", "Schriftverkehr", "message"],
  ["tasks", "Aufgaben & Fristen", "check"],
  ["schedule", "Terminplan", "calendar"],
  ["controlling", "Controlling", "chart"],
  ["security", "Rechte & Sicherheit", "lock"],
  ["integrations", "KI & API", "plug"]
];

const state = {
  data: loadData(),
  route: "dashboard",
  search: "",
  selectedProjectId: "",
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
    return stored ? JSON.parse(stored) : clone(seedData);
  } catch {
    return clone(seedData);
  }
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
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
    plus:
      '<path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z"/>',
    refresh:
      '<path d="M17.7 6.3A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.8-4.3L13 11h8V3l-3.3 3.3Z"/>',
    export:
      '<path d="M5 20h14v2H5v-2ZM11 3h2v10l3.5-3.5 1.4 1.4L12 16.8 6.1 10.9l1.4-1.4L11 13V3Z"/>'
  };

  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${icons[name] || icons.dashboard}</svg>`;
}

function toneClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (["hoch", "kritisch", "ueberfaellig"].includes(normalized)) return "tone-danger";
  if (["mittel", "angeboten", "in pruefung", "in arbeit"].includes(normalized)) return "tone-warning";
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
            <span>Buero-Plattform</span>
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
            <button class="icon-button" data-action="reset-demo" title="Demo-Daten zuruecksetzen">${icon("refresh")}</button>
          </div>
        </header>
        ${renderMain()}
      </main>
    </div>
  `;
}

function currentRouteLabel() {
  return routes.find(([id]) => id === state.route)?.[1] || "Uebersicht";
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
    integrations: renderIntegrations
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
            <h3>Naechste Fristen</h3>
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
  const label = delta < 0 ? "ueberfaellig" : `${delta} Tage`;
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
            <h2>Kapazitaet und Rechte</h2>
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
          <input name="activity" placeholder="Taetigkeit" required />
          <label class="checkbox-line"><input name="billable" type="checkbox" checked /> abrechenbar</label>
          <button class="primary-action" type="submit">${icon("plus")} Buchen</button>
        </form>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header compact"><h2>Letzte Zeitbuchungen</h2></div>
      <div class="data-table">
        <div class="table-head six">
          <span>Datum</span><span>Projekt</span><span>Mitarbeiter</span><span>Phase</span><span>Taetigkeit</span><span>Stunden</span>
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
          <strong>Pruefpunkt</strong>
          <span>Die Tabellenwerte sind bewusst konfigurierbar und muessen vor produktiver Nutzung fachlich und rechtlich validiert werden.</span>
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
            <span class="eyebrow">Vertraege</span>
            <h2>Auftraege und Abrechnung</h2>
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
        <div class="panel-header compact"><h2>Nachtraege</h2></div>
        ${state.data.addenda.map((addendum) => `
          <article class="record">
            <div>
              <strong>${escapeHtml(addendum.title)}</strong>
              <span>${escapeHtml(projectName(addendum.projectId))} · faellig ${formatDate(addendum.due)}</span>
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
          <h2>Plaene, Berechnungen und Versionen</h2>
        </div>
        <span class="pill tone-neutral">${state.data.documents.length} Dateien</span>
      </div>
      <div class="data-table docs">
        <div class="table-head six"><span>Name</span><span>Projekt</span><span>Typ</span><span>Revision</span><span>Status</span><span>Stand</span></div>
        ${state.data.documents.map((document) => `
          <div class="table-row six">
            <span>${escapeHtml(document.name)}</span>
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
        <div class="panel-header compact"><h2>Prioritaeten</h2></div>
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
        <span class="pill tone-neutral">Maerz 2026 - Februar 2027</span>
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
        <div class="panel-header compact"><h2>Backup & Verschluesselung</h2></div>
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
          <code>POST /api/ai/recommendations</code>
        </div>
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

  if (action.dataset.action === "reset-demo") {
    state.data = clone(seedData);
    state.selectedProjectId = state.data.projects[0]?.id || "";
    persist();
    render();
  }

  if (action.dataset.action === "export") {
    exportData();
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
  if (form.dataset.form === "task") {
    state.data.tasks.push({
      id: `T-${Date.now().toString().slice(-5)}`,
      projectId: data.projectId,
      title: data.title,
      assignee: data.assignee,
      status: "offen",
      due: data.due,
      priority: data.priority,
      area: "Planung"
    });
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
  }

  persist();
  render();
});

function exportData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projektverwaltung-wtf-export.json";
  link.click();
  URL.revokeObjectURL(url);
}

render();
