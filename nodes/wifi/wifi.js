import {Node} from "nodered";
import Net from "net";

class WiFiStatusNode extends Node {
	onMessage(msg, done) {
		let ip = "";
		try {
			ip = Net.get("IP", "wifi") ?? "";
		} catch {
			ip = "";
		}
		const connected = ip.length > 0;
		this.send({
			payload: {
				connected,
				ip
			},
			topic: "wifi"
		});
		this.status({
			fill: connected ? "green" : "grey",
			shape: "dot",
			text: connected ? ip : "offline"
		});
		done();
	}

	static type = "mcu_wifi";
	static {
		RED.nodes.registerType(this.type, this);
	}
}
