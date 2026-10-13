# @lescurej/node-red-mcu-network

Network bootstrap for [Node-RED MCU Edition](https://github.com/phoddie/node-red-mcu): **Wi‑Fi**, **Ethernet (W5500)**, or **both**, without mixing board and driver concerns.

## Three layers (do not confuse them)

| Layer | What it is | Where it lives |
|--------|------------|----------------|
| **Driver** | W5500, ENC28J60, internal PHY | Moddable `manifest.json_w5500`, etc. |
| **Pin profile** | SPI pins for a given wiring | `manifests/profiles/` (e.g. Waveshare ESP32-S3-ETH) |
| **Board target** | USB, LED, `host/provider`, IDF `sdkconfig` | Moddable `esp32/<target>` (e.g. `waveshare_esp32_s3_eth`) |

W5500 is **not** your board name. Waveshare ESP32-S3-ETH is **one profile** on top of the W5500 driver.

## `setupnetwork.js`

Replaces `setup/network` when included from the MCU tab manifest. Reads `config.network.mode`:

| Mode | Behavior |
|------|----------|
| `wifi` | SSID/password from deploy panel |
| `ethernet` | W5500 (requires driver + pin `defines` in manifest) |
| `both` | Wi‑Fi and Ethernet in parallel (more RAM) |
| `auto` (default) | Ethernet if `config.ethernet === true` and no SSID; else Wi‑Fi if SSID set |

Stock Node-RED MCU without this package: Wi‑Fi only via `setupwifi.js`.

## MCU tab manifest

1. Set **`build.NRMCU_NETWORK`** to this package path (after `npm install`):

```json
"build": {
  "NRMCU_NETWORK": "/Users/you/.node-red/node_modules/@lescurej/node-red-mcu-network"
}
```

2. Merge a **stack** from `manifests/stacks/` (copy JSON into the tab manifest, same object as `build` above).

| Stack file | Use case |
|------------|----------|
| `wifi-only.json` | Explicit unified setup (same as deploy SSID with mode `wifi`) |
| `ethernet-w5500-waveshare-esp32-s3-eth.json` | W5500 + Waveshare pinout + mode `ethernet` |
| `dual-w5500-waveshare-esp32-s3-eth.json` | RJ45 + Wi‑Fi (SSID required in deploy) |

New board with W5500: copy `manifests/profiles/w5500-waveshare-esp32-s3-eth.json`, change only `defines.ethernet.spi` / `int_pin`, add `manifests/stacks/ethernet-w5500-<your-board>.json`.

Moddable **platform** remains your board target (`esp32/waveshare_esp32_s3_eth` or `esp32/esp32s3_cdc` + W5500 sdkconfig path).

## Palette nodes (MCU tab)

| Node | Role |
|------|------|
| **mcu_wifi** | Wi‑Fi boot via `setupnetwork` + `{ ip, connected }` status |
| **mcu_ethernet** | W5500 profile + boot mode (`ethernet` / `both`) + link status |
| **mcu_bluetooth** | Pulls BLE client manifest; use with **BLE scanner / in / out** (Node-RED MCU) |

Drop **one** Ethernet or Wi‑Fi node in the MCU flow (or both for dual). You can remove the manual tab manifest if the node `moddable_manifest` covers your case.

## Install

```bash
cd ~/.node-red
npm install github:lescurej/node-red-mcu-network
```

Restart Node-RED.

## License

LGPL-3.0-or-later
