-- Initialer Datenbankentwurf fuer PostgreSQL oder eine spaetere SQLite-Anpassung.
-- Die aktuelle UI nutzt Seed-Daten im Browser; dieses Schema ist die Zielstruktur.

CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  role_id TEXT REFERENCES roles(id),
  name TEXT NOT NULL,
  email TEXT,
  team TEXT,
  weekly_hours NUMERIC(5,2) NOT NULL DEFAULT 40,
  cost_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  bill_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  address TEXT,
  discipline TEXT NOT NULL,
  phase TEXT,
  status TEXT NOT NULL,
  risk TEXT NOT NULL,
  manager_id TEXT REFERENCES employees(id),
  start_date DATE,
  due_date DATE,
  chargeable_costs NUMERIC(14,2) NOT NULL DEFAULT 0,
  contracted_fee NUMERIC(14,2) NOT NULL DEFAULT 0,
  invoiced_fee NUMERIC(14,2) NOT NULL DEFAULT 0,
  hours_budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  hours_actual NUMERIC(10,2) NOT NULL DEFAULT 0,
  progress NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE time_entries (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  employee_id TEXT NOT NULL REFERENCES employees(id),
  entry_date DATE NOT NULL,
  phase TEXT,
  activity TEXT NOT NULL,
  hours NUMERIC(6,2) NOT NULL CHECK (hours > 0),
  billable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT REFERENCES projects(id),
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  honorar_zone TEXT,
  chargeable_costs NUMERIC(14,2) NOT NULL DEFAULT 0,
  phase_selection JSONB NOT NULL DEFAULT '[]'::jsonb,
  net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contracts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  signed_at DATE,
  net_fee NUMERIC(14,2) NOT NULL DEFAULT 0,
  billing_mode TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE addenda (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  contract_id TEXT REFERENCES contracts(id),
  title TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  due_date DATE
);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  contract_id TEXT REFERENCES contracts(id),
  invoice_number TEXT NOT NULL,
  net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  gross_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  issued_at DATE,
  paid_at DATE,
  status TEXT NOT NULL
);

CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  revision TEXT NOT NULL,
  storage_uri TEXT NOT NULL,
  checksum TEXT,
  owner_id TEXT REFERENCES employees(id),
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE correspondence (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  channel TEXT NOT NULL,
  sender TEXT,
  subject TEXT NOT NULL,
  decision TEXT,
  owner_id TEXT REFERENCES employees(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  assignee_id TEXT REFERENCES employees(id),
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  due_date DATE,
  area TEXT
);

CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  milestone_type TEXT NOT NULL,
  starts_at DATE,
  ends_at DATE,
  binding BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  actor_employee_id TEXT REFERENCES employees(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
