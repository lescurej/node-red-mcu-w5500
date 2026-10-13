const pkgRoot = require("./pkg-root");

let registered = false;

module.exports = function registerHttpRoutes(RED) {
	if (registered)
		return;
	registered = true;
	RED.httpAdmin.get("/lescurej/mcu-network/pkg-root", (_req, res) => {
		res.json({ NRMCU_NETWORK: pkgRoot });
	});
};
