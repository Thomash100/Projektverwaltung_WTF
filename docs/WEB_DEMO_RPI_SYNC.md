# Web-Demo, Onlinebetrieb und Raspberry-Pi-Sync

## Demo auf der Internetseite

Die aktuelle Oberfläche kann als statische Web-Demo auf einer Homepage bereitgestellt werden. Dafür werden mindestens diese Dateien veröffentlicht:

Projekt / Repository:

- Projektverwaltung_WTF: https://github.com/Thomash100/Projektverwaltung_WTF.git

Online-Demo:

- https://projects.systemmedia.de/projektverwaltung-wtf/

```text
index.html
server.mjs
package.json
src/
docs/
database/
```

Für eine reine Demo reicht statisches Hosting aus. In diesem Modus bleiben Daten im Browser des Besuchers und können per JSON exportiert werden. Produktive Büro- oder Kundendaten sollten nicht in einer öffentlichen Demo gespeichert werden.

## Onlineversion für unterwegs

Für echte Nutzung unterwegs sollte die App nicht ungeschützt ins Internet gestellt werden. Empfohlene Varianten:

1. Zugriff per VPN, Tailscale oder WireGuard auf den Büroserver oder Raspberry Pi.
2. HTTPS-Reverse-Proxy mit Authentifizierung vor dem Node-Server.
3. Später ein richtiger Mehrplatzserver mit Benutzerlogin, Rollen, Audit-Log und verschlüsseltem Dokumentenspeicher.

## Raspberry Pi als Sync-Server

Der Node-Server enthält eine kleine Sync-API:

```text
GET  /api/health
GET  /api/discovery
GET  /api/sync/state
PUT  /api/sync/state
POST /api/sync/state
```

Der Sync wird erst aktiv, wenn `SYNC_ENABLED=true` gesetzt ist. Wenn `SYNC_TOKEN` gesetzt ist, muss die App diesen Token in den Einstellungen eintragen.

Beispielumgebung:

```bash
HOST=0.0.0.0
PORT=4173
SYNC_ENABLED=true
SYNC_TOKEN=bitte-aendern
DATA_DIR=/var/lib/projektverwaltung-wtf
CORS_ORIGIN=*
```

Die Windows-App und die Browser-App haben unter `Einstellungen` eine Server-Suche. Dort kann ein IP-Bereich wie `192.168.178` gescannt, ein Server übernommen, die Verbindung getestet und ein Projektstand hoch- oder heruntergeladen werden.

## Installation auf dem Raspberry Pi

Kurzbefehl auf Raspberry Pi OS Lite oder Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y git curl
git clone https://github.com/Thomash100/Projektverwaltung_WTF.git
cd Projektverwaltung_WTF
chmod +x rpi/install-rpi-server.sh
sudo ./rpi/install-rpi-server.sh
```

Die ausführliche Schritt-für-Schritt-Anleitung steht in [RPI_INSTALLATION.md](RPI_INSTALLATION.md).

## Einschränkungen der Developer-Beta

- Die Synchronisation ist aktuell ein bewusster Einzeldatei-Sync, noch keine Konfliktauflösung.
- Gleichzeitige Bearbeitung an mehreren Geräten kann den letzten Stand überschreiben.
- Dokumente und Pläne werden weiterhin als Dateiverweise gespeichert, nicht als vollständige Dateiablage.
- Für öffentliche Internetnutzung fehlen noch Login, Rechteprüfung, Audit-Log, TLS-Konfiguration und Backup-Retention auf Produktivniveau.
