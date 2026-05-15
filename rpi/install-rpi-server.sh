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

if [[ ! -f "server.mjs" || ! -f "rpi/projektverwaltung-wtf.service" ]]; then
  echo "Bitte das Skript aus dem Projektordner starten:"
  echo "  cd Projektverwaltung_WTF"
  echo "  sudo ./rpi/install-rpi-server.sh"
  exit 1
fi

if ! command -v node >/dev/null 2>&1 || ! command -v rsync >/dev/null 2>&1; then
  apt-get update
  apt-get install -y nodejs rsync
fi

NODE_MAJOR="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
if [[ "${NODE_MAJOR}" -lt 18 ]]; then
  echo "Warnung: Node.js ${NODE_MAJOR} erkannt. Empfohlen ist Node.js 18 oder neuer."
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
  GENERATED_TOKEN="$(dd if=/dev/urandom bs=24 count=1 2>/dev/null | od -An -tx1 | tr -d ' \n')"
  sed -i "s/bitte-aendern/${GENERATED_TOKEN}/" "${ENV_FILE}"
fi

install -m 0644 rpi/projektverwaltung-wtf.service "${SERVICE_FILE}"
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}" "${DATA_DIR}"
chmod 0750 "${DATA_DIR}"

systemctl daemon-reload
systemctl enable projektverwaltung-wtf.service
systemctl restart projektverwaltung-wtf.service

PORT_VALUE="$(grep -E '^PORT=' "${ENV_FILE}" | cut -d= -f2- || true)"
TOKEN_VALUE="$(grep -E '^SYNC_TOKEN=' "${ENV_FILE}" | cut -d= -f2- || true)"
IP_VALUE="$(hostname -I 2>/dev/null | awk '{print $1}')"

echo
echo "Projektverwaltung_WTF Sync-Server läuft."
echo "URL im Netzwerk: http://${IP_VALUE:-<rpi-ip>}:${PORT_VALUE:-4173}"
echo "Sync-Token: ${TOKEN_VALUE:-<leer>}"
echo "Konfiguration: ${ENV_FILE}"
echo "Status: sudo systemctl status projektverwaltung-wtf.service"
echo "Test: curl http://localhost:${PORT_VALUE:-4173}/api/health"
