#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/projektverwaltung-wtf"
DATA_DIR="/var/lib/projektverwaltung-wtf"
ENV_FILE="/etc/projektverwaltung-wtf.env"
SERVICE_FILE="/etc/systemd/system/projektverwaltung-wtf.service"
APP_USER="projektwtf"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Bitte mit sudo ausführen."
  exit 1
fi

if ! command -v node >/dev/null 2>&1 || ! command -v rsync >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nodejs rsync
fi

if ! id "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --home "${APP_DIR}" --shell /usr/sbin/nologin "${APP_USER}"
fi

mkdir -p "${APP_DIR}" "${DATA_DIR}"
rsync -a --delete \
  --exclude ".git" \
  --exclude "dist" \
  --exclude "build-installer" \
  --exclude "desktop/**/bin" \
  --exclude "desktop/**/obj" \
  --exclude "installer/setup/bin" \
  --exclude "installer/setup/obj" \
  ./ "${APP_DIR}/"

if [[ ! -f "${ENV_FILE}" ]]; then
  install -m 0640 rpi/projektverwaltung-wtf.env.example "${ENV_FILE}"
  sed -i "s/bitte-aendern/$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)/" "${ENV_FILE}"
fi

install -m 0644 rpi/projektverwaltung-wtf.service "${SERVICE_FILE}"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}" "${DATA_DIR}"
chmod 0750 "${DATA_DIR}"

systemctl daemon-reload
systemctl enable projektverwaltung-wtf.service
systemctl restart projektverwaltung-wtf.service

echo "Projektverwaltung_WTF Sync-Server läuft."
echo "Konfiguration: ${ENV_FILE}"
echo "Status: systemctl status projektverwaltung-wtf.service"
