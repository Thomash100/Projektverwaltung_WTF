# Raspberry-Pi-Sync-Server

Kurzanleitung für Raspberry Pi OS Lite oder Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y git curl
git clone https://github.com/Thomash100/Projektverwaltung_WTF.git
cd Projektverwaltung_WTF
chmod +x rpi/install-rpi-server.sh
sudo ./rpi/install-rpi-server.sh
```

Nach der Installation zeigt das Skript die Netzwerk-URL und den Sync-Token an.

Prüfen:

```bash
sudo systemctl status projektverwaltung-wtf
curl http://localhost:4173/api/health
sudo grep SYNC_TOKEN /etc/projektverwaltung-wtf.env
```

In der App unter `Einstellungen` eintragen:

```text
Serveradresse / IP: http://<rpi-ip>:4173
Sync-Token: Wert aus /etc/projektverwaltung-wtf.env
```

Ausführliche Anleitung: `docs/RPI_INSTALLATION.md`.
