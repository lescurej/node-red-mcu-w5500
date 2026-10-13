import {Node} from "nodered";
import Net from "net";

class EthernetStatusNode extends Node {
	onMessage(msg, done) {
		let ip = "";
		let mac = "";
		try {
			ip = Net.get("IP", "ethernet") ?? "";
			mac = Net.get("MAC", "ethernet") ?? "";
		} catch {
			ip = "";
			mac = "";
		}
		const link = globalThis.ethernet?.connected === true || ip.length > 0;
		this.send({
			payload: {
				link,
				ip,
				mac
			},
			topic: "ethernet"
		});
		this.status({
			fill: link ? "green" : "grey",
			shape: "dot",
			text: link ? ip || "link" : "no link"
		});
		done();
	}

	static type = "mcu_ethernet";
	static {
		RED.nodes.registerType(this.type, this);
	}
}
