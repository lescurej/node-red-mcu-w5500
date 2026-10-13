module.exports = function (RED) {
	require("../../lib/http-routes")(RED);
	function EthernetNode(config) {
		RED.nodes.createNode(this, config);
	}
	RED.nodes.registerType("mcu_ethernet", EthernetNode);
};
