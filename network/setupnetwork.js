import config from "mc/config";
import Time from "time";
import Timer from "timer";
import Modules from "modules";
import WiFi from "embedded:network/interface/wifi";
import Ethernet from "ethernet";
import Net from "net";

function syncTime(sntp, done) {
	if (!sntp || Date.now() > 1672722071_000) {
		done();
		return;
	}
	const ntp = new device.network.ntp.client.io({
		...device.network.ntp.client,
		servers: [sntp]
	});
	ntp.getTime((error, value) => {
		if (!error)
			Time.set(value / 1000);
		ntp.close();
		done();
	});
}

function startWifi(onReady) {
	const modconfig = Modules.has("mod/config") ? Modules.importNow("mod/config") : {};
	const SSID = modconfig.ssid ?? config.ssid;
	const password = modconfig.password ?? config.password;
	const sntp = modconfig.sntp ?? config.sntp;

	if (!SSID) {
		trace("No Wi-Fi SSID\n");
		onReady();
		return;
	}

	let finished = false;
	const finish = () => {
		if (finished)
			return;
		finished = true;
		syncTime(sntp, onReady);
	};

	const w = new WiFi({
		onChanged(property) {
			if (property !== "connection")
				return;
			const connection = this.connection;
			if (connection < 500) {
				if (connection >= 400)
					trace(`Wi-Fi connected to "${this.SSID}"\n`);
				else if (connection <= 200) {
					trace("Wi-Fi disconnected\n");
					Timer.schedule(this.reconnect, 5_000, 1_000_000);
				}
				return;
			}
			trace(`IP address ${this.address}\n`);
			Timer.schedule(this.reconnect);
			finish();
		}
	});

	w.reconnect = Timer.set(() => {
		w.connect(password ? {SSID, password, secure: true} : {SSID});
	}, 0, 1_000_000);
}

function startEthernet(onReady) {
	const sntp = config.sntp;

	try {
		trace("Starting Ethernet\n");
		Ethernet.start();
	} catch {
		trace("Ethernet hardware not found.\n");
		onReady();
		return;
	}

	globalThis.ethernet = {connected: false};
	trace("Waiting for Ethernet link.\n");

	new Ethernet(function (msg) {
		switch (msg) {
			case "gotIP":
				trace(`IP address ${Net.get("IP", "ethernet")}\n`);
				trace(`MAC address ${Net.get("MAC", "ethernet")}\n`);
				ethernet.connected = true;
				syncTime(sntp, onReady);
				break;
			case "connect":
				trace("Ethernet connected\n");
				break;
			case "disconnect":
				ethernet.connected = false;
				trace("Ethernet disconnected\n");
				break;
		}
	});
}

export default function (done) {
	const modconfig = Modules.has("mod/config") ? Modules.importNow("mod/config") : {};
	const mode = modconfig.network?.mode ?? config.network?.mode ?? "auto";
	const wantWifi = mode === "wifi" || mode === "both" || (mode === "auto" && (modconfig.ssid ?? config.ssid));
	const wantEth = mode === "ethernet" || mode === "both" || (mode === "auto" && config.ethernet === true && !(modconfig.ssid ?? config.ssid));

	let pending = 0;
	const maybeDone = () => {
		pending -= 1;
		if (pending <= 0)
			done?.();
	};

	if (!wantWifi && !wantEth) {
		trace("No network interface enabled\n");
		done?.();
		return;
	}

	if (wantWifi) {
		pending += 1;
		startWifi(maybeDone);
	}
	if (wantEth) {
		pending += 1;
		startEthernet(maybeDone);
	}
}
