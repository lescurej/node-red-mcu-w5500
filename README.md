# @lescurej/node-red-mcu-w5500

Ethernet (WIZnet W5500) for [Node-RED MCU Edition](https://github.com/phoddie/node-red-mcu) on **Waveshare ESP32-S3-ETH**.

## Hardware (on-board W5500)

| Signal | GPIO |
|--------|------|
| MOSI   | 11   |
| MISO   | 12   |
| SCLK   | 13   |
| CS     | 14   |
| INT    | 10   |
| RST    | 9 (handled by board power-up) |

WS2812 on GPIO **21** is independent of the Ethernet SPI bus.

## Moddable target

Use platform:

```text
esp32/waveshare_esp32_s3_eth
```

Target files live in your Moddable tree:

`$MODDABLE/build/devices/esp32/targets/waveshare_esp32_s3_eth/`

(SPI Ethernet enabled in `sdkconfig.defaults`.)

## Node-RED MCU tab manifest

1. Open your **MCU** flow tab → **MCU: manifest.json** edit pane.
2. Paste the contents of `manifests/waveshare-esp32-s3-eth.json`.
3. In the MCU deploy panel:
   - **Platform**: `esp32/waveshare_esp32_s3_eth`
   - **WiFi SSID / password**: leave **empty** (Ethernet setup skips Wi-Fi; if SSID is set, Moddable Ethernet setup is skipped).
4. Connect RJ45, build, flash.

Serial should show `Starting Ethernet`, then `IP address …` after DHCP.

## Static IP (optional)

Add under `config` in the tab manifest or deploy **Arguments** JSON:

```json
{
  "ethernet": {
    "address": "192.168.1.50",
    "mask": "255.255.255.0",
    "gateway": "192.168.1.1"
  }
}
```

(Exact keys depend on Moddable `mc/config`; use DHCP first to validate link.)

## Install (optional npm package)

```bash
cd ~/.node-red
npm install file:../Projects/node-red-mcu-w5500
```

The package only ships manifest JSON; you still paste it into the MCU tab.

## License

LGPL-3.0-or-later
