module.exports = function (RED) {
	require("../../lib/http-routes")(RED);
	function BluetoothNode(config) {
		RED.nodes.createNode(this, config);
	}
	RED.nodes.registerType("mcu_bluetooth", BluetoothNode);
};
