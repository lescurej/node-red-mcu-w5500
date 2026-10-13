module.exports = function (RED) {
	require("../../lib/http-routes")(RED);
	function WiFiNode(config) {
		RED.nodes.createNode(this, config);
	}
	RED.nodes.registerType("mcu_wifi", WiFiNode);
};
