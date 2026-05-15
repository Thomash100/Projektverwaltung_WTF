# Raspberry-Pi-Installation

Diese Anleitung richtet einen Raspberry Pi oder einen kleinen Linux-Server als Sync-Ziel für die Developer-Beta ein. Der Server speichert den Projektstand als JSON-Datei unter `/var/lib/projektverwaltung-wtf` und stellt die Sync-API im lokalen Netzwerk bereit.

## Voraussetzungen

- Raspberry Pi OS Lite 64-bit oder Debian/Ubuntu.
- Netzwerkzugriff per SSH.
- Internetzugriff auf dem Raspberry Pi.
- Schreibrechte per `sudo`.

## Installation per GitHub

Auf dem Raspberry Pi per SSH anmelden und ausführen:

```bash
sudo apt update
sudo apt install -y git curl
git clone https://github.com/Thomash100/Projektverwaltung_WTF.git
cd Projektverwaltung_WTF
chmod +x rpi/install-rpi-server.sh
sudo ./rpi/install-rpi-server.sh
```

Das Skript installiert fehlende Pakete, kopiert die App nach `/opt/projektverwaltung-wtf`, legt den Datenordner `/var/lib/projektverwaltung-wtf` an, erzeugt einen Sync-Token und startet den systemd-Dienst `projektverwaltung-wtf`.

## Serverdaten anzeigen

Nach der Installation:

```bash
hostname -I
sudo grep SYNC_TOKEN /etc/projektverwaltung-wtf.env
sudo systemctl status projektverwaltung-wtf
curl http://localhost:4173/api/health
```

In der Windows-App oder Web-App unter `Einstellungen` eintragen:

```text
Serveradresse / IP: http://<rpi-ip>:4173
Sync-Token: Wert aus /etc/projektverwaltung-wtf.env
```

Danach `Verbindung testen` ausführen. Für die erste Übertragung `Zum Server hochladen` verwenden.

## Konfiguration

Die Serverkonfiguration liegt hier:

```bash
sudo nano /etc/projektverwaltung-wtf.env
sudo systemctl restart projektverwaltung-wtf
```

Wichtige Werte:

```bash
HOST=0.0.0.0
PORT=4173
SYNC_ENABLED=true
SYNC_TOKEN=bitte-aendern
DATA_DIR=/var/lib/projektverwaltung-wtf
CORS_ORIGIN=*
```

## Update auf dem Raspberry Pi

```bash
cd Projektverwaltung_WTF
git pull
sudo ./rpi/install-rpi-server.sh
```

## Nutzung unterwegs

Den Sync-Server nicht ungeschützt mit Portfreigabe ins Internet stellen. Für unterwegs sind VPN, Tailscale, WireGuard oder ein HTTPS-Reverse-Proxy mit Authentifizierung vorgesehen.

## Grenzen der Developer-Beta

- Aktuell gibt es einen Einzeldatei-Sync ohne Konfliktauflösung.
- Gleichzeitige Bearbeitung auf mehreren Geräten kann den zuletzt hochgeladenen Stand bevorzugen.
- Dokumente und Pläne werden als Dateiverweise gespeichert, noch nicht als vollständiger Dokumentenspeicher.
- Für produktiven Mehrplatzbetrieb fehlen noch Benutzerlogin, Audit-Log, TLS-Konfiguration, Backup-Retention und Rechteprüfung auf Serverebene.
