import {Node} from "nodered";

class BluetoothEnableNode extends Node {
	onStart(config) {
		super.onStart(config);
		this.status({ fill: "blue", shape: "ring", text: "BLE stack" });
	}

	onMessage(msg, done) {
		this.send({
			payload: {
				enabled: true,
				hint: "Use BLE scanner / BLE in / BLE out nodes in this flow"
			},
			topic: "bluetooth"
		});
		done();
	}

	static type = "mcu_bluetooth";
	static {
		RED.nodes.registerType(this.type, this);
	}
}
